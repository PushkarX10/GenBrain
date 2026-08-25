"""
GenBrain — Ollama HTTP Client

Async wrapper around the Ollama REST API (http://localhost:11434).
Handles generation requests, streaming, health checks, and timeouts.
"""

from typing import AsyncGenerator, Optional

import httpx

from app.config import settings


async def ollama_health_check() -> bool:
    """Check if the Ollama server is reachable and responsive."""
    try:
        async with httpx.AsyncClient(timeout=5.0) as client:
            resp = await client.get(f"{settings.ollama_base_url}/api/tags")
            return resp.status_code == 200
    except (httpx.ConnectError, httpx.TimeoutException):
        return False


async def ollama_generate(
    prompt: str,
    system: str = "",
    model: Optional[str] = None,
    temperature: float = 0.7,
    max_tokens: int = 512,
) -> str:
    """
    Send a non-streaming generation request to Ollama.

    Args:
        prompt: The user prompt / input text.
        system: System prompt for role/behavior instruction.
        model: Ollama model name (defaults to config).
        temperature: Sampling temperature (0.0–1.0).
        max_tokens: Maximum tokens in the response.

    Returns:
        The generated text response.
    """
    payload = {
        "model": model or settings.ollama_model,
        "prompt": prompt,
        "system": system,
        "stream": False,
        "options": {
            "temperature": temperature,
            "num_predict": max_tokens,
        },
    }

    async with httpx.AsyncClient(timeout=settings.ollama_timeout) as client:
        resp = await client.post(
            f"{settings.ollama_base_url}/api/generate",
            json=payload,
        )
        resp.raise_for_status()
        return resp.json().get("response", "")


async def ollama_chat(
    messages: list[dict],
    model: Optional[str] = None,
    temperature: float = 0.7,
    max_tokens: int = 512,
) -> str:
    """
    Send a multi-turn chat request to Ollama's /api/chat endpoint.

    Args:
        messages: List of {"role": "system"|"user"|"assistant", "content": "..."}.
        model: Ollama model name (defaults to config).
        temperature: Sampling temperature.
        max_tokens: Maximum tokens in the response.

    Returns:
        The assistant's response text.
    """
    payload = {
        "model": model or settings.ollama_model,
        "messages": messages,
        "stream": False,
        "options": {
            "temperature": temperature,
            "num_predict": max_tokens,
        },
    }

    async with httpx.AsyncClient(timeout=settings.ollama_timeout) as client:
        resp = await client.post(
            f"{settings.ollama_base_url}/api/chat",
            json=payload,
        )
        resp.raise_for_status()
        data = resp.json()
        return data.get("message", {}).get("content", "")


async def ollama_generate_stream(
    prompt: str,
    system: str = "",
    model: Optional[str] = None,
    temperature: float = 0.7,
) -> AsyncGenerator[str, None]:
    """
    Stream a generation response token-by-token from Ollama.

    Yields:
        Individual text chunks as they arrive.
    """
    payload = {
        "model": model or settings.ollama_model,
        "prompt": prompt,
        "system": system,
        "stream": True,
        "options": {
            "temperature": temperature,
        },
    }

    async with httpx.AsyncClient(timeout=settings.ollama_timeout) as client:
        async with client.stream(
            "POST",
            f"{settings.ollama_base_url}/api/generate",
            json=payload,
        ) as resp:
            resp.raise_for_status()
            import json as json_module

            async for line in resp.aiter_lines():
                if line.strip():
                    chunk = json_module.loads(line)
                    token = chunk.get("response", "")
                    if token:
                        yield token
                    if chunk.get("done", False):
                        break
