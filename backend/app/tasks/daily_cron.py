"""
GenBrain — Daily Cron Job

Runs daily at 06:00 UTC to:
1. Fetch top headlines per niche from NewsAPI.
2. Send each article to Ollama for flashcard generation.
3. Cache the results as a JSON file for the mobile app to pull.
"""

import asyncio
import json
import logging
from datetime import date
from pathlib import Path

from apscheduler.schedulers.background import BackgroundScheduler

from app.config import settings

logger = logging.getLogger("genbrain.cron")

# Cache directory
CACHE_DIR = Path(__file__).parent.parent.parent / "cache"
CACHE_DIR.mkdir(parents=True, exist_ok=True)

# Default niches to fetch for (overridden per-user in future)
DEFAULT_NICHES = ["science", "tech", "space", "history", "health"]

scheduler = BackgroundScheduler()


def start_scheduler():
    """Start the APScheduler background scheduler."""
    scheduler.add_job(
        _run_daily_fetch,
        "cron",
        hour=6,
        minute=0,
        id="daily_news_fetch",
        replace_existing=True,
    )
    scheduler.start()
    logger.info("Daily cron scheduler started — next run at 06:00 UTC")


def stop_scheduler():
    """Gracefully shutdown the scheduler."""
    if scheduler.running:
        scheduler.shutdown(wait=False)
        logger.info("Scheduler stopped")


def _run_daily_fetch():
    """Synchronous wrapper to run the async fetch pipeline."""
    try:
        asyncio.run(_daily_fetch_pipeline())
    except Exception as e:
        logger.error(f"Daily fetch pipeline failed: {e}")


async def _daily_fetch_pipeline():
    """
    The full daily pipeline:
    1. Fetch articles from NewsAPI for each default niche.
    2. For each article, call Ollama to generate a flashcard.
    3. Save all flashcards to a dated JSON cache file.
    """
    from app.services.news_fetcher import fetch_top_headlines
    from app.services.ollama_client import ollama_generate, ollama_health_check
    from app.services.prompt_compiler import compile_flashcard_prompt, parse_json_response

    today = date.today().isoformat()
    cache_file = CACHE_DIR / f"{today}.json"

    # Skip if already generated today
    if cache_file.exists():
        logger.info(f"Cache for {today} already exists — skipping")
        return

    ollama_ok = await ollama_health_check()
    if not ollama_ok:
        logger.warning("Ollama is offline — using fallback content only")

    all_flashcards = []

    for niche in DEFAULT_NICHES:
        logger.info(f"Fetching articles for niche: {niche}")
        articles = await fetch_top_headlines(niche, page_size=3)

        for article in articles:
            # Combine article fields into a single text block
            article_text = (
                f"Title: {article.get('title', '')}\n"
                f"Description: {article.get('description', '')}\n"
                f"Content: {article.get('content', '')}"
            )

            if ollama_ok:
                try:
                    system_prompt, user_prompt = compile_flashcard_prompt(
                        article_text=article_text,
                        category=niche,
                    )
                    raw = await ollama_generate(
                        prompt=user_prompt,
                        system=system_prompt,
                        temperature=0.6,
                        max_tokens=400,
                    )
                    parsed = parse_json_response(raw)
                    if parsed:
                        all_flashcards.append({
                            "front": parsed.get("front", ""),
                            "back": parsed.get("back", ""),
                            "deep_dive": parsed.get("deep_dive", ""),
                            "category": niche,
                            "tag": niche.capitalize(),
                            "source_url": article.get("url", ""),
                            "source_name": article.get("source", ""),
                            "published_date": today,
                        })
                        logger.info(f"  ✓ Generated flashcard for: {article.get('title', '')[:50]}")
                    else:
                        logger.warning(f"  ✗ Failed to parse flashcard for: {article.get('title', '')[:50]}")
                except Exception as e:
                    logger.error(f"  ✗ Ollama error: {e}")
            else:
                # Fallback: use the article directly as a simple flashcard
                all_flashcards.append({
                    "front": article.get("title", ""),
                    "back": article.get("description", ""),
                    "deep_dive": article.get("content", ""),
                    "category": niche,
                    "tag": niche.capitalize(),
                    "source_url": article.get("url", ""),
                    "source_name": article.get("source", ""),
                    "published_date": today,
                })

    # Write cache
    with open(cache_file, "w") as f:
        json.dump(all_flashcards, f, indent=2)

    logger.info(f"Daily pipeline complete — {len(all_flashcards)} flashcards cached for {today}")
