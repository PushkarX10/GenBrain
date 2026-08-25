"""
GenBrain — Quiz Generation Router

POST /api/quiz/generate

Generates multiple-choice quiz questions with LLM-generated distractors.
Used for both regular quizzes and the weekly Boss Battle.
"""

import random

from fastapi import APIRouter

from app.models.quiz import (
    BossBattleRequest,
    QuizGenerateRequest,
    QuizGenerateResponse,
    QuizOption,
    QuizQuestion,
)
from app.services.ollama_client import ollama_generate, ollama_health_check
from app.services.prompt_compiler import compile_quiz_prompt, parse_json_response

router = APIRouter()


@router.post("/generate", response_model=QuizGenerateResponse)
async def generate_quiz_question(request: QuizGenerateRequest) -> QuizGenerateResponse:
    """
    Generate a single MCQ with LLM-powered distractors.

    The local LLM creates plausible-but-wrong alternatives for the given
    correct answer, grounded in the topic context.
    """
    if not await ollama_health_check():
        return QuizGenerateResponse(
            success=False,
            error="AI engine is offline. Cannot generate quiz questions.",
        )

    try:
        system_prompt, user_prompt = compile_quiz_prompt(
            correct_answer=request.correct_answer,
            topic_context=request.topic_context,
            category=request.category,
        )

        raw_response = await ollama_generate(
            prompt=user_prompt,
            system=system_prompt,
            temperature=0.8,  # Slightly higher for creative distractors
            max_tokens=400,
        )

        parsed = parse_json_response(raw_response)
        if not parsed:
            return QuizGenerateResponse(
                success=False,
                error="Failed to parse AI response into valid quiz JSON.",
            )

        # Build the options array: correct answer + 3 distractors, shuffled
        correct = parsed.get("correct", request.correct_answer)
        distractors = parsed.get("distractors", [])[:3]

        all_answers = [correct] + distractors
        random.shuffle(all_answers)

        # Assign A/B/C/D keys
        options = [
            QuizOption(key=chr(65 + i), text=ans)
            for i, ans in enumerate(all_answers)
        ]

        # Find the key of the correct answer
        correct_key = next(
            (opt.key for opt in options if opt.text == correct),
            "A",
        )

        question = QuizQuestion(
            subject=request.category,
            question=parsed.get("question", f"What is the correct answer about {request.category}?"),
            options=options,
            correct=correct_key,
        )

        return QuizGenerateResponse(success=True, question=question)

    except Exception as e:
        return QuizGenerateResponse(
            success=False,
            error=f"Quiz generation error: {str(e)}",
        )


@router.post("/boss-battle", response_model=dict)
async def generate_boss_battle(request: BossBattleRequest) -> dict:
    """
    Generate a Boss Battle quiz from the user's weakest subjects.

    Algorithm:
    1. Take the weak_subjects list (sorted by misses descending).
    2. For each weak subject, generate 1-2 MCQs using sample facts.
    3. Return a complete quiz array.
    """
    questions = []

    for subject_data in request.weak_subjects:
        subject = subject_data.get("subject", "General")
        facts = subject_data.get("sample_facts", [])

        # Generate one question per weak subject
        for fact in facts[:2]:  # Max 2 questions per subject
            if len(questions) >= request.num_questions:
                break

            try:
                result = await generate_quiz_question(
                    QuizGenerateRequest(
                        correct_answer=fact,
                        topic_context=fact,
                        category=subject,
                    )
                )
                if result.success and result.question:
                    questions.append(result.question.model_dump())
            except Exception:
                continue  # Skip failed questions, continue with the rest

    return {
        "success": len(questions) > 0,
        "questions": questions,
        "total": len(questions),
    }
