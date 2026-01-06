"""
FastAPI application entry point.
"""
import logging
from contextlib import asynccontextmanager
from typing import AsyncGenerator

from fastapi import FastAPI, Request, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from starlette.middleware.base import BaseHTTPMiddleware

from app.config.database import close_mongodb_connection, connect_to_mongodb
from app.controllers.product_controller import router as product_router
from app.middleware.error_handler import register_error_handlers


class SecurityHeadersMiddleware(BaseHTTPMiddleware):
    """Middleware to add security headers to all responses."""

    async def dispatch(self, request: Request, call_next):
        response = await call_next(request)
        response.headers["X-Content-Type-Options"] = "nosniff"
        response.headers["X-Frame-Options"] = "DENY"
        response.headers["Referrer-Policy"] = "strict-origin-when-cross-origin"
        response.headers["Permissions-Policy"] = "geolocation=(), microphone=(), camera=()"
        response.headers["X-XSS-Protection"] = "1; mode=block"
        return response

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s",
)
logger = logging.getLogger(__name__)


@asynccontextmanager
async def lifespan(app: FastAPI) -> AsyncGenerator[None, None]:
    """
    Application lifespan manager for startup and shutdown events.

    Args:
        app: FastAPI application instance.
    """
    # Startup
    logger.info("Starting up FastAPI application...")
    await connect_to_mongodb()
    logger.info("Application startup complete")

    yield

    # Shutdown
    logger.info("Shutting down FastAPI application...")
    await close_mongodb_connection()
    logger.info("Application shutdown complete")


# Create FastAPI application
app = FastAPI(
    title="FastAPI MongoDB Backend",
    description="A FastAPI backend with MongoDB Atlas integration",
    version="1.0.0",
    lifespan=lifespan,
)

# Add SecurityHeaders middleware first (processed last on response)
app.add_middleware(SecurityHeadersMiddleware)

# Add CORS middleware (processed after SecurityHeaders on response)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:4200"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
    expose_headers=["*"],
)

# Register error handlers
register_error_handlers(app)

# Include routers
app.include_router(product_router)


@app.get(
    "/health",
    status_code=status.HTTP_200_OK,
    summary="Health check",
    description="Check if the application is running.",
    tags=["health"],
)
async def health_check() -> JSONResponse:
    """
    Health check endpoint.

    Returns:
        JSONResponse: Health status.
    """
    return JSONResponse(
        status_code=status.HTTP_200_OK,
        content={"status": "healthy", "message": "Application is running"},
    )
