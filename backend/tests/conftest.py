"""
Shared test fixtures for the Open Rentals API test suite.

Uses a dedicated test database on the same Postgres instance.
Set TEST_DATABASE_URL env var, or defaults to the app DATABASE_URL.
"""

import asyncio
import os
import uuid
from datetime import datetime
from decimal import Decimal
from typing import AsyncGenerator

import pytest
import pytest_asyncio
from httpx import ASGITransport, AsyncClient
from sqlalchemy import text
from sqlalchemy.ext.asyncio import AsyncSession, create_async_engine, async_sessionmaker

from app.db.base import Base, get_db
from app.core.security import get_password_hash, create_access_token
from app.models.user import User, UserRole
from app.models.property import Property, PropertyType, PropertyStatus

# Use the same Postgres — tests clean up after themselves
TEST_DATABASE_URL = os.environ.get(
    "TEST_DATABASE_URL",
    os.environ.get("DATABASE_URL", "postgresql+asyncpg://miami:devpassword@localhost:5432/miami_rentals"),
)
# Ensure async driver
if "postgresql://" in TEST_DATABASE_URL and "+asyncpg" not in TEST_DATABASE_URL:
    TEST_DATABASE_URL = TEST_DATABASE_URL.replace("postgresql://", "postgresql+asyncpg://")

engine = create_async_engine(TEST_DATABASE_URL, echo=False)
TestSessionLocal = async_sessionmaker(engine, class_=AsyncSession, expire_on_commit=False)


@pytest.fixture(scope="session")
def event_loop():
    loop = asyncio.new_event_loop()
    yield loop
    loop.close()


@pytest_asyncio.fixture(autouse=True)
async def setup_db():
    """Truncate all tables before each test for isolation."""
    async with engine.begin() as conn:
        # Truncate all tables with CASCADE to handle foreign keys
        await conn.execute(text(
            "TRUNCATE TABLE property_images, rental_applications, properties, "
            "landlord_verifications, users RESTART IDENTITY CASCADE"
        ))
    yield


@pytest_asyncio.fixture
async def db_session() -> AsyncGenerator[AsyncSession, None]:
    async with TestSessionLocal() as session:
        yield session


@pytest_asyncio.fixture
async def client(db_session: AsyncSession) -> AsyncGenerator[AsyncClient, None]:
    """HTTP client wired to the FastAPI app with test DB override."""
    from app.main import app

    async def override_get_db():
        yield db_session

    app.dependency_overrides[get_db] = override_get_db

    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as c:
        yield c

    app.dependency_overrides.clear()


# ---------------------------------------------------------------------------
# Factory fixtures
# ---------------------------------------------------------------------------

@pytest_asyncio.fixture
async def renter(db_session: AsyncSession) -> User:
    user = User(
        id=uuid.uuid4(),
        email="renter@test.com",
        hashed_password=get_password_hash("testpass123"),
        first_name="Test",
        last_name="Renter",
        role=UserRole.RENTER,
        is_active=True,
        email_verified=True,
    )
    db_session.add(user)
    await db_session.commit()
    await db_session.refresh(user)
    return user


@pytest_asyncio.fixture
async def landlord(db_session: AsyncSession) -> User:
    user = User(
        id=uuid.uuid4(),
        email="landlord@test.com",
        hashed_password=get_password_hash("testpass123"),
        first_name="Test",
        last_name="Landlord",
        role=UserRole.LANDLORD,
        is_active=True,
        is_verified=True,
        email_verified=True,
        is_landlord_verified=True,
        company_name="Test Properties LLC",
    )
    db_session.add(user)
    await db_session.commit()
    await db_session.refresh(user)
    return user


@pytest_asyncio.fixture
async def admin(db_session: AsyncSession) -> User:
    user = User(
        id=uuid.uuid4(),
        email="admin@test.com",
        hashed_password=get_password_hash("testpass123"),
        first_name="Test",
        last_name="Admin",
        role=UserRole.ADMIN,
        is_active=True,
        is_verified=True,
        email_verified=True,
    )
    db_session.add(user)
    await db_session.commit()
    await db_session.refresh(user)
    return user


@pytest_asyncio.fixture
async def sample_property(db_session: AsyncSession, landlord: User) -> Property:
    prop = Property(
        id=uuid.uuid4(),
        landlord_id=landlord.id,
        title="Test Downtown Apartment",
        slug="test-downtown-apartment",
        description="A great test apartment in the heart of downtown.",
        property_type=PropertyType.APARTMENT,
        status=PropertyStatus.ACTIVE,
        address="123 Test St",
        city="Springfield",
        state="IL",
        zip_code="62701",
        neighborhood="Downtown",
        monthly_rent=Decimal("2500.00"),
        security_deposit=Decimal("2500.00"),
        bedrooms=2,
        bathrooms=Decimal("1.5"),
        square_feet=900,
        year_built=2020,
        pets_allowed=True,
        is_verified=True,
    )
    db_session.add(prop)
    await db_session.commit()
    await db_session.refresh(prop)
    return prop


def auth_header(user: User) -> dict[str, str]:
    """Generate an Authorization header for a given user."""
    token = create_access_token(str(user.id))
    return {"Authorization": f"Bearer {token}"}
