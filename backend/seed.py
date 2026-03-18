"""
Seed script — populates the database with demo data for local development.

Usage:
    cd backend
    python seed.py

Creates:
    - 1 admin user
    - 2 landlord users (verified)
    - 3 renter users
    - 12 property listings across various neighborhoods
"""

import asyncio
import sys
from datetime import datetime, timedelta
from decimal import Decimal

from sqlalchemy import text

# Make sure app is importable from backend/
sys.path.insert(0, ".")

from app.db.base import engine, async_session_maker
from app.db.base import import_all_models
from app.models.user import User, UserRole
from app.models.property import Property, PropertyImage, PropertyType, PropertyStatus
from app.core.security import get_password_hash

import_all_models()


# ---------------------------------------------------------------------------
# Demo users
# ---------------------------------------------------------------------------

USERS = [
    {
        "email": "admin@example.com",
        "password": "admin1234",
        "first_name": "Alex",
        "last_name": "Admin",
        "role": UserRole.ADMIN,
        "is_active": True,
        "is_verified": True,
        "email_verified": True,
        "is_landlord_verified": False,
    },
    {
        "email": "landlord1@example.com",
        "password": "landlord1234",
        "first_name": "Jordan",
        "last_name": "Rivera",
        "role": UserRole.LANDLORD,
        "is_active": True,
        "is_verified": True,
        "email_verified": True,
        "is_landlord_verified": True,
        "company_name": "Rivera Properties",
        "phone": "+1-555-0101",
        "bio": "Licensed property manager with 10+ years of experience.",
    },
    {
        "email": "landlord2@example.com",
        "password": "landlord1234",
        "first_name": "Morgan",
        "last_name": "Chen",
        "role": UserRole.LANDLORD,
        "is_active": True,
        "is_verified": True,
        "email_verified": True,
        "is_landlord_verified": True,
        "company_name": "Chen Urban Living",
        "phone": "+1-555-0102",
        "bio": "Specializing in downtown apartments and luxury condos.",
    },
    {
        "email": "renter1@example.com",
        "password": "renter1234",
        "first_name": "Sam",
        "last_name": "Park",
        "role": UserRole.RENTER,
        "is_active": True,
        "email_verified": True,
    },
    {
        "email": "renter2@example.com",
        "password": "renter1234",
        "first_name": "Taylor",
        "last_name": "Brooks",
        "role": UserRole.RENTER,
        "is_active": True,
        "email_verified": True,
    },
    {
        "email": "renter3@example.com",
        "password": "renter1234",
        "first_name": "Casey",
        "last_name": "Kim",
        "role": UserRole.RENTER,
        "is_active": True,
        "email_verified": False,
    },
]


# ---------------------------------------------------------------------------
# Demo properties
# Two landlords split the listings. Coordinates are illustrative — replace
# with real lat/lng for your city when deploying.
# ---------------------------------------------------------------------------

