from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
from app.config import settings
from app.database import connect_to_mongo, close_mongo_connection
from app.seeds.seeder import seed_database

from app.routers import onboarding, competitors, industry, sources, pipeline, delivery, feedback

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup: connect to Mongo and seed data
    await connect_to_mongo()
    await seed_database()
    yield
    # Shutdown
    await close_mongo_connection()

app = FastAPI(
    title=settings.APP_NAME,
    description="India-First AI Market Intelligence SaaS API for Hackathon MVP",
    version="1.0.0",
    lifespan=lifespan
)

# CORS Middleware (Crucial for Emergent frontend-backend communication)
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include Routers
app.include_router(onboarding.router)
app.include_router(competitors.router)
app.include_router(industry.router)
app.include_router(sources.router)
app.include_router(pipeline.router)
app.include_router(delivery.router)
app.include_router(delivery.router, prefix="/api/delivery")
app.include_router(feedback.router)

@app.get("/")
async def root():
    return {
        "status": "online",
        "service": settings.APP_NAME,
        "environment": settings.ENVIRONMENT,
        "docs_url": "/docs",
        "target_vertical": "Electronics & Semiconductor Manufacturing"
    }

@app.get("/health")
@app.get("/api/health")
async def health_check():
    from app.database import db_instance
    return {
        "status": "healthy",
        "mongo_connected": db_instance.is_connected,
        "demo_ready": True
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host="0.0.0.0", port=settings.PORT, reload=True)
