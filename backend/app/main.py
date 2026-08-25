"""
GenBrain Backend — FastAPI Application Entry Point

Lightweight bridge server for:
  • Proxying requests to a local Ollama instance (AI tutor, flashcard gen, quiz gen)
  • Fetching daily news from NewsAPI
  • Running a daily cron job to pre-generate flashcard content
"""

from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.config import settings
from app.routers import chat, flashcards, news, quiz
from app.services.ollama_client import ollama_health_check
from app.tasks.daily_cron import start_scheduler, stop_scheduler


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Startup/shutdown lifecycle for the FastAPI application."""
    # Startup: launch the daily news cron job
    start_scheduler()
    yield
    # Shutdown: gracefully stop the scheduler
    stop_scheduler()


app = FastAPI(
    title="GenBrain API",
    description="Privacy-first backend bridge for AI-powered knowledge flashcards.",
    version="0.1.0",
    lifespan=lifespan,
)

# ── CORS ──────────────────────────────────────────────────────────────────────
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origin_list,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ── Routers ───────────────────────────────────────────────────────────────────
app.include_router(chat.router, prefix="/api/chat", tags=["AI Tutor"])
app.include_router(flashcards.router, prefix="/api/flashcards", tags=["Flashcards"])
app.include_router(quiz.router, prefix="/api/quiz", tags=["Quiz"])
app.include_router(news.router, prefix="/api/news", tags=["News"])


# ── Health ────────────────────────────────────────────────────────────────────
@app.get("/health", tags=["System"])
async def health():
    """Health check — reports server status and Ollama connectivity."""
    ollama_ok = await ollama_health_check()
    return {
        "status": "ok",
        "ollama": ollama_ok,
        "model": settings.ollama_model,
    }
