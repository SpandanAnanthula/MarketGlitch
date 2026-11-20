import logging
from motor.motor_asyncio import AsyncIOMotorClient, AsyncIOMotorDatabase
from app.config import settings

logger = logging.getLogger("uvicorn")

class Database:
    client: AsyncIOMotorClient | None = None
    db: AsyncIOMotorDatabase | None = None
    is_connected: bool = False

db_instance = Database()

async def connect_to_mongo():
    logger.info(f"Connecting to MongoDB at {settings.MONGO_URL} (db: {settings.DB_NAME})...")
    try:
        db_instance.client = AsyncIOMotorClient(settings.MONGO_URL, serverSelectionTimeoutMS=4000)
        db_instance.db = db_instance.client[settings.DB_NAME]
        # Ping the server to check connectivity
        await db_instance.client.admin.command('ping')
        db_instance.is_connected = True
        logger.info("Successfully connected to MongoDB!")
        await initialize_indexes()
    except Exception as e:
        logger.warning(f"MongoDB connection failed: {e}. Running in memory-safe fallback mode.")
        db_instance.is_connected = False

async def close_mongo_connection():
    if db_instance.client:
        db_instance.client.close()
        logger.info("MongoDB connection closed.")

async def initialize_indexes():
    """Ensure multi-tenant isolation indexes exist on customer collections."""
    if not db_instance.is_connected or db_instance.db is None:
        return
    try:
        # Index on workspace_id for multi-tenant safety
        await db_instance.db.company_profiles.create_index("workspace_id")
        await db_instance.db.competitor_watchlists.create_index([("workspace_id", 1), ("company_entity_id", 1)])
        await db_instance.db.customer_uploads.create_index("workspace_id")
        await db_instance.db.events.create_index([("entity_ids", 1), ("event_date", -1)])
        await db_instance.db.sources.create_index("source_id", unique=True)
        logger.info("Tenant and query indexes initialized.")
    except Exception as e:
        logger.warning(f"Failed to create indexes: {e}")

def get_db() -> AsyncIOMotorDatabase | None:
    return db_instance.db
