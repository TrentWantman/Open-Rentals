from __future__ import annotations

import uuid
from datetime import datetime
from decimal import Decimal
from enum import Enum as PyEnum
from typing import TYPE_CHECKING

from sqlalchemy import String, DateTime, Enum, Text, ForeignKey, Numeric, Index
from sqlalchemy.dialects.postgresql import UUID, JSONB
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.base import Base

if TYPE_CHECKING:
    from app.models.property import Property
    from app.models.user import User


class ApplicationStatus(str, PyEnum):
    PENDING = "pending"
    UNDER_REVIEW = "under_review"
    APPROVED = "approved"
    DENIED = "denied"
    WITHDRAWN = "withdrawn"


class RentalApplication(Base):
    __tablename__ = "rental_applications"
    __table_args__ = (
        # Index for querying applications by property
        Index("idx_applications_property_id", "property_id"),
        # Index for querying applications by applicant
        Index("idx_applications_applicant_id", "applicant_id"),
        # Index for filtering by status
        Index("idx_applications_status", "status"),
        # Composite index for property + status queries (common in landlord view)
        Index("idx_applications_property_status", "property_id", "status"),
        # Index for sorting by created_at
        Index("idx_applications_created_at", "created_at"),
    )

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), primary_key=True, default=uuid.uuid4
    )
    property_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), ForeignKey("properties.id"), nullable=False
    )
    applicant_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), ForeignKey("users.id"), nullable=False
    )

    # Status
    status: Mapped[ApplicationStatus] = mapped_column(
        Enum(ApplicationStatus), default=ApplicationStatus.PENDING
    )

    # Applicant info (snapshot at time of application)
    employment_status: Mapped[str | None] = mapped_column(String(100), nullable=True)
    employer_name: Mapped[str | None] = mapped_column(String(200), nullable=True)
    annual_income: Mapped[Decimal | None] = mapped_column(Numeric(12, 2), nullable=True)

    # Move-in details
    desired_move_in: Mapped[datetime | None] = mapped_column(DateTime, nullable=True)
    desired_lease_term: Mapped[int | None] = mapped_column(nullable=True)  # months

    # Additional info
    num_occupants: Mapped[int] = mapped_column(default=1)
    has_pets: Mapped[bool] = mapped_column(default=False)
    pet_details: Mapped[str | None] = mapped_column(Text, nullable=True)

    # Personal statement
    cover_letter: Mapped[str | None] = mapped_column(Text, nullable=True)

    # References and documents (stored as JSONB)
    references: Mapped[dict | None] = mapped_column(JSONB, nullable=True)
    # Example: [{"name": "...", "phone": "...", "relationship": "..."}]

    documents: Mapped[dict | None] = mapped_column(JSONB, nullable=True)
    # Example: [{"type": "pay_stub", "url": "..."}]

    # Screening results (if using tenant screening service)
    screening_report_id: Mapped[str | None] = mapped_column(String(100), nullable=True)
    screening_status: Mapped[str | None] = mapped_column(String(50), nullable=True)

    # Landlord response
    landlord_notes: Mapped[str | None] = mapped_column(Text, nullable=True)
    reviewed_at: Mapped[datetime | None] = mapped_column(DateTime, nullable=True)

    # Timestamps
    created_at: Mapped[datetime] = mapped_column(
        DateTime, default=datetime.utcnow, nullable=False
    )
    updated_at: Mapped[datetime] = mapped_column(
        DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False
    )

    # Relationships
    property: Mapped["Property"] = relationship("Property", back_populates="applications")
    applicant: Mapped["User"] = relationship("User", back_populates="applications")