PROPERTIES = [
    # --- Landlord 1 listings ---
    {
        "landlord_key": "landlord1@example.com",
        "title": "Modern 2BR in the Financial District",
        "description": (
            "Bright, open-plan apartment on the 14th floor with panoramic city views. "
            "Renovated kitchen, in-unit washer/dryer, and dedicated parking included. "
            "Walk to transit, restaurants, and parks."
        ),
        "property_type": PropertyType.APARTMENT,
        "status": PropertyStatus.ACTIVE,
        "address": "200 Commerce St",
        "city": "Springfield",
        "state": "IL",
        "zip_code": "62701",
        "neighborhood": "Financial District",
        "latitude": 39.7990,
        "longitude": -89.6440,
        "monthly_rent": Decimal("2800"),
        "security_deposit": Decimal("2800"),
        "application_fee": Decimal("50"),
        "bedrooms": 2,
        "bathrooms": Decimal("2.0"),
        "square_feet": 1050,
        "year_built": 2018,
        "amenities": {"parking": True, "gym": True, "laundry": "in_unit", "doorman": True},
        "pets_allowed": False,
        "lease_term_months": 12,
        "is_verified": True,
        "available_date": datetime.utcnow() + timedelta(days=14),
    },
    {
        "landlord_key": "landlord1@example.com",
        "title": "Cozy Studio near Arts District",
        "description": (
            "Perfect for a single professional or student. Updated bath, stainless appliances, "
            "and great natural light. Rooftop access shared with residents."
        ),
        "property_type": PropertyType.STUDIO,
        "status": PropertyStatus.ACTIVE,
        "address": "88 Gallery Ave",
        "city": "Springfield",
        "state": "IL",
        "zip_code": "62702",
        "neighborhood": "Arts District",
        "latitude": 39.8020,
        "longitude": -89.6500,
        "monthly_rent": Decimal("1400"),
        "security_deposit": Decimal("1400"),
        "application_fee": Decimal("40"),
        "bedrooms": 0,
        "bathrooms": Decimal("1.0"),
        "square_feet": 480,
        "year_built": 2005,
        "amenities": {"rooftop": True, "laundry": "shared", "bike_storage": True},
        "pets_allowed": True,
        "pet_deposit": Decimal("300"),
        "lease_term_months": 6,
        "is_verified": True,
        "available_date": datetime.utcnow() + timedelta(days=7),
    },
    {
        "landlord_key": "landlord1@example.com",
        "title": "Spacious 3BR Townhouse with Garage",
        "description": (
            "Family-sized townhouse spread over three floors. Private backyard, attached 2-car garage, "
            "and updated kitchen. Quiet residential street, top-rated school district."
        ),
        "property_type": PropertyType.TOWNHOUSE,
        "status": PropertyStatus.ACTIVE,
        "address": "12 Maple Lane",
        "city": "Springfield",
        "state": "IL",
        "zip_code": "62704",
        "neighborhood": "Suburbs North",
        "latitude": 39.8150,
        "longitude": -89.6600,
        "monthly_rent": Decimal("3500"),
        "security_deposit": Decimal("5000"),
        "application_fee": Decimal("75"),
        "bedrooms": 3,
        "bathrooms": Decimal("2.5"),
        "square_feet": 1900,
        "year_built": 2012,
        "amenities": {"parking": True, "backyard": True, "laundry": "in_unit"},
        "pets_allowed": True,
        "pet_deposit": Decimal("500"),
        "lease_term_months": 12,
        "is_verified": True,
        "available_date": datetime.utcnow() + timedelta(days=30),
    },
    {
        "landlord_key": "landlord1@example.com",
        "title": "1BR Apartment — Waterfront Views",
        "description": (
            "Wake up to water views every morning. Open living area, hardwood floors throughout, "
            "and a private balcony. Secure building with concierge."
        ),
        "property_type": PropertyType.APARTMENT,
        "status": PropertyStatus.ACTIVE,
        "address": "500 Harbor Blvd",
        "unit_number": "7C",
        "city": "Springfield",
        "state": "IL",
        "zip_code": "62701",
        "neighborhood": "Waterfront",
        "latitude": 39.7960,
        "longitude": -89.6380,
        "monthly_rent": Decimal("2200"),
        "security_deposit": Decimal("2200"),
        "application_fee": Decimal("50"),
        "bedrooms": 1,
        "bathrooms": Decimal("1.0"),
        "square_feet": 720,
        "year_built": 2020,
        "amenities": {"pool": True, "gym": True, "doorman": True, "laundry": "in_unit"},
        "pets_allowed": False,
        "lease_term_months": 12,
        "is_verified": True,
        "available_date": datetime.utcnow() + timedelta(days=1),
    },
    {
        "landlord_key": "landlord1@example.com",
        "title": "Renovated 2BR near University District",
        "description": (
            "Newly renovated apartment two blocks from campus. New appliances, granite counters, "
            "and ample closet space. On-site laundry, bike storage, and covered parking available."
        ),
        "property_type": PropertyType.APARTMENT,
        "status": PropertyStatus.ACTIVE,
        "address": "310 College Ave",
        "city": "Springfield",
        "state": "IL",
        "zip_code": "62703",
        "neighborhood": "University District",
        "latitude": 39.8090,
        "longitude": -89.6520,
        "monthly_rent": Decimal("1950"),
        "security_deposit": Decimal("1950"),
        "application_fee": Decimal("35"),
        "bedrooms": 2,
        "bathrooms": Decimal("1.0"),
        "square_feet": 850,
        "year_built": 1998,
        "amenities": {"laundry": "shared", "bike_storage": True, "parking": True},
        "pets_allowed": True,
        "pet_deposit": Decimal("300"),
        "lease_term_months": 10,
        "is_verified": False,
        "available_date": datetime.utcnow() + timedelta(days=45),
    },
    {
        "landlord_key": "landlord1@example.com",
        "title": "Charming 1BR in Old Town",
        "description": (
            "Historic brick building with original character. High ceilings, exposed brick accent wall, "
            "and updated kitchen. Steps from boutique shops and weekend farmers market."
        ),
        "property_type": PropertyType.APARTMENT,
        "status": PropertyStatus.ACTIVE,
        "address": "44 Cobblestone Rd",
        "city": "Springfield",
        "state": "IL",
        "zip_code": "62702",
        "neighborhood": "Old Town",
        "latitude": 39.8005,
        "longitude": -89.6465,
        "monthly_rent": Decimal("1750"),
        "security_deposit": Decimal("1750"),
        "application_fee": Decimal("40"),
        "bedrooms": 1,
        "bathrooms": Decimal("1.0"),
        "square_feet": 640,
        "year_built": 1940,
        "amenities": {"laundry": "shared"},
        "pets_allowed": True,
        "pet_deposit": Decimal("250"),
        "lease_term_months": 12,
        "is_verified": True,
        "available_date": datetime.utcnow() + timedelta(days=21),
    },

    # --- Landlord 2 listings ---
    {
        "landlord_key": "landlord2@example.com",
        "title": "Luxury Condo — Downtown Penthouse",
        "description": (
            "Top-floor corner unit with floor-to-ceiling windows and a wraparound terrace. "
            "Chef's kitchen, spa bathroom, and private elevator access. Two parking spaces included."
        ),
        "property_type": PropertyType.CONDO,
        "status": PropertyStatus.ACTIVE,
        "address": "1 Tower Plaza",
        "unit_number": "PH2",
        "city": "Springfield",
        "state": "IL",
        "zip_code": "62701",
        "neighborhood": "Downtown",
        "latitude": 39.7975,
        "longitude": -89.6430,
        "monthly_rent": Decimal("7500"),
        "security_deposit": Decimal("10000"),
        "application_fee": Decimal("100"),
        "bedrooms": 3,
        "bathrooms": Decimal("3.0"),
        "square_feet": 2400,
        "year_built": 2022,
        "amenities": {
            "parking": True, "pool": True, "gym": True, "concierge": True,
            "laundry": "in_unit", "terrace": True,
        },
        "pets_allowed": True,
        "pet_deposit": Decimal("1000"),
        "lease_term_months": 12,
        "is_verified": True,
        "available_date": datetime.utcnow() + timedelta(days=60),
    },
    {
        "landlord_key": "landlord2@example.com",
        "title": "Midtown 2BR with Private Rooftop",
        "description": (
            "Stylish two-bedroom in the heart of Midtown. Open kitchen, premium finishes, "
            "and an exclusive rooftop patio for the unit. Perfect for remote workers."
        ),
        "property_type": PropertyType.CONDO,
        "status": PropertyStatus.ACTIVE,
        "address": "780 5th Ave",
        "unit_number": "3A",
        "city": "Springfield",
        "state": "IL",
        "zip_code": "62701",
        "neighborhood": "Midtown",
        "latitude": 39.8035,
        "longitude": -89.6455,
        "monthly_rent": Decimal("3900"),
        "security_deposit": Decimal("3900"),
        "application_fee": Decimal("65"),
        "bedrooms": 2,
        "bathrooms": Decimal("2.0"),
        "square_feet": 1200,
        "year_built": 2019,
        "amenities": {"rooftop": True, "gym": True, "laundry": "in_unit", "parking": True},
        "pets_allowed": False,
        "lease_term_months": 12,
        "is_verified": True,
        "available_date": datetime.utcnow() + timedelta(days=10),
    },
    {
        "landlord_key": "landlord2@example.com",
        "title": "4BR House — South End with Backyard Pool",
        "description": (
            "Spacious single-family home ideal for a large household. Private pool, two-car driveway, "
            "updated kitchen, and smart home features throughout."
        ),
        "property_type": PropertyType.HOUSE,
        "status": PropertyStatus.ACTIVE,
        "address": "92 Willow Dr",
        "city": "Springfield",
        "state": "IL",
        "zip_code": "62705",
        "neighborhood": "South End",
        "latitude": 39.7880,
        "longitude": -89.6540,
        "monthly_rent": Decimal("5200"),
        "security_deposit": Decimal("7500"),
        "application_fee": Decimal("75"),
        "bedrooms": 4,
        "bathrooms": Decimal("3.0"),
        "square_feet": 2800,
        "year_built": 2015,
        "amenities": {"pool": True, "parking": True, "laundry": "in_unit", "backyard": True},
        "pets_allowed": True,
        "pet_deposit": Decimal("800"),
        "lease_term_months": 12,
        "is_verified": True,
        "available_date": datetime.utcnow() + timedelta(days=30),
    },
    {
        "landlord_key": "landlord2@example.com",
        "title": "Studio Loft in Arts District",
        "description": (
            "Industrial-chic loft with 14-foot ceilings and polished concrete floors. "
            "Open layout, modern kitchen island, and massive windows. "
            "Right next to galleries, coffee shops, and music venues."
        ),
        "property_type": PropertyType.STUDIO,
        "status": PropertyStatus.ACTIVE,
        "address": "200 Mural St",
        "unit_number": "2B",
        "city": "Springfield",
        "state": "IL",
        "zip_code": "62702",
        "neighborhood": "Arts District",
        "latitude": 39.8010,
        "longitude": -89.6490,
        "monthly_rent": Decimal("1800"),
        "security_deposit": Decimal("1800"),
        "application_fee": Decimal("50"),
        "bedrooms": 0,
        "bathrooms": Decimal("1.0"),
        "square_feet": 600,
        "year_built": 2000,
        "amenities": {"laundry": "shared", "bike_storage": True},
        "pets_allowed": True,
        "pet_deposit": Decimal("350"),
        "lease_term_months": 6,
        "is_verified": True,
        "available_date": datetime.utcnow() + timedelta(days=3),
    },
    {
        "landlord_key": "landlord2@example.com",
        "title": "3BR Apartment — Uptown with Skyline View",
        "description": (
            "Generous three-bedroom on the 22nd floor with unobstructed skyline views. "
            "Modern finishes, in-unit laundry, two full baths, and a dedicated parking spot."
        ),
        "property_type": PropertyType.APARTMENT,
        "status": PropertyStatus.ACTIVE,
        "address": "400 Uptown Blvd",
        "unit_number": "2204",
        "city": "Springfield",
        "state": "IL",
        "zip_code": "62701",
        "neighborhood": "Uptown",
        "latitude": 39.8060,
        "longitude": -89.6410,
        "monthly_rent": Decimal("4500"),
        "security_deposit": Decimal("4500"),
        "application_fee": Decimal("80"),
        "bedrooms": 3,
        "bathrooms": Decimal("2.0"),
        "square_feet": 1600,
        "year_built": 2021,
        "amenities": {"parking": True, "gym": True, "laundry": "in_unit", "pool": True},
        "pets_allowed": False,
        "lease_term_months": 12,
        "is_verified": True,
        "available_date": datetime.utcnow() + timedelta(days=20),
    },
    {
        "landlord_key": "landlord2@example.com",
        "title": "1BR near North End Transit Hub",
        "description": (
            "Commuter's dream — one block from the light rail station. "
            "Clean, modern finishes, dishwasher, and covered bike parking. "
            "Great walkability score."
        ),
        "property_type": PropertyType.APARTMENT,
        "status": PropertyStatus.ACTIVE,
        "address": "55 Transit Way",
        "city": "Springfield",
        "state": "IL",
        "zip_code": "62703",
        "neighborhood": "North End",
        "latitude": 39.8120,
        "longitude": -89.6480,
        "monthly_rent": Decimal("1650"),
        "security_deposit": Decimal("1650"),
        "application_fee": Decimal("40"),
        "bedrooms": 1,
        "bathrooms": Decimal("1.0"),
        "square_feet": 580,
        "year_built": 2010,
        "amenities": {"laundry": "shared", "bike_storage": True},
        "pets_allowed": False,
        "lease_term_months": 12,
        "is_verified": False,
        "available_date": datetime.utcnow() + timedelta(days=5),
    },
]


