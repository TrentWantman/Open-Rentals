"""Property schemas for request/response validation."""
import uuid
from datetime import datetime
from decimal import Decimal
from typing import Optional, List, Any

from pydantic import BaseModel, Field, field_validator

from app.models.property import PropertyType, PropertyStatus


class LocationInput(BaseModel):
    """Geographic coordinates input."""
    latitude: float = Field(..., ge=-90, le=90)
    longitude: float = Field(..., ge=-180, le=180)


class LocationOutput(BaseModel):
    """Geographic coordinates output."""
    latitude: float
    longitude: float


class PropertyImageBase(BaseModel):
    """Base property image schema."""
    url: str = Field(..., max_length=500)
    thumbnail_url: Optional[str] = Field(None, max_length=500)
    caption: Optional[str] = Field(None, max_length=200)
    is_primary: bool = False
    order: int = 0


class PropertyImageCreate(PropertyImageBase):
    """Schema for creating property image."""
    pass


class PropertyImageResponse(PropertyImageBase):
    """Schema for property image response."""
    id: uuid.UUID
    property_id: uuid.UUID
    created_at: datetime

    model_config = {"from_attributes": True}


class PropertyBase(BaseModel):
    """Base property schema with common fields."""
    title: str = Field(..., min_length=5, max_length=200)
    description: str = Field(..., min_length=20)
    property_type: PropertyType

    # Location
    address: str = Field(..., max_length=300)
    unit_number: Optional[str] = Field(None, max_length=20)
    city: str = Field(default="Miami", max_length=100)
    state: str = Field(default="FL", max_length=50)
    zip_code: str = Field(..., max_length=10, pattern=r"^\d{5}(-\d{4})?$")
    neighborhood: Optional[str] = Field(None, max_length=100)

    # Pricing
    monthly_rent: Decimal = Field(..., ge=0, decimal_places=2)
    security_deposit: Optional[Decimal] = Field(None, ge=0, decimal_places=2)
    application_fee: Optional[Decimal] = Field(None, ge=0, decimal_places=2)

    # Features
    bedrooms: int = Field(..., ge=0, le=20)
    bathrooms: Decimal = Field(..., ge=0, le=20, decimal_places=1)
    square_feet: Optional[int] = Field(None, ge=0)
    year_built: Optional[int] = Field(None, ge=1800, le=2100)

    # Amenities
    amenities: Optional[dict[str, Any]] = None

    # Policies
    pets_allowed: bool = False
    pet_deposit: Optional[Decimal] = Field(None, ge=0, decimal_places=2)
    smoking_allowed: bool = False

    # Availability
    available_date: Optional[datetime] = None
    lease_term_months: int = Field(default=12, ge=1, le=60)


class PropertyCreate(PropertyBase):
    """Schema for creating a property."""
    location: Optional[LocationInput] = None
    images: Optional[List[PropertyImageCreate]] = None

    @field_validator("monthly_rent")
    @classmethod
    def validate_rent(cls, v: Decimal) -> Decimal:
        if v <= 0:
            raise ValueError("Monthly rent must be greater than 0")
        return v


