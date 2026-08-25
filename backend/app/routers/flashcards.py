"""
GenBrain — Flashcard Generation Router

POST /api/flashcards/generate

Takes raw article text and converts it into structured Front/Back/DeepDive
flashcard JSON via the local Ollama instance.
"""

from fastapi import APIRouter

from app.models.flashcard import (
    FlashcardContent,
    FlashcardGenerateRequest,
    FlashcardGenerateResponse,
)
from app.services.ollama_client import ollama_generate, ollama_health_check
from app.services.prompt_compiler import compile_flashcard_prompt, parse_json_response

router = APIRouter()


@router.post("/generate", response_model=FlashcardGenerateResponse)
async def generate_flashcard(request: FlashcardGenerateRequest) -> FlashcardGenerateResponse:
    """
    Generate a flashcard from article text using the local LLM.

    The prompt compiler constructs a system prompt that instructs the model
    to output a strict JSON object with front, back, and deep_dive fields.
    """
    if not await ollama_health_check():
        return FlashcardGenerateResponse(
            success=False,
            error="AI engine is offline. Cannot generate flashcards.",
            category=request.category,
        )

    try:
        system_prompt, user_prompt = compile_flashcard_prompt(
            article_text=request.article_text,
            category=request.category,
        )

        raw_response = await ollama_generate(
            prompt=user_prompt,
            system=system_prompt,
            temperature=0.6,  # Slightly lower for factual accuracy
            max_tokens=400,
        )

        # Parse the JSON response from the LLM
        parsed = parse_json_response(raw_response)
        if not parsed:
            return FlashcardGenerateResponse(
                success=False,
                error="Failed to parse AI response into valid flashcard JSON.",
                category=request.category,
            )

        flashcard = FlashcardContent(
            front=parsed.get("front", ""),
            back=parsed.get("back", ""),
            deep_dive=parsed.get("deep_dive", ""),
        )

        return FlashcardGenerateResponse(
            success=True,
            flashcard=flashcard,
            category=request.category,
        )

    except Exception as e:
        return FlashcardGenerateResponse(
            success=False,
            error=f"Flashcard generation error: {str(e)}",
            category=request.category,
        )
