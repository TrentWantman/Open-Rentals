from __future__ import annotations

import uuid
from datetime import datetime
from decimal import Decimal
from enum import Enum as PyEnum
from typing import TYPE_CHECKING

from geoalchemy2 import Geometry
from sqlalchemy import (
    String, Boolean, DateTime, Enum, Text, Integer,
    Numeric, ForeignKey, Index
)
from sqlalchemy.dialects.postgresql import UUID, JSONB
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.base import Base

if TYPE_CHECKING:
    from app.models.user import User
    from app.models.application import RentalApplication


class PropertyType(str, PyEnum):
    APARTMENT = "apartment"
    CONDO = "condo"
    HOUSE = "house"
    TOWNHOUSE = "townhouse"
    STUDIO = "studio"
    ROOM = "room"


class PropertyStatus(str, PyEnum):
    DRAFT = "draft"
    PENDING_REVIEW = "pending_review"
    ACTIVE = "active"
    RENTED = "rented"
    INACTIVE = "inactive"


class Property(Base):
    __tablename__ = "properties"
    __table_args__ = (
        Index("idx_properties_location", "location", postgresql_using="gist"),
        Index("idx_properties_status_price", "status", "monthly_rent"),
        Index("idx_properties_neighborhood", "neighborhood"),
    )

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), primary_key=True, default=uuid.uuid4
    )
    landlord_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), ForeignKey("users.id"), nullable=False
    )

    # Basic info
    title: Mapped[str] = mapped_column(String(200), nullable=False)
    slug: Mapped[str] = mapped_column(String(250), unique=True, nullable=False)
    description: Mapped[str] = mapped_column(Text, nullable=False)
    property_type: Mapped[PropertyType] = mapped_column(
        Enum(PropertyType), nullable=False
    )
    status: Mapped[PropertyStatus] = mapped_column(
        Enum(PropertyStatus), default=PropertyStatus.DRAFT
    )

    # Location
    address: Mapped[str] = mapped_column(String(300), nullable=False)
    unit_number: Mapped[str | None] = mapped_column(String(20), nullable=True)
    city: Mapped[str] = mapped_column(String(100), nullable=False)
    state: Mapped[str] = mapped_column(String(50), nullable=False)
    zip_code: Mapped[str] = mapped_column(String(10), nullable=False)
    neighborhood: Mapped[str | None] = mapped_column(String(100), nullable=True)
    location: Mapped[Geometry] = mapped_column(
        Geometry(geometry_type="POINT", srid=4326), nullable=True
    )

    # Pricing
    monthly_rent: Mapped[Decimal] = mapped_column(Numeric(10, 2), nullable=False)
    security_deposit: Mapped[Decimal | None] = mapped_column(Numeric(10, 2), nullable=True)
    application_fee: Mapped[Decimal | None] = mapped_column(Numeric(10, 2), nullable=True)

    # Features
    bedrooms: Mapped[int] = mapped_column(Integer, nullable=False)
    bathrooms: Mapped[Decimal] = mapped_column(Numeric(3, 1), nullable=False)
    square_feet: Mapped[int | None] = mapped_column(Integer, nullable=True)
    year_built: Mapped[int | None] = mapped_column(Integer, nullable=True)

    # Amenities (JSONB for flexibility)
    amenities: Mapped[dict | None] = mapped_column(JSONB, nullable=True)
    # Example: {"parking": true, "pool": true, "gym": false, "laundry": "in_unit"}

    # Policies
    pets_allowed: Mapped[bool] = mapped_column(Boolean, default=False)
    pet_deposit: Mapped[Decimal | None] = mapped_column(Numeric(10, 2), nullable=True)
    smoking_allowed: Mapped[bool] = mapped_column(Boolean, default=False)

    # Availability
    available_date: Mapped[datetime | None] = mapped_column(DateTime, nullable=True)
    lease_term_months: Mapped[int] = mapped_column(Integer, default=12)

    # Verification
    is_verified: Mapped[bool] = mapped_column(Boolean, default=False)
    verified_at: Mapped[datetime | None] = mapped_column(DateTime, nullable=True)

    # Analytics
    view_count: Mapped[int] = mapped_column(Integer, default=0)
    inquiry_count: Mapped[int] = mapped_column(Integer, default=0)

    # Timestamps
    created_at: Mapped[datetime] = mapped_column(
        DateTime, default=datetime.utcnow, nullable=False
    )
    updated_at: Mapped[datetime] = mapped_column(
        DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False
    )

    # Relationships
    landlord: Mapped["User"] = relationship("User", back_populates="properties")
    images: Mapped[list["PropertyImage"]] = relationship(
        "PropertyImage", back_populates="property", lazy="selectin",
        cascade="all, delete-orphan"
    )
    applications: Mapped[list["RentalApplication"]] = relationship(
        "RentalApplication", back_populates="property", lazy="selectin"
    )


class PropertyImage(Base):
    __tablename__ = "property_images"

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), primary_key=True, default=uuid.uuid4
    )
    property_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), ForeignKey("properties.id", ondelete="CASCADE"), nullable=False
    )

    url: Mapped[str] = mapped_column(String(500), nullable=False)
    thumbnail_url: Mapped[str | None] = mapped_column(String(500), nullable=True)
    caption: Mapped[str | None] = mapped_column(String(200), nullable=True)
    is_primary: Mapped[bool] = mapped_column(Boolean, default=False)
    order: Mapped[int] = mapped_column(Integer, default=0)

    created_at: Mapped[datetime] = mapped_column(
        DateTime, default=datetime.utcnow, nullable=False
    )

    # Relationships
    property: Mapped["Property"] = relationship("Property", back_populates="images")
