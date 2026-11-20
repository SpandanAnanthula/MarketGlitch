import httpx
import xml.etree.ElementTree as ET
from datetime import datetime
import email.utils
import logging

logger = logging.getLogger("uvicorn")

HEADERS = {
    "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36"
}

def parse_pub_date(date_str: str) -> str:
    """Converts RFC 2822 / RSS pubDate to YYYY-MM-DD format."""
    try:
        parsed_tuple = email.utils.parsedate_tz(date_str)
        if parsed_tuple:
            timestamp = email.utils.mktime_tz(parsed_tuple)
            return datetime.fromtimestamp(timestamp).strftime("%Y-%m-%d")
    except Exception:
        pass
    return datetime.utcnow().strftime("%Y-%m-%d")

def classify_event_type(title: str) -> str:
    """Classifies news headline into canonical event types."""
    lower = title.lower()
    if any(k in lower for k in ["capex", "invest", "plant", "facility", "crore", "groundbreak", "breaks ground", "inaugurate"]):
        return "capex"
    elif any(k in lower for k in ["expand", "expansion", "capacity", "new line", "launch"]):
        return "expansion"
    elif any(k in lower for k in ["hire", "hiring", "talent", "headcount", "jobs", "recruitment"]):
        return "hiring"
    elif any(k in lower for k in ["partner", "jv", "joint venture", "collaborat", "mou", "agreement", "alliance"]):
        return "partnership"
    elif any(k in lower for k in ["quarter", "q1", "q2", "q3", "q4", "earnings", "profit", "revenue", "results"]):
        return "financial"
    elif any(k in lower for k in ["approval", "pli", "scheme", "subsidy", "ministry", "policy", "regulat"]):
        return "regulatory"
    return "general_move"

async def fetch_company_news(company_query: str, max_items: int = 5) -> list[dict]:
    """Fetches real-time RSS news for a specific Indian enterprise."""
    query = f"{company_query} (semiconductor OR electronics OR manufacturing OR capex OR plant)"
    url = f"https://news.google.com/rss/search?q={httpx.URL(query).raw_path.decode()}&hl=en-IN&gl=IN&ceid=IN:en"
    
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
                    
                    # Clean publisher suffix from title e.g. "Headline - Economic Times"
                    source_name = "Business Press"
                    clean_title = raw_title
                    if " - " in raw_title:
                        parts = raw_title.rsplit(" - ", 1)
                        clean_title = parts[0]
                        source_name = parts[1]

                    results.append({
                        "raw_title": clean_title,
                        "source_name": source_name,
                        "source_url": link,
                        "published_date": parse_pub_date(pub_date),
                        "event_type": classify_event_type(clean_title),
                        "source_type": "open_news_rss"
                    })
    except Exception as e:
        logger.warning(f"Error fetching Google News for {company_query}: {e}")
        
    return results