class PropertyUpdate(BaseModel):
    """Schema for updating a property."""
    title: Optional[str] = Field(None, min_length=5, max_length=200)
    description: Optional[str] = Field(None, min_length=20)
    property_type: Optional[PropertyType] = None
    status: Optional[PropertyStatus] = None

    # Location
    address: Optional[str] = Field(None, max_length=300)
    unit_number: Optional[str] = Field(None, max_length=20)
    city: Optional[str] = Field(None, max_length=100)
    state: Optional[str] = Field(None, max_length=50)
    zip_code: Optional[str] = Field(None, max_length=10, pattern=r"^\d{5}(-\d{4})?$")
    neighborhood: Optional[str] = Field(None, max_length=100)
    location: Optional[LocationInput] = None

    # Pricing
    monthly_rent: Optional[Decimal] = Field(None, ge=0, decimal_places=2)
    security_deposit: Optional[Decimal] = Field(None, ge=0, decimal_places=2)
    application_fee: Optional[Decimal] = Field(None, ge=0, decimal_places=2)

    # Features
    bedrooms: Optional[int] = Field(None, ge=0, le=20)
    bathrooms: Optional[Decimal] = Field(None, ge=0, le=20, decimal_places=1)
    square_feet: Optional[int] = Field(None, ge=0)
    year_built: Optional[int] = Field(None, ge=1800, le=2100)

    # Amenities
    amenities: Optional[dict[str, Any]] = None

    # Policies
    pets_allowed: Optional[bool] = None
    pet_deposit: Optional[Decimal] = Field(None, ge=0, decimal_places=2)
    smoking_allowed: Optional[bool] = None

    # Availability
    available_date: Optional[datetime] = None
    lease_term_months: Optional[int] = Field(None, ge=1, le=60)


class PropertyResponse(BaseModel):
    """Schema for property response."""
    id: uuid.UUID
    landlord_id: uuid.UUID

    # Basic info
    title: str
    slug: str
    description: str
    property_type: PropertyType
    status: PropertyStatus

    # Location
    address: str
    unit_number: Optional[str]
    city: str
    state: str
    zip_code: str
    neighborhood: Optional[str]
    location: Optional[LocationOutput] = None

    # Pricing
    monthly_rent: Decimal
    security_deposit: Optional[Decimal]
    application_fee: Optional[Decimal]

    # Features
    bedrooms: int
    bathrooms: Decimal
    square_feet: Optional[int]
    year_built: Optional[int]

    # Amenities
    amenities: Optional[dict[str, Any]]

    # Policies
    pets_allowed: bool
    pet_deposit: Optional[Decimal]
    smoking_allowed: bool

    # Availability
    available_date: Optional[datetime]
    lease_term_months: int

    # Verification
    is_verified: bool
    verified_at: Optional[datetime]

    # Analytics
    view_count: int
    inquiry_count: int

    # Timestamps
    created_at: datetime
    updated_at: datetime

    # Related
    images: List[PropertyImageResponse] = []

    # Distance (populated in geo searches)
    distance_miles: Optional[float] = None

    model_config = {"from_attributes": True}


class PropertyListResponse(BaseModel):
    """Paginated list of properties."""
    items: List[PropertyResponse]
    total: int
    page: int
    page_size: int
    pages: int


class PropertySearchParams(BaseModel):
    """Search parameters for property listing."""
    # Pagination
    page: int = Field(default=1, ge=1)
    page_size: int = Field(default=20, ge=1, le=100)

    # Geo search
    latitude: Optional[float] = Field(None, ge=-90, le=90)
    longitude: Optional[float] = Field(None, ge=-180, le=180)
    radius_miles: Optional[float] = Field(None, ge=0.1, le=100)

    # Filters
    min_price: Optional[Decimal] = Field(None, ge=0)
    max_price: Optional[Decimal] = Field(None, ge=0)
    min_bedrooms: Optional[int] = Field(None, ge=0)
    max_bedrooms: Optional[int] = Field(None, ge=0)
    min_bathrooms: Optional[Decimal] = Field(None, ge=0)
    max_bathrooms: Optional[Decimal] = Field(None, ge=0)
    property_type: Optional[PropertyType] = None
    neighborhood: Optional[str] = None
    pets_allowed: Optional[bool] = None

    # Sorting
    sort_by: str = Field(default="created_at", pattern=r"^(price|created_at|distance)$")
    sort_order: str = Field(default="desc", pattern=r"^(asc|desc)$")

    @field_validator("max_price")
    @classmethod
    def validate_price_range(cls, v: Optional[Decimal], info) -> Optional[Decimal]:
        min_price = info.data.get("min_price")
        if v is not None and min_price is not None and v < min_price:
            raise ValueError("max_price must be greater than or equal to min_price")
        return v
