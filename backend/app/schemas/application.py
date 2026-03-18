"""Rental application schemas for request/response validation."""
import uuid
from datetime import datetime
from decimal import Decimal
from typing import Optional, Any, List

from pydantic import BaseModel, Field

from app.models.application import ApplicationStatus


class ReferenceInfo(BaseModel):
    """Reference information."""
    name: str = Field(..., max_length=100)
    phone: str = Field(..., max_length=20)
    relationship: str = Field(..., max_length=50)
    email: Optional[str] = None


class DocumentInfo(BaseModel):
    """Document information."""
    type: str = Field(..., max_length=50)  # pay_stub, bank_statement, id, etc.
    url: str = Field(..., max_length=500)
    uploaded_at: Optional[datetime] = None


class ApplicationBase(BaseModel):
    """Base application schema with common fields."""
    # Employment info
    employment_status: Optional[str] = Field(None, max_length=100)
    employer_name: Optional[str] = Field(None, max_length=200)
    annual_income: Optional[Decimal] = Field(None, ge=0, decimal_places=2)

    # Move-in details
    desired_move_in: Optional[datetime] = None
    desired_lease_term: Optional[int] = Field(None, ge=1, le=60)  # months

    # Occupancy info
    num_occupants: int = Field(default=1, ge=1, le=20)
    has_pets: bool = False
    pet_details: Optional[str] = None

    # Personal statement
    cover_letter: Optional[str] = None


class ApplicationCreate(ApplicationBase):
    """Schema for creating a rental application."""
    property_id: uuid.UUID
    references: Optional[List[ReferenceInfo]] = None
    documents: Optional[List[DocumentInfo]] = None


class ApplicationUpdate(BaseModel):
    """Schema for updating a rental application (by applicant)."""
    employment_status: Optional[str] = Field(None, max_length=100)
    employer_name: Optional[str] = Field(None, max_length=200)
    annual_income: Optional[Decimal] = Field(None, ge=0, decimal_places=2)
    desired_move_in: Optional[datetime] = None
    desired_lease_term: Optional[int] = Field(None, ge=1, le=60)
    num_occupants: Optional[int] = Field(None, ge=1, le=20)
    has_pets: Optional[bool] = None
    pet_details: Optional[str] = None
    cover_letter: Optional[str] = None
    references: Optional[List[ReferenceInfo]] = None
    documents: Optional[List[DocumentInfo]] = None


class ApplicationStatusUpdate(BaseModel):
    """Schema for landlord updating application status."""
    status: ApplicationStatus
    landlord_notes: Optional[str] = None


class ApplicationWithdraw(BaseModel):
    """Schema for withdrawing an application."""
    reason: Optional[str] = None


class ApplicationResponse(BaseModel):
    """Schema for application response."""
    id: uuid.UUID
    property_id: uuid.UUID
    applicant_id: uuid.UUID

    # Status
    status: ApplicationStatus

    # Applicant info
    employment_status: Optional[str]
    employer_name: Optional[str]
    annual_income: Optional[Decimal]

    # Move-in details
    desired_move_in: Optional[datetime]
    desired_lease_term: Optional[int]

    # Occupancy
    num_occupants: int
    has_pets: bool
    pet_details: Optional[str]

    # Personal statement
    cover_letter: Optional[str]

    # References and documents
    references: Optional[List[dict[str, Any]]]
    documents: Optional[List[dict[str, Any]]]

    # Screening
    screening_report_id: Optional[str]
    screening_status: Optional[str]

    # Landlord response
    landlord_notes: Optional[str]
    reviewed_at: Optional[datetime]

    # Timestamps
    created_at: datetime
    updated_at: datetime

    model_config = {"from_attributes": True}


class ApplicationListResponse(BaseModel):
    """Paginated list of applications."""
    items: List[ApplicationResponse]
    total: int
    page: int
    page_size: int
    pages: int


class ApplicationListParams(BaseModel):
    """Parameters for listing applications."""
    page: int = Field(default=1, ge=1)
    page_size: int = Field(default=20, ge=1, le=100)
    status: Optional[ApplicationStatus] = None
    property_id: Optional[uuid.UUID] = None
