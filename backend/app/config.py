import os
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    APP_NAME: str = "MarketPulse India Intelligence API"
    ENVIRONMENT: str = os.getenv("ENVIRONMENT", "development")
    PORT: int = int(os.getenv("PORT", 8000))
    
    # MongoDB configuration (Emergent standard is MONGO_URL or MONGODB_URI)
    MONGO_URL: str = os.getenv("MONGO_URL") or os.getenv("MONGODB_URI") or "mongodb://localhost:27017"
    DB_NAME: str = os.getenv("DB_NAME", "market_intel")
    
    # AI configuration
    OPENAI_API_KEY: str = os.getenv("OPENAI_API_KEY", "")
    
    # CORS
    CORS_ORIGINS: list[str] = ["*"]

settings = Settings()
