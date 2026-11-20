import httpx
import xml.etree.ElementTree as ET
import logging
from app.services.scrapers.google_news_scraper import parse_pub_date

logger = logging.getLogger("uvicorn")

HEADERS = {
    "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36"
}

async def fetch_pib_policy_alerts(query: str = "semiconductor OR electronics OR PLI", max_items: int = 4) -> list[dict]:
    """Fetches official Press Information Bureau (pib.gov.in) press releases."""
    url = f"https://news.google.com/rss/search?q=site:pib.gov.in+{query}&hl=en-IN&gl=IN&ceid=IN:en"
    results = []
    try:
        async with httpx.AsyncClient(timeout=10.0, follow_redirects=True) as client:
            resp = await client.get(url, headers=HEADERS)
            if resp.status_code == 200:
                root = ET.fromstring(resp.text)
                items = root.findall(".//item")
                for item in items[:max_items]:
                    raw_title = item.find("title").text if item.find("title") is not None else ""
                    link = item.find("link").text if item.find("link") is not None else ""
                    pub_date = item.find("pubDate").text if item.find("pubDate") is not None else ""
                    
                    clean_title = raw_title.replace(" - pib.gov.in", "").strip()
                    
                    results.append({
                        "title": clean_title,
                        "authority": "Press Information Bureau / Government of India",
                        "published_date": parse_pub_date(pub_date),
                        "source_url": link,
                        "source_name": "PIB Official Gazette",
                        "impact_level": "High"
                    })
    except Exception as e:
        logger.warning(f"Error fetching PIB releases: {e}")
    return results
