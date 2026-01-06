"""
Global error handling middleware.
"""
import logging
import os
from typing import Any

from fastapi import FastAPI, HTTPException, Request, status
from fastapi.responses import JSONResponse
from pydantic import ValidationError

logger = logging.getLogger(__name__)


def is_production() -> bool:
    """Check if running in production environment."""
    return os.getenv("ENV", "development").lower() == "production"


def create_error_response(
    status_code: int,
    message: str,
    detail: Any = None,
) -> dict[str, Any]:
    """
    Create a standardized error response.

    Args:
        status_code: HTTP status code.
        message: Error message.
        detail: Additional error details (hidden in production).

    Returns:
        dict: Error response dictionary.
    """
    response: dict[str, Any] = {
        "status_code": status_code,
        "message": message,
    }

    if not is_production() and detail is not None:
        response["detail"] = detail

    return response


async def http_exception_handler(
    request: Request,
    exc: HTTPException,
) -> JSONResponse:
    """
    Handle HTTPException and return JSON response.

    Args:
        request: FastAPI request object.
        exc: HTTPException instance.

    Returns:
        JSONResponse: JSON error response.
    """
    return JSONResponse(
        status_code=exc.status_code,
        content=create_error_response(
            status_code=exc.status_code,
            message=str(exc.detail),
        ),
    )


async def validation_exception_handler(
    request: Request,
    exc: ValidationError,
) -> JSONResponse:
    """
    Handle Pydantic ValidationError and return JSON response.

    Args:
        request: FastAPI request object.
        exc: ValidationError instance.

    Returns:
        JSONResponse: JSON error response with 400 status.
    """
    logger.warning(f"Validation error: {exc}")

    return JSONResponse(
        status_code=status.HTTP_400_BAD_REQUEST,
        content=create_error_response(
            status_code=status.HTTP_400_BAD_REQUEST,
            message="Validation error",
            detail=exc.errors() if not is_production() else None,
        ),
    )


async def generic_exception_handler(
    request: Request,
    exc: Exception,
) -> JSONResponse:
    """
    Handle generic unhandled exceptions and return JSON response.

    Args:
        request: FastAPI request object.
        exc: Exception instance.

    Returns:
        JSONResponse: JSON error response with 500 status.
    """
    logger.error(f"Unhandled exception: {exc}", exc_info=True)

    return JSONResponse(
        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        content=create_error_response(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            message="Internal server error",
            detail=str(exc) if not is_production() else None,
        ),
    )


def register_error_handlers(app: FastAPI) -> None:
    """
    Register all error handlers with the FastAPI application.

    Args:
        app: FastAPI application instance.
    """
    app.add_exception_handler(HTTPException, http_exception_handler)
    app.add_exception_handler(ValidationError, validation_exception_handler)
    app.add_exception_handler(Exception, generic_exception_handler)
