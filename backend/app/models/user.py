from __future__ import annotations

import uuid
from datetime import datetime
from enum import Enum as PyEnum
from typing import TYPE_CHECKING

from sqlalchemy import String, Boolean, DateTime, Enum, Text, Index
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.base import Base

if TYPE_CHECKING:
    from app.models.property import Property
    from app.models.application import RentalApplication
    from app.models.verification import LandlordVerification


class UserRole(str, PyEnum):
    RENTER = "renter"
    LANDLORD = "landlord"
    ADMIN = "admin"


class User(Base):
    __tablename__ = "users"
    __table_args__ = (
        # Index for filtering by role (admin queries)
        Index("idx_users_role", "role"),
        # Index for filtering active users
        Index("idx_users_is_active", "is_active"),
        # Composite index for role + active status
        Index("idx_users_role_active", "role", "is_active"),
        # Index for sorting by created_at
        Index("idx_users_created_at", "created_at"),
    )

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), primary_key=True, default=uuid.uuid4
    )
    email: Mapped[str] = mapped_column(String(255), unique=True, index=True, nullable=False)
    hashed_password: Mapped[str] = mapped_column(String(255), nullable=False)

    # Profile
    first_name: Mapped[str] = mapped_column(String(100), nullable=False)
    last_name: Mapped[str] = mapped_column(String(100), nullable=False)
    phone: Mapped[str | None] = mapped_column(String(20), nullable=True)
    avatar_url: Mapped[str | None] = mapped_column(String(500), nullable=True)
    bio: Mapped[str | None] = mapped_column(Text, nullable=True)

    # Role and status
    role: Mapped[UserRole] = mapped_column(
        Enum(UserRole), default=UserRole.RENTER, nullable=False
    )
    is_active: Mapped[bool] = mapped_column(Boolean, default=True)
    is_verified: Mapped[bool] = mapped_column(Boolean, default=False)
    email_verified: Mapped[bool] = mapped_column(Boolean, default=False)

    # Landlord-specific
    is_landlord_verified: Mapped[bool] = mapped_column(Boolean, default=False)
    company_name: Mapped[str | None] = mapped_column(String(200), nullable=True)

    # Timestamps
    created_at: Mapped[datetime] = mapped_column(
        DateTime, default=datetime.utcnow, nullable=False
    )
    updated_at: Mapped[datetime] = mapped_column(
        DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False
    )
    last_login: Mapped[datetime | None] = mapped_column(DateTime, nullable=True)

    # Relationships
    properties: Mapped[list["Property"]] = relationship(
        "Property", back_populates="landlord", lazy="selectin"
    )
    applications: Mapped[list["RentalApplication"]] = relationship(
        "RentalApplication", back_populates="applicant", lazy="selectin"
    )
    verification: Mapped["LandlordVerification"] = relationship(
        "LandlordVerification", back_populates="user", uselist=False
    )

    @property
    def full_name(self) -> str:
        return f"{self.first_name} {self.last_name}"
