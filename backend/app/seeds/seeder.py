import json
import logging
from pathlib import Path
from app.database import get_db, db_instance

logger = logging.getLogger("uvicorn")

def load_seed_json() -> dict:
    seed_path = Path(__file__).parent / "electronics_semiconductors.json"
    with open(seed_path, "r", encoding="utf-8") as f:
        return json.load(f)

# In-memory cached dataset for instant local fallback
SEED_DATA = load_seed_json()

async def seed_database():
    """Populates MongoDB with the canonical seed data if collections are empty."""
    db = get_db()
    if not db_instance.is_connected or db is None:
        logger.info("MongoDB not connected; using in-memory canonical seed store.")
        return

    try:
        # Check if sources are seeded
        sources_count = await db.sources.count_documents({})
        if sources_count == 0 and "sources" in SEED_DATA:
            await db.sources.insert_many(SEED_DATA["sources"])
            logger.info(f"Seeded {len(SEED_DATA['sources'])} public sources into MongoDB.")

        # Check if competitor candidates are seeded
        comp_count = await db.entities.count_documents({})
        if comp_count == 0 and "competitor_candidates" in SEED_DATA:
            await db.entities.insert_many(SEED_DATA["competitor_candidates"])
            logger.info(f"Seeded {len(SEED_DATA['competitor_candidates'])} competitor entities into MongoDB.")

        # Check events
        events_count = await db.events.count_documents({})
        if events_count == 0 and "competitor_events" in SEED_DATA:
            await db.events.insert_many(SEED_DATA["competitor_events"])
            logger.info(f"Seeded {len(SEED_DATA['competitor_events'])} competitor events into MongoDB.")

        logger.info("Database seeding check complete.")
    except Exception as e:
        logger.warning(f"Error during database seeding: {e}")
