"""
Open Rentals - FastAPI Application
Main application entry point with CORS, routers, and lifecycle management.
"""

import logging
import time
import uuid
from collections import defaultdict
from contextlib import asynccontextmanager
from typing import AsyncGenerator

from fastapi import FastAPI, Request, status
from fastapi.exceptions import RequestValidationError
from fastapi.middleware.cors import CORSMiddleware
from fastapi.middleware.gzip import GZipMiddleware
from fastapi.responses import JSONResponse
from pydantic import ValidationError as PydanticValidationError
from sqlalchemy import text
from starlette.exceptions import HTTPException as StarletteHTTPException
from starlette.middleware.base import BaseHTTPMiddleware

from app.core.config import settings
from app.db.base import engine

# Import routers
from app.api.routes import auth, users, properties, applications

# Configure logging
logging.basicConfig(
    level=logging.DEBUG if settings.DEBUG else logging.INFO,
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s",
)
logger = logging.getLogger(__name__)


# Rate limiting storage (use Redis in production for distributed systems)
rate_limit_storage: dict[str, list[float]] = defaultdict(list)


class RateLimitMiddleware(BaseHTTPMiddleware):
    """
    Rate limiting middleware to prevent API abuse.

    Limits requests per IP address within a sliding window.
    """

    def __init__(self, app, requests_per_minute: int = 60):
        super().__init__(app)
        self.requests_per_minute = requests_per_minute
        self.window_seconds = 60

    async def dispatch(self, request: Request, call_next):
        # Skip rate limiting for health checks
        if request.url.path in ["/health", "/"]:
            return await call_next(request)

        # Get client IP (handle proxies)
        client_ip = request.headers.get("X-Forwarded-For", request.client.host if request.client else "unknown")
        if "," in client_ip:
            client_ip = client_ip.split(",")[0].strip()

        current_time = time.time()
        window_start = current_time - self.window_seconds

        # Clean old requests and count recent ones
        rate_limit_storage[client_ip] = [
            t for t in rate_limit_storage[client_ip] if t > window_start
        ]

        if len(rate_limit_storage[client_ip]) >= self.requests_per_minute:
            return JSONResponse(
                status_code=status.HTTP_429_TOO_MANY_REQUESTS,
                content={
                    "detail": "Rate limit exceeded. Please try again later.",
                    "type": "rate_limit_error",
                    "retry_after": self.window_seconds,
                },
                headers={"Retry-After": str(self.window_seconds)},
            )

        rate_limit_storage[client_ip].append(current_time)
        return await call_next(request)


class SecurityHeadersMiddleware(BaseHTTPMiddleware):
    """
    Middleware to add security headers to all responses.
    """

    async def dispatch(self, request: Request, call_next):
        response = await call_next(request)

        # Security headers
        response.headers["X-Content-Type-Options"] = "nosniff"
        response.headers["X-Frame-Options"] = "DENY"
        response.headers["X-XSS-Protection"] = "1; mode=block"
        response.headers["Referrer-Policy"] = "strict-origin-when-cross-origin"
        response.headers["Permissions-Policy"] = "geolocation=(), microphone=(), camera=()"

        # Content Security Policy (adjust as needed for your frontend)
        if not settings.DEBUG:
            response.headers["Content-Security-Policy"] = (
                "default-src 'self'; "
                "script-src 'self'; "
                "style-src 'self' 'unsafe-inline'; "
                "img-src 'self' data: https:; "
                "font-src 'self'; "
                "connect-src 'self'"
            )

        # HSTS for HTTPS (only in production)
        if not settings.DEBUG:
            response.headers["Strict-Transport-Security"] = (
                "max-age=31536000; includeSubDomains"
            )

        return response


class RequestIDMiddleware(BaseHTTPMiddleware):
    """
    Middleware to add a unique request ID for tracing and debugging.
    """

    async def dispatch(self, request: Request, call_next):
        request_id = request.headers.get("X-Request-ID") or str(uuid.uuid4())

        # Store request ID in request state for use in handlers
        request.state.request_id = request_id

        response = await call_next(request)
        response.headers["X-Request-ID"] = request_id

        return response


class RequestLoggingMiddleware(BaseHTTPMiddleware):
    """
    Middleware to log request details for monitoring.
    """

    async def dispatch(self, request: Request, call_next):
        start_time = time.time()

        response = await call_next(request)

        process_time = time.time() - start_time

        # Log request details
        logger.info(
            f"{request.method} {request.url.path} "
            f"- Status: {response.status_code} "
            f"- Duration: {process_time:.3f}s "
            f"- Request-ID: {getattr(request.state, 'request_id', 'N/A')}"
        )

        # Add timing header
        response.headers["X-Process-Time"] = f"{process_time:.3f}"

        return response


@asynccontextmanager
async def lifespan(app: FastAPI) -> AsyncGenerator[None, None]:
    """
    Application lifespan manager for startup and shutdown events.

    Handles:
    - Database connection pool initialization
    - Cleanup on shutdown
    """
    # Startup
    logger.info("Starting Open Rentals API...")

    # Run database migrations on startup
    try:
        from alembic.config import Config
        from alembic import command
        alembic_cfg = Config("/app/alembic.ini")
        command.upgrade(alembic_cfg, "head")
        logger.info("Database migrations applied")
    except Exception as e:
        logger.error("Failed to run migrations: %s", e)

    logger.info("Open Rentals API started successfully")

    yield

    # Shutdown
    logger.info("Shutting down Open Rentals API...")

    # Dispose database engine
    await engine.dispose()
    logger.info("Database connection pool closed")

    logger.info("Open Rentals API shutdown complete")


