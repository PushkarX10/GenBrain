"""
GenBrain — Prompt Compiler

The core AI logic module that constructs precisely-crafted prompts for the
local Ollama model. Three prompt types:

1. TUTOR   — Contextual AI chatbot (Kihoro) for follow-up questions on flashcards.
2. FLASHCARD — Summarizes news articles into Front/Back/DeepDive JSON objects.
3. QUIZ    — Generates plausible incorrect MCQ options (distractors).

Each prompt enforces strict behavioral constraints to keep the LLM on-task.
"""

import json
from typing import Optional


# =============================================================================
# System Prompts — The behavioral DNA of each AI mode
# =============================================================================

TUTOR_SYSTEM_PROMPT = """You are Kihoro, an on-device educational AI tutor inside the GenBrain app.
You are warm, curious, and encouraging — like a brilliant study partner.

STRICT RULES:
1. You ONLY discuss the educational topic presented in the flashcard context below.
2. You NEVER discuss unrelated topics, politics, personal opinions, or anything outside the scope of the flashcard.
3. If the user asks something off-topic, gently redirect: "That's interesting, but let's stay focused on [topic]. What else would you like to know about it?"
4. Keep responses concise — maximum 150 words.
5. Use the Socratic method: ask follow-up questions to deepen understanding.
6. Reference specific facts from the flashcard context when relevant.
7. If you don't know something, say so honestly rather than making up facts.
8. Format key terms in **bold** for emphasis."""

FLASHCARD_SYSTEM_PROMPT = """You are a knowledge distillation engine for the GenBrain educational app.
Your task is to convert news articles into concise, memorable flashcard content.

OUTPUT FORMAT — You MUST return valid JSON with exactly these fields:
{
  "front": "A surprising, curiosity-sparking fact statement (1-2 sentences, max 30 words)",
  "back": "The concise explanation or 'why' behind the fact (1-2 sentences, max 40 words)",
  "deep_dive": "A detailed 3-4 sentence explanation with context, numbers, and real-world implications (max 80 words)"
}

RULES:
1. The "front" should make someone go "Wait, really?" — lead with the most surprising angle.
2. The "back" answers the natural follow-up question.
3. The "deep_dive" provides the full educational context.
4. Use precise numbers and proper nouns when available.
5. Write at a smart-but-accessible level (think: curious adult, not academic paper).
6. Return ONLY the JSON object, no markdown, no commentary."""

QUIZ_DISTRACTOR_SYSTEM_PROMPT = """You are a quiz question generator for the GenBrain educational app.
Given a correct answer and its topic context, generate plausible but incorrect alternatives.

OUTPUT FORMAT — You MUST return valid JSON:
{
  "question": "A clear, unambiguous multiple-choice question (max 25 words)",
  "correct": "The correct answer",
  "distractors": ["Wrong answer 1", "Wrong answer 2", "Wrong answer 3"]
}

RULES for distractors:
1. Each distractor must be plausible — a reasonable guess for someone who doesn't know the answer.
2. Distractors must be clearly wrong (no trick questions or debatable answers).
3. All options should be similar in length and grammatical structure.
4. Avoid "all of the above" or "none of the above".
5. Distractors should come from the same domain as the correct answer.
6. Return ONLY the JSON object."""


# =============================================================================
# Prompt Compilation Functions
# =============================================================================

def compile_tutor_prompt(
    card_front: str,
    card_back: str,
    card_deep_dive: str,
    card_category: str,
    user_message: str,
    conversation_history: list[dict],
) -> list[dict]:
    """
    Build the full message array for the Kihoro AI Tutor.

    This is the EXACT function that concatenates:
    1. The system prompt (behavioral constraints)
    2. The flashcard context (injected as a system-level context block)
    3. The conversation history (for follow-up continuity)
    4. The user's current message

    Args:
        card_front: The flashcard's front text (the fact).
        card_back: The flashcard's back text (the explanation).
        card_deep_dive: The extended explanation.
        card_category: The topic category (e.g., "Science", "History").
        user_message: The user's current question.
        conversation_history: Previous messages in this session.

    Returns:
        A list of message dicts ready for Ollama's /api/chat endpoint.
    """
    # Inject the flashcard content directly into the system prompt
    context_block = (
        f"\n\n--- FLASHCARD CONTEXT (Category: {card_category}) ---\n"
        f"FRONT: {card_front}\n"
        f"BACK: {card_back}\n"
        f"DEEP DIVE: {card_deep_dive}\n"
        f"--- END CONTEXT ---\n\n"
        f"The user is asking about this specific flashcard. "
        f"Ground ALL your responses in the context above."
    )

    messages = [
        {"role": "system", "content": TUTOR_SYSTEM_PROMPT + context_block},
    ]

    # Append conversation history (short-term memory for follow-ups)
    for msg in conversation_history:
        messages.append({
            "role": msg.get("role", "user"),
            "content": msg.get("text", msg.get("content", "")),
        })

    # Append the current user message
    messages.append({"role": "user", "content": user_message})

    return messages


def compile_flashcard_prompt(article_text: str, category: str) -> tuple[str, str]:
    """
    Build the prompt for converting a news article into a flashcard.

    Args:
        article_text: The raw article content (title + description + body).
        category: The topic category for context.

    Returns:
        A tuple of (system_prompt, user_prompt) for Ollama's /api/generate.
    """
    user_prompt = (
        f"Category: {category}\n\n"
        f"Article:\n{article_text[:3000]}\n\n"  # Truncate to fit context window
        f"Convert this article into a single flashcard. "
        f"Return ONLY the JSON object."
    )
    return FLASHCARD_SYSTEM_PROMPT, user_prompt


def compile_quiz_prompt(
    correct_answer: str,
    topic_context: str,
    category: str,
) -> tuple[str, str]:
    """
    Build the prompt for generating quiz distractors.

    Args:
        correct_answer: The factually correct answer.
        topic_context: The flashcard or topic text for grounding.
        category: The subject area.

    Returns:
        A tuple of (system_prompt, user_prompt) for Ollama's /api/generate.
    """
    user_prompt = (
        f"Category: {category}\n"
        f"Topic context: {topic_context}\n"
        f"Correct answer: {correct_answer}\n\n"
        f"Generate a multiple-choice question where \"{correct_answer}\" is correct. "
        f"Include 3 plausible but wrong distractors. Return ONLY the JSON object."
    )
    return QUIZ_DISTRACTOR_SYSTEM_PROMPT, user_prompt


def parse_json_response(response_text: str) -> Optional[dict]:
    """
    Safely parse a JSON response from the LLM, handling common formatting issues.

    The LLM sometimes wraps JSON in markdown code blocks or adds commentary.
    This function strips those artifacts before parsing.
    """
    text = response_text.strip()

    # Strip markdown code fences if present
    if text.startswith("```"):
        lines = text.split("\n")
        # Remove first line (```json or ```) and last line (```)
        lines = [l for l in lines if not l.strip().startswith("```")]
        text = "\n".join(lines).strip()

    # Try to find JSON object boundaries
    start = text.find("{")
    end = text.rfind("}") + 1
    if start != -1 and end > start:
        text = text[start:end]

    try:
        return json.loads(text)
    except json.JSONDecodeError:
        return None
