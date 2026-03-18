from __future__ import annotations

import uuid
from datetime import datetime
from enum import Enum as PyEnum
from typing import TYPE_CHECKING

from sqlalchemy import String, DateTime, Enum, Text, ForeignKey
from sqlalchemy.dialects.postgresql import UUID, JSONB
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.base import Base

if TYPE_CHECKING:
    from app.models.user import User


class VerificationStatus(str, PyEnum):
    PENDING = "pending"
    IN_REVIEW = "in_review"
    APPROVED = "approved"
    REJECTED = "rejected"
    EXPIRED = "expired"


class VerificationType(str, PyEnum):
    IDENTITY = "identity"
    OWNERSHIP = "ownership"
    BUSINESS = "business"


class LandlordVerification(Base):
    """
    Verification records for landlords.
    This is the key differentiator - verified landlords prevent rental fraud.
    """
    __tablename__ = "landlord_verifications"

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), primary_key=True, default=uuid.uuid4
    )
    user_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), ForeignKey("users.id"), unique=True, nullable=False
    )

    # Verification type and status
    verification_type: Mapped[VerificationType] = mapped_column(
        Enum(VerificationType), default=VerificationType.IDENTITY
    )
    status: Mapped[VerificationStatus] = mapped_column(
        Enum(VerificationStatus), default=VerificationStatus.PENDING
    )

    # Identity verification (via Persona or similar)
    identity_verification_id: Mapped[str | None] = mapped_column(String(100), nullable=True)
    identity_verified_at: Mapped[datetime | None] = mapped_column(DateTime, nullable=True)

    # Property ownership verification
    ownership_documents: Mapped[dict | None] = mapped_column(JSONB, nullable=True)
    # Example: [{"type": "deed", "url": "...", "verified": true}]

    # Business verification (for property managers)
    business_license: Mapped[str | None] = mapped_column(String(100), nullable=True)
    business_verified_at: Mapped[datetime | None] = mapped_column(DateTime, nullable=True)

    # Admin notes
    admin_notes: Mapped[str | None] = mapped_column(Text, nullable=True)
    reviewed_by: Mapped[str | None] = mapped_column(String(100), nullable=True)

    # Timestamps
    submitted_at: Mapped[datetime] = mapped_column(
        DateTime, default=datetime.utcnow, nullable=False
    )
    reviewed_at: Mapped[datetime | None] = mapped_column(DateTime, nullable=True)
    expires_at: Mapped[datetime | None] = mapped_column(DateTime, nullable=True)

    created_at: Mapped[datetime] = mapped_column(
        DateTime, default=datetime.utcnow, nullable=False
    )
    updated_at: Mapped[datetime] = mapped_column(
        DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False
    )

    # Relationships
    user: Mapped["User"] = relationship("User", back_populates="verification")
