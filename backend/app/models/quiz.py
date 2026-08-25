"""
GenBrain — Quiz Pydantic Models

Request/response schemas for quiz question and distractor generation.
"""

from pydantic import BaseModel, Field
from typing import Optional


class QuizOption(BaseModel):
    """A single quiz answer option."""
    key: str = Field(..., description="Option letter (A, B, C, D)")
    text: str = Field(..., description="Answer text")


class QuizQuestion(BaseModel):
    """A complete multiple-choice quiz question."""
    subject: str
    question: str
    options: list[QuizOption]
    correct: str = Field(..., description="The key of the correct option")


class QuizGenerateRequest(BaseModel):
    """Request to generate a quiz question with LLM-generated distractors."""
    correct_answer: str = Field(..., description="The factually correct answer")
    topic_context: str = Field(..., description="Flashcard or topic text for grounding")
    category: str = Field(..., description="Subject area (e.g., 'Science')")


class QuizGenerateResponse(BaseModel):
    """Response containing the generated quiz question."""
    success: bool
    question: Optional[QuizQuestion] = None
    error: Optional[str] = None


class BossBattleRequest(BaseModel):
    """Request to generate a Boss Battle quiz from weak subjects."""
    weak_subjects: list[dict] = Field(
        ...,
        description="List of {subject, misses, sample_facts[]} for the weakest topics",
    )
    num_questions: int = Field(default=5, ge=3, le=10)