# ---------------------------------------------------------------------------
# Helpers
# ---------------------------------------------------------------------------

def make_slug(title: str, idx: int) -> str:
    slug = title.lower()
    for ch in " /\\.,!?()&":
        slug = slug.replace(ch, "-")
    slug = "-".join(p for p in slug.split("-") if p)
    return f"{slug}-{idx}"


# ---------------------------------------------------------------------------
# Main
# ---------------------------------------------------------------------------

async def seed() -> None:
    async with engine.begin() as conn:
        # Verify PostGIS is available
        result = await conn.execute(text("SELECT PostGIS_Version()"))
        postgis_ver = result.scalar()
        print(f"PostGIS version: {postgis_ver}")

    async with async_session_maker() as session:
        # Check for existing data
        from sqlalchemy import select
        existing = await session.execute(select(User).limit(1))
        if existing.scalar_one_or_none():
            print("Database already contains data — skipping seed.")
            print("To re-seed, truncate the users and properties tables first.")
            return

        print("Creating users...")
        user_map: dict[str, User] = {}
        for u in USERS:
            user = User(
                email=u["email"],
                hashed_password=get_password_hash(u["password"]),
                first_name=u["first_name"],
                last_name=u["last_name"],
                role=u["role"],
                is_active=u.get("is_active", True),
                is_verified=u.get("is_verified", False),
                email_verified=u.get("email_verified", False),
                is_landlord_verified=u.get("is_landlord_verified", False),
                company_name=u.get("company_name"),
                phone=u.get("phone"),
                bio=u.get("bio"),
            )
            session.add(user)
            user_map[u["email"]] = user
            print(f"  + {u['role'].value}: {u['email']}  (password: {u['password']})")

        await session.flush()

        print("\nCreating properties...")
        for idx, p in enumerate(PROPERTIES):
            landlord = user_map[p["landlord_key"]]
            lat = p.pop("latitude", None)
            lng = p.pop("longitude", None)
            landlord_key = p.pop("landlord_key")

            prop = Property(
                landlord_id=landlord.id,
                slug=make_slug(p["title"], idx),
                **{k: v for k, v in p.items() if k not in ("latitude", "longitude", "landlord_key")},
            )

            if lat is not None and lng is not None:
                prop.location = f"SRID=4326;POINT({lng} {lat})"

            session.add(prop)
            print(f"  + [{p['property_type'].value}] {p['title']}")

        await session.commit()

    print("\nSeed complete.")
    print("\nDemo credentials:")
    print("  Admin:     admin@example.com       / admin1234")
    print("  Landlord:  landlord1@example.com   / landlord1234")
    print("  Landlord:  landlord2@example.com   / landlord1234")
    print("  Renter:    renter1@example.com     / renter1234")


if __name__ == "__main__":
    asyncio.run(seed())
