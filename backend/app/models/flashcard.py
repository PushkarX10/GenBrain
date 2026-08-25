"""
GenBrain — Flashcard Pydantic Models

Request/response schemas for the flashcard generation pipeline.
"""

from pydantic import BaseModel, Field
from typing import Optional


class FlashcardContent(BaseModel):
    """A single flashcard's content fields."""
    front: str = Field(..., description="Curiosity-sparking fact (1-2 sentences)")
    back: str = Field(..., description="Concise explanation (1-2 sentences)")
    deep_dive: str = Field(..., description="Detailed educational context (3-4 sentences)")


class FlashcardGenerateRequest(BaseModel):
    """Request to generate a flashcard from article text."""
    article_text: str = Field(..., description="Raw article content", max_length=5000)
    category: str = Field(..., description="Topic category (e.g., 'Science', 'Tech')")


class FlashcardGenerateResponse(BaseModel):
    """Response containing the generated flashcard."""
    success: bool
    flashcard: Optional[FlashcardContent] = None
    error: Optional[str] = None
    category: str


class DailyFlashcard(BaseModel):
    """A flashcard bundled with its source metadata."""
    front: str
    back: str
    deep_dive: str
    category: str
    tag: str  # Display label for the category
    source_url: str = ""
    source_name: str = ""
    published_date: str = ""
