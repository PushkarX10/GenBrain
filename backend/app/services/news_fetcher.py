"""
GenBrain — NewsAPI Integration Service

Fetches top headlines and search results from NewsAPI.org,
mapped to GenBrain's niche categories.
"""

from typing import Optional

import httpx

from app.config import settings


# Mapping from GenBrain niches to NewsAPI categories or search queries.
# NewsAPI supports: business, entertainment, general, health, science, sports, technology
NICHE_TO_NEWSAPI = {
    "science": {"category": "science"},
    "tech": {"category": "technology"},
    "health": {"category": "health"},
    "economy": {"category": "business"},
    # These niches don't have direct NewsAPI categories — use keyword search
    "space": {"query": "space exploration OR NASA OR astronomy"},
    "history": {"query": "historical discovery OR archaeology OR ancient"},
    "geography": {"query": "geography OR geological discovery OR natural wonder"},
    "culture": {"query": "cultural heritage OR art discovery OR world culture"},
}


async def fetch_top_headlines(
    niche: str,
    country: str = "us",
    page_size: int = 5,
) -> list[dict]:
    """
    Fetch top headlines for a given niche from NewsAPI.

    Args:
        niche: GenBrain niche key (e.g., "science", "tech").
        country: ISO 3166-1 country code.
        page_size: Number of articles to return.

    Returns:
        List of article dicts with keys: title, description, content, url, source.
    """
    if not settings.news_api_key:
        return _get_fallback_articles(niche)

    mapping = NICHE_TO_NEWSAPI.get(niche, {"query": niche})

    params = {
        "apiKey": settings.news_api_key,
        "pageSize": page_size,
        "language": "en",
    }

    # Use /top-headlines for category-based, /everything for query-based
    if "category" in mapping:
        url = f"{settings.news_api_base_url}/top-headlines"
        params["category"] = mapping["category"]
        params["country"] = country
    else:
        url = f"{settings.news_api_base_url}/everything"
        params["q"] = mapping["query"]
        params["sortBy"] = "publishedAt"

    try:
        async with httpx.AsyncClient(timeout=15.0) as client:
            resp = await client.get(url, params=params)
            resp.raise_for_status()
            data = resp.json()

            articles = []
            for article in data.get("articles", []):
                articles.append({
                    "title": article.get("title", ""),
                    "description": article.get("description", ""),
                    "content": article.get("content", ""),
                    "url": article.get("url", ""),
                    "source": article.get("source", {}).get("name", "Unknown"),
                    "published_at": article.get("publishedAt", ""),
                })
            return articles

    except (httpx.HTTPError, Exception):
        return _get_fallback_articles(niche)


def _get_fallback_articles(niche: str) -> list[dict]:
    """
    Return pre-curated fallback articles when NewsAPI is unavailable.
    Ensures the app always has content to generate flashcards from.
    """
    fallbacks = {
        "science": [
            {
                "title": "Octopuses have three hearts — and two stop when they swim",
                "description": "The pair pumping blood to the gills pause during swimming.",
                "content": "Two branchial hearts push blood through the gills, while a systemic heart circulates it to the body. Swimming strains this system, so octopuses tire quickly and favor crawling.",
                "url": "",
                "source": "GenBrain Curated",
                "published_at": "",
            }
        ],
        "space": [
            {
                "title": "A day on Venus is longer than its year",
                "description": "Venus rotates once every 243 Earth days but orbits the Sun in just 225.",
                "content": "Venus spins retrograde and extremely slowly. Its sidereal day (243 Earth days) exceeds its orbital period (225 days), so a Venusian solar day works out to about 117 Earth days.",
                "url": "",
                "source": "GenBrain Curated",
                "published_at": "",
            }
        ],
        "history": [
            {
                "title": "Oxford University is older than the Aztec Empire",
                "description": "Teaching began at Oxford around 1096; Tenochtitlán was founded in 1325.",
                "content": "Oxford has evidence of teaching from 1096, expanding rapidly after 1167. The Aztec capital Tenochtitlán was not founded until 1325 — meaning Oxford predates it by over two centuries.",
                "url": "",
                "source": "GenBrain Curated",
                "published_at": "",
            }
        ],
    }
    return fallbacks.get(niche, fallbacks.get("science", []))
