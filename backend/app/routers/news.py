"""
GenBrain — News Router

GET /api/news/daily

Serves today's pre-generated flashcards (from the cron job cache)
or fetches fresh articles on demand.
"""

import json
import os
from datetime import date
from pathlib import Path

from fastapi import APIRouter, Query

from app.models.flashcard import DailyFlashcard
from app.services.news_fetcher import fetch_top_headlines

router = APIRouter()

# Cache directory for pre-generated daily content
CACHE_DIR = Path(__file__).parent.parent.parent / "cache"


@router.get("/daily", response_model=dict)
async def get_daily_news(
    niches: str = Query(
        default="science,tech,space",
        description="Comma-separated list of niche keys",
    ),
) -> dict:
    """
    Get today's daily news flashcards.

    First checks the local cache (populated by the daily cron job).
    Falls back to live fetching if cache is empty.
    """
    today = date.today().isoformat()
    cache_file = CACHE_DIR / f"{today}.json"

    # Try cached content first
    if cache_file.exists():
        try:
            with open(cache_file, "r") as f:
                cached = json.load(f)
                niche_list = [n.strip() for n in niches.split(",")]
                filtered = [
                    card for card in cached
                    if card.get("category", "").lower() in niche_list
                ]
                if filtered:
                    return {"date": today, "cards": filtered, "source": "cache"}
        except (json.JSONDecodeError, Exception):
            pass

    # Fallback: fetch live articles (raw — not yet processed through LLM)
    niche_list = [n.strip() for n in niches.split(",")]
    articles = []
    for niche in niche_list[:4]:  # Limit to 4 niches per request
        niche_articles = await fetch_top_headlines(niche, page_size=3)
        for article in niche_articles:
            articles.append({
                "title": article.get("title", ""),
                "description": article.get("description", ""),
                "content": article.get("content", ""),
                "category": niche,
                "source_url": article.get("url", ""),
                "source_name": article.get("source", ""),
            })

    return {"date": today, "articles": articles, "source": "live"}
