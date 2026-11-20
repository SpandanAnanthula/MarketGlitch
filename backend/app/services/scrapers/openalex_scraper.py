import httpx
import logging

logger = logging.getLogger("uvicorn")

HEADERS = {
    "User-Agent": "MarketPulseIndia/1.0 (mailto:intelligence@marketpulse.in)"
}

async def fetch_semiconductor_research(query: str = "semiconductor packaging India", per_page: int = 4) -> list[dict]:
    """
    Fetches open research and technical patent publications from OpenAlex.
    Free, open API with zero auth required.
    """
    url = f"https://api.openalex.org/works?search={query}&per_page={per_page}"
    results = []
    try:
        async with httpx.AsyncClient(timeout=10.0) as client:
            resp = await client.get(url, headers=HEADERS)
            if resp.status_code == 200:
                data = resp.json()
                for work in data.get("results", []):
                    title = work.get("title", "")
                    year = work.get("publication_year", 2026)
                    doi = work.get("doi") or work.get("id") or "https://openalex.org"
                    authorships = work.get("authorships", [])
                    institutions = []
                    for a in authorships[:2]:
                        for inst in a.get("institutions", []):
                            institutions.append(inst.get("display_name", ""))

                    inst_str = ", ".join(list(set(institutions))[:2]) if institutions else "Indian Academic & Research Labs"
                    
                    results.append({
                        "work_id": work.get("id", ""),
                        "title": title,
                        "publication_year": year,
                        "institutions": inst_str,
                        "url": doi,
                        "cited_by_count": work.get("cited_by_count", 0),
                        "source_type": "open_research_openalex"
                    })
    except Exception as e:
        logger.warning(f"Error fetching OpenAlex research: {e}")
    return results
