"""
GenBrain — Chat Pydantic Models

Request/response schemas for the Kihoro AI Tutor chatbot.
"""

from pydantic import BaseModel, Field
from typing import Optional


class ChatMessage(BaseModel):
    """A single message in a conversation."""
    role: str = Field(..., description="'user' or 'ai'")
    text: str = Field(..., description="Message content")


class CardContext(BaseModel):
    """The flashcard context to inject into the tutor prompt."""
    front: str = Field(..., description="Flashcard front text")
    back: str = Field(..., description="Flashcard back text")
    deep_dive: str = Field(..., description="Extended explanation")
    category: str = Field(..., description="Topic category")


class ChatRequest(BaseModel):
    """Request to the AI Tutor endpoint."""
    card_context: CardContext
    user_message: str = Field(..., description="The user's current question", max_length=1000)
    conversation_history: list[ChatMessage] = Field(
        default_factory=list,
        description="Previous messages in this session (for follow-up continuity)",
    )


class ChatResponse(BaseModel):
    """Response from the AI Tutor."""
    success: bool
    response: str = ""
    conversation_history: list[ChatMessage] = Field(default_factory=list)
    error: Optional[str] = None
