"""
GenBrain — AI Tutor (Kihoro) Chat Router

POST /api/chat/tutor

Handles contextual tutoring requests. The endpoint:
1. Receives the current flashcard context, user message, and conversation history.
2. Compiles the prompt using prompt_compiler.compile_tutor_prompt().
3. Sends the compiled messages to the local Ollama instance.
4. Returns the AI response with updated conversation history.
"""

from fastapi import APIRouter, HTTPException

from app.models.chat import ChatMessage, ChatRequest, ChatResponse
from app.services.ollama_client import ollama_chat, ollama_health_check
from app.services.prompt_compiler import compile_tutor_prompt

router = APIRouter()


@router.post("/tutor", response_model=ChatResponse)
async def chat_tutor(request: ChatRequest) -> ChatResponse:
    """
    Contextual AI Tutor endpoint.

    The user taps "Ask Kihoro" on the back of a flashcard, opening a chat modal.
    This endpoint processes their question with full flashcard context injection.

    The conversation_history field enables follow-up questions within a session
    by maintaining short-term memory of the exchange.
    """
    # Check Ollama availability
    if not await ollama_health_check():
        return ChatResponse(
            success=False,
            error="AI engine is offline. Please ensure Ollama is running on your local network.",
            conversation_history=[
                msg.model_dump() for msg in request.conversation_history
            ],
        )

    try:
        # Compile the full message array with context injection
        messages = compile_tutor_prompt(
            card_front=request.card_context.front,
            card_back=request.card_context.back,
            card_deep_dive=request.card_context.deep_dive,
            card_category=request.card_context.category,
            user_message=request.user_message,
            conversation_history=[
                msg.model_dump() for msg in request.conversation_history
            ],
        )

        # Send to Ollama and get the response
        ai_response = await ollama_chat(
            messages=messages,
            temperature=0.7,
            max_tokens=300,  # Keep responses concise per system prompt
        )

        # Build updated conversation history
        updated_history = list(request.conversation_history) + [
            ChatMessage(role="user", text=request.user_message),
            ChatMessage(role="ai", text=ai_response),
        ]

        # Trim history to last 10 exchanges to keep context window manageable
        if len(updated_history) > 20:
            updated_history = updated_history[-20:]

        return ChatResponse(
            success=True,
            response=ai_response,
            conversation_history=updated_history,
        )

    except Exception as e:
        return ChatResponse(
            success=False,
            error=f"AI processing error: {str(e)}",
            conversation_history=list(request.conversation_history),
        )