# Create FastAPI application
app = FastAPI(
    title=settings.APP_NAME,
    description="API for open rental platform with property listings and applications",
    version=settings.APP_VERSION,
    docs_url="/docs" if settings.DEBUG else None,  # Disable docs in production
    redoc_url="/redoc" if settings.DEBUG else None,
    openapi_url="/openapi.json" if settings.DEBUG else None,
    lifespan=lifespan,
)

# Build allowed origins list (filter out empty strings)
allowed_origins = [
    origin for origin in [
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        settings.FRONTEND_URL,
    ]
    if origin and origin.strip()
]

# Configure CORS with production-ready settings
app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allow_headers=[
        "Authorization",
        "Content-Type",
        "Accept",
        "Origin",
        "X-Request-ID",
        "X-Requested-With",
    ],
    expose_headers=[
        "X-Request-ID",
        "X-Process-Time",
        "X-Total-Count",
    ],
    max_age=600,  # Cache preflight requests for 10 minutes
)

# Add GZip compression for responses larger than 1000 bytes
app.add_middleware(GZipMiddleware, minimum_size=1000)

# Add custom middleware (order matters - last added is executed first)
app.add_middleware(RequestLoggingMiddleware)
app.add_middleware(SecurityHeadersMiddleware)
app.add_middleware(RequestIDMiddleware)
app.add_middleware(RateLimitMiddleware, requests_per_minute=settings.RATE_LIMIT_PER_MINUTE)


# Health check endpoint
@app.get("/health", tags=["Health"])
async def health_check() -> dict:
    """
    Health check endpoint for container orchestration and load balancers.

    Returns:
        dict: Health status with service availability information
    """
    health_status = {
        "status": "healthy",
        "service": "open-rentals-api",
        "version": settings.APP_VERSION,
    }

    # Check database connection
    try:
        async with engine.connect() as conn:
            await conn.execute(text("SELECT 1"))
        health_status["database"] = "connected"
    except Exception:
        health_status["database"] = "error"
        health_status["status"] = "unhealthy"

    return health_status


# Root endpoint
@app.get("/", tags=["Root"])
async def root() -> dict:
    """
    Root endpoint with API information.
    """
    return {
        "message": f"Welcome to {settings.APP_NAME} API",
        "docs": "/docs",
        "health": "/health",
    }


# Include all routers with API prefix /api/v1
app.include_router(auth.router, prefix=f"{settings.API_PREFIX}/auth", tags=["Authentication"])
app.include_router(users.router, prefix=f"{settings.API_PREFIX}/users", tags=["Users"])
app.include_router(properties.router, prefix=f"{settings.API_PREFIX}/properties", tags=["Properties"])
app.include_router(applications.router, prefix=f"{settings.API_PREFIX}/applications", tags=["Applications"])


@app.exception_handler(RequestValidationError)
async def validation_exception_handler(
    request: Request, exc: RequestValidationError
) -> JSONResponse:
    """
    Handle Pydantic validation errors with detailed, user-friendly messages.
    """
    errors = []
    for error in exc.errors():
        field_path = ".".join(str(loc) for loc in error["loc"] if loc != "body")
        errors.append({
            "field": field_path,
            "message": error["msg"],
            "type": error["type"],
        })

    request_id = getattr(request.state, "request_id", None)

    return JSONResponse(
        status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
        content={
            "detail": "Validation error",
            "type": "validation_error",
            "errors": errors,
            "request_id": request_id,
        },
    )


@app.exception_handler(StarletteHTTPException)
async def http_exception_handler(
    request: Request, exc: StarletteHTTPException
) -> JSONResponse:
    """
    Handle HTTP exceptions with consistent response format.
    """
    request_id = getattr(request.state, "request_id", None)

    # Map status codes to error types
    error_types = {
        400: "bad_request",
        401: "unauthorized",
        403: "forbidden",
        404: "not_found",
        405: "method_not_allowed",
        409: "conflict",
        422: "validation_error",
        429: "rate_limit_error",
        500: "internal_error",
        502: "bad_gateway",
        503: "service_unavailable",
    }

    error_type = error_types.get(exc.status_code, "error")

    content = {
        "detail": exc.detail,
        "type": error_type,
        "request_id": request_id,
    }

    # Add headers if present (e.g., WWW-Authenticate)
    headers = getattr(exc, "headers", None)

    return JSONResponse(
        status_code=exc.status_code,
        content=content,
        headers=headers,
    )


# Global exception handler
@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception) -> JSONResponse:
    """
    Global exception handler for unhandled exceptions.
    """
    request_id = getattr(request.state, "request_id", None)
    logger.error(
        f"Unhandled exception [Request-ID: {request_id}]: {exc}",
        exc_info=True
    )

    # Don't expose internal error details in production
    detail = "An internal server error occurred"
    if settings.DEBUG:
        detail = str(exc)

    return JSONResponse(
        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        content={
            "detail": detail,
            "type": "internal_error",
            "request_id": request_id,
        },
    )
