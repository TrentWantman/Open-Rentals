import html
import re
from datetime import datetime, timedelta
from typing import Any

from jose import jwt
from passlib.context import CryptContext

from app.core.config import settings

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


# Input sanitization patterns
SQL_INJECTION_PATTERN = re.compile(
    r"(\b(SELECT|INSERT|UPDATE|DELETE|DROP|CREATE|ALTER|TRUNCATE|EXEC|UNION|"
    r"DECLARE|CAST|CONVERT|WAITFOR|XP_|SP_)\b)|"
    r"(--)|"
    r"(/\*.*\*/)|"
    r"(;[\s]*$)",
    re.IGNORECASE
)

XSS_PATTERN = re.compile(
    r"<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>|"
    r"javascript:|"
    r"on\w+\s*=|"
    r"<\s*iframe|"
    r"<\s*object|"
    r"<\s*embed",
    re.IGNORECASE
)


def sanitize_string(value: str) -> str:
    """
    Sanitize a string input to prevent XSS and basic injection attacks.

    Args:
        value: The input string to sanitize

    Returns:
        Sanitized string with HTML entities escaped
    """
    if not value:
        return value

    # HTML escape to prevent XSS
    sanitized = html.escape(value, quote=True)

    # Remove null bytes
    sanitized = sanitized.replace("\x00", "")

    return sanitized


def is_safe_string(value: str) -> bool:
    """
    Check if a string is safe from obvious injection patterns.

    Args:
        value: The input string to check

    Returns:
        True if the string appears safe, False otherwise
    """
    if not value:
        return True

    # Check for SQL injection patterns
    if SQL_INJECTION_PATTERN.search(value):
        return False

    # Check for XSS patterns
    if XSS_PATTERN.search(value):
        return False

    return True


def sanitize_search_query(query: str, max_length: int = 200) -> str:
    """
    Sanitize a search query string for safe database use.

    Args:
        query: The search query to sanitize
        max_length: Maximum allowed length

    Returns:
        Sanitized search query
    """
    if not query:
        return ""

    # Truncate to max length
    query = query[:max_length]

    # Remove special SQL characters that could be used in LIKE patterns
    # Keep alphanumeric, spaces, and common punctuation
    query = re.sub(r"[%_\[\]{}\\^$|()!*+?]", "", query)

    # Escape HTML
    query = html.escape(query, quote=True)

    return query.strip()


def validate_uuid_string(value: str) -> bool:
    """
    Validate that a string is a valid UUID format.

    Args:
        value: The string to validate

    Returns:
        True if valid UUID format, False otherwise
    """
    uuid_pattern = re.compile(
        r"^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$",
        re.IGNORECASE
    )
    return bool(uuid_pattern.match(value))


def create_access_token(subject: str | Any, expires_delta: timedelta | None = None) -> str:
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)

    to_encode = {"exp": expire, "sub": str(subject)}
    encoded_jwt = jwt.encode(to_encode, settings.SECRET_KEY, algorithm=settings.ALGORITHM)
    return encoded_jwt


def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)


def get_password_hash(password: str) -> str:
    return pwd_context.hash(password)
