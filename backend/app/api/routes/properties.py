"""Property management routes with geo-search capabilities."""
import math
import re
import uuid
from datetime import datetime, timezone
from decimal import Decimal
from typing import Any, List, Optional

from fastapi import APIRouter, HTTPException, status, Query, Path, UploadFile, File
from geoalchemy2 import Geography
from geoalchemy2.functions import ST_DWithin, ST_Distance, ST_SetSRID, ST_MakePoint
from sqlalchemy import select, func, and_, or_, case, cast, update
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import selectinload

from app.api.deps import DbSession, CurrentUser, LandlordUser, VerifiedLandlordUser, AdminUser
from app.core.security import sanitize_search_query
from app.models.property import Property, PropertyImage, PropertyType, PropertyStatus
from app.models.user import UserRole
from app.schemas.property import (
    PropertyCreate,
    PropertyUpdate,
    PropertyResponse,
    PropertyListResponse,
    PropertySearchParams,
    PropertyImageCreate,
    PropertyImageResponse,
    LocationOutput,
)

router = APIRouter()

# Conversion factor: 1 mile = 1609.344 meters
METERS_PER_MILE = 1609.344


def generate_slug(title: str, existing_id: uuid.UUID | None = None) -> str:
    """Generate a URL-friendly slug from title."""
    slug = title.lower()
    slug = re.sub(r"[^\w\s-]", "", slug)
    slug = re.sub(r"[-\s]+", "-", slug).strip("-")
    # Add a unique suffix
    unique_suffix = str(uuid.uuid4())[:8]
    return f"{slug}-{unique_suffix}"


def property_to_response(prop: Property, distance_meters: float | None = None) -> dict:
    """Convert property model to response dict with location parsing."""
    response_dict = {
        "id": prop.id,
        "landlord_id": prop.landlord_id,
        "title": prop.title,
        "slug": prop.slug,
        "description": prop.description,
        "property_type": prop.property_type,
        "status": prop.status,
        "address": prop.address,
        "unit_number": prop.unit_number,
        "city": prop.city,
        "state": prop.state,
        "zip_code": prop.zip_code,
        "neighborhood": prop.neighborhood,
        "monthly_rent": prop.monthly_rent,
        "security_deposit": prop.security_deposit,
        "application_fee": prop.application_fee,
        "bedrooms": prop.bedrooms,
        "bathrooms": prop.bathrooms,
        "square_feet": prop.square_feet,
        "year_built": prop.year_built,
        "amenities": prop.amenities,
        "pets_allowed": prop.pets_allowed,
        "pet_deposit": prop.pet_deposit,
        "smoking_allowed": prop.smoking_allowed,
        "available_date": prop.available_date,
        "lease_term_months": prop.lease_term_months,
        "is_verified": prop.is_verified,
        "verified_at": prop.verified_at,
        "view_count": prop.view_count,
        "inquiry_count": prop.inquiry_count,
        "created_at": prop.created_at,
        "updated_at": prop.updated_at,
        "images": prop.images if prop.images else [],
        "location": None,
        "distance_miles": None,
    }

    # Parse location if available (WKB to lat/lon would need shapely in production)
    # For now, store as None - in production, you'd parse the geometry

    if distance_meters is not None:
        response_dict["distance_miles"] = round(distance_meters / METERS_PER_MILE, 2)

    return response_dict


@router.post("/", response_model=PropertyResponse, status_code=status.HTTP_201_CREATED)
async def create_property(
    property_in: PropertyCreate,
    current_user: LandlordUser,
    db: DbSession,
) -> dict:
    """
    Create a new property listing.

    Requires landlord or admin role.
    """
    # Generate slug
    slug = generate_slug(property_in.title)

    # Build location point if coordinates provided
    location = None
    if property_in.location:
        location = func.ST_SetSRID(
            func.ST_MakePoint(
                property_in.location.longitude,
                property_in.location.latitude
            ),
            4326
        )

    # Create property
    property_data = property_in.model_dump(exclude={"location", "images"})
    new_property = Property(
        **property_data,
        slug=slug,
        landlord_id=current_user.id,
        location=location,
    )

    db.add(new_property)

    try:
        await db.commit()
        await db.refresh(new_property)
    except IntegrityError:
        await db.rollback()
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Failed to create property",
        )

    # Add images if provided
    if property_in.images:
        for idx, img_data in enumerate(property_in.images):
            image = PropertyImage(
                property_id=new_property.id,
                url=img_data.url,
                thumbnail_url=img_data.thumbnail_url,
                caption=img_data.caption,
                is_primary=img_data.is_primary if idx > 0 else True,  # First image is primary
                order=img_data.order if img_data.order else idx,
            )
            db.add(image)

        await db.commit()
        await db.refresh(new_property)

    return property_to_response(new_property)


@router.get("/", response_model=PropertyListResponse)
async def list_properties(
    db: DbSession,
    # Pagination
    page: int = Query(1, ge=1),
    page_size: int = Query(20, ge=1, le=100),
    # Geo search
    latitude: Optional[float] = Query(None, ge=-90, le=90),
    longitude: Optional[float] = Query(None, ge=-180, le=180),
    radius_miles: Optional[float] = Query(None, ge=0.1, le=100),
    # Filters
    min_price: Optional[Decimal] = Query(None, ge=0),
    max_price: Optional[Decimal] = Query(None, ge=0),
    min_bedrooms: Optional[int] = Query(None, ge=0),
    max_bedrooms: Optional[int] = Query(None, ge=0),
    min_bathrooms: Optional[Decimal] = Query(None, ge=0),
    max_bathrooms: Optional[Decimal] = Query(None, ge=0),
    property_type: Optional[PropertyType] = None,
    neighborhood: Optional[str] = None,
    pets_allowed: Optional[bool] = None,
    # Sorting
    sort_by: str = Query("created_at", pattern=r"^(price|created_at|distance)$"),
    sort_order: str = Query("desc", pattern=r"^(asc|desc)$"),
) -> dict:
    """
    List and search properties with filters.

    Supports:
    - Geo-search within radius using PostGIS
    - Price, bedroom, bathroom filters
    - Property type and neighborhood filters
    - Sorting by price, date, or distance
    - Pagination
    """
    # Base query - only active properties
    query = select(Property).where(Property.status == PropertyStatus.ACTIVE)

    # Apply filters
    filters = []

    if min_price is not None:
        filters.append(Property.monthly_rent >= min_price)
    if max_price is not None:
        filters.append(Property.monthly_rent <= max_price)
    if min_bedrooms is not None:
        filters.append(Property.bedrooms >= min_bedrooms)
    if max_bedrooms is not None:
        filters.append(Property.bedrooms <= max_bedrooms)
    if min_bathrooms is not None:
        filters.append(Property.bathrooms >= min_bathrooms)
    if max_bathrooms is not None:
        filters.append(Property.bathrooms <= max_bathrooms)
    if property_type is not None:
        filters.append(Property.property_type == property_type)
    if neighborhood is not None:
        # Sanitize neighborhood search to prevent injection
        safe_neighborhood = sanitize_search_query(neighborhood, max_length=100)
        if safe_neighborhood:
            filters.append(Property.neighborhood.ilike(f"%{safe_neighborhood}%"))
    if pets_allowed is not None:
        filters.append(Property.pets_allowed == pets_allowed)

    if filters:
        query = query.where(and_(*filters))

    # Geo search with PostGIS
    distance_column = None
    if latitude is not None and longitude is not None:
        # Create point from search coordinates
        search_point = func.ST_SetSRID(
            func.ST_MakePoint(longitude, latitude),
            4326
        )

        # Calculate distance in meters
        distance_column = func.ST_Distance(
            func.ST_Transform(Property.location, 3857),  # Transform to meters-based CRS
            func.ST_Transform(search_point, 3857)
        ).label("distance")

        # Filter by radius if provided
        if radius_miles is not None:
            radius_meters = radius_miles * METERS_PER_MILE
            # Use ST_DWithin with geography for accurate distance
            query = query.where(
                func.ST_DWithin(
                    cast(Property.location, Geography),
                    cast(search_point, Geography),
                    radius_meters
                )
            )

        # Add distance to select
        query = query.add_columns(distance_column)

    # Count total before pagination
    count_query = select(func.count()).select_from(query.subquery())
    total_result = await db.execute(count_query)
    total = total_result.scalar() or 0

    # Apply sorting
    order_column: Any
    if sort_by == "price":
        order_column = Property.monthly_rent
    elif sort_by == "distance" and distance_column is not None:
        order_column = distance_column
    else:
        order_column = Property.created_at

    if sort_order == "asc":
        query = query.order_by(order_column.asc())
    else:
        query = query.order_by(order_column.desc())

    # Pagination
    offset = (page - 1) * page_size
    query = query.offset(offset).limit(page_size)

    # Load images
    query = query.options(selectinload(Property.images))

    # Execute query
    result = await db.execute(query)

    # Parse results
    items = []
    if distance_column is not None:
        for row in result:
            prop = row[0]
            distance = row[1] if len(row) > 1 else None
            items.append(property_to_response(prop, distance))
    else:
        for prop in result.scalars():
            items.append(property_to_response(prop))

    total_pages = math.ceil(total / page_size) if total > 0 else 1

    return {
        "items": items,
        "total": total,
        "page": page,
        "page_size": page_size,
        "pages": total_pages,
    }


@router.get("/my-listings", response_model=PropertyListResponse)
async def get_my_listings(
    current_user: LandlordUser,
    db: DbSession,
    page: int = Query(1, ge=1),
    page_size: int = Query(20, ge=1, le=100),
    status: Optional[PropertyStatus] = None,
) -> dict:
    """
    Get current landlord's property listings.
    """
    query = select(Property).where(Property.landlord_id == current_user.id)

    if status is not None:
        query = query.where(Property.status == status)

    # Count total
    count_query = select(func.count()).select_from(query.subquery())
    total_result = await db.execute(count_query)
    total = total_result.scalar() or 0

    # Pagination and ordering
    offset = (page - 1) * page_size
    query = (
        query
        .order_by(Property.created_at.desc())
        .offset(offset)
        .limit(page_size)
        .options(selectinload(Property.images))
    )

    result = await db.execute(query)
    items = [property_to_response(prop) for prop in result.scalars()]

    total_pages = math.ceil(total / page_size) if total > 0 else 1

    return {
        "items": items,
        "total": total,
        "page": page,
        "page_size": page_size,
        "pages": total_pages,
    }


@router.get("/{property_id}", response_model=PropertyResponse)
async def get_property(
    property_id: uuid.UUID,
    db: DbSession,
) -> dict:
    """
    Get a single property by ID.

    Increments view count for active properties.
    """
    result = await db.execute(
        select(Property)
        .where(Property.id == property_id)
        .options(selectinload(Property.images))
    )
    prop = result.scalar_one_or_none()

    if not prop:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Property not found",
        )

    # Only show non-active properties to the owner or admin
    if prop.status != PropertyStatus.ACTIVE:
        # This would need current_user, but we allow public viewing
        # In production, you'd check ownership here
        pass

    if prop.status == PropertyStatus.ACTIVE:
        await db.execute(
            update(Property)
            .where(Property.id == property_id)
            .values(view_count=Property.view_count + 1)
        )
        await db.commit()
        await db.refresh(prop)

    return property_to_response(prop)


@router.get("/slug/{slug}", response_model=PropertyResponse)
async def get_property_by_slug(
    db: DbSession,
    slug: str = Path(..., min_length=1, max_length=300, pattern=r"^[a-z0-9\-]+$"),
) -> dict:
    """
    Get a single property by slug.

    The slug must be lowercase alphanumeric characters and hyphens only.
    """
    result = await db.execute(
        select(Property)
        .where(Property.slug == slug)
        .options(selectinload(Property.images))
    )
    prop = result.scalar_one_or_none()

    if not prop:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Property not found",
        )

    if prop.status == PropertyStatus.ACTIVE:
        await db.execute(
            update(Property)
            .where(Property.id == prop.id)
            .values(view_count=Property.view_count + 1)
        )
        await db.commit()
        await db.refresh(prop)

    return property_to_response(prop)


@router.put("/{property_id}", response_model=PropertyResponse)
@router.patch("/{property_id}", response_model=PropertyResponse)
async def update_property(
    property_id: uuid.UUID,
    property_update: PropertyUpdate,
    current_user: LandlordUser,
    db: DbSession,
) -> dict:
    """
    Update a property listing.

    Only the property owner or an admin can update.
    """
    result = await db.execute(
        select(Property)
        .where(Property.id == property_id)
        .options(selectinload(Property.images))
    )
    prop = result.scalar_one_or_none()

    if not prop:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Property not found",
        )

    # Check ownership
    if prop.landlord_id != current_user.id and current_user.role != UserRole.ADMIN:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to update this property",
        )

    # Update fields
    update_data = property_update.model_dump(exclude_unset=True, exclude={"location"})

    for field, value in update_data.items():
        setattr(prop, field, value)

    # Update location if provided
    if property_update.location is not None:
        prop.location = func.ST_SetSRID(
            func.ST_MakePoint(
                property_update.location.longitude,
                property_update.location.latitude
            ),
            4326
        )

    await db.commit()
    await db.refresh(prop)

    return property_to_response(prop)


@router.delete("/{property_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_property(
    property_id: uuid.UUID,
    current_user: LandlordUser,
    db: DbSession,
) -> None:
    """
    Delete a property listing.

    Only the property owner or an admin can delete.
    """
    result = await db.execute(
        select(Property).where(Property.id == property_id)
    )
    prop = result.scalar_one_or_none()

    if not prop:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Property not found",
        )

    # Check ownership
    if prop.landlord_id != current_user.id and current_user.role != UserRole.ADMIN:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to delete this property",
        )

    await db.delete(prop)
    await db.commit()


@router.post("/{property_id}/publish", response_model=PropertyResponse)
async def publish_property(
    property_id: uuid.UUID,
    current_user: LandlordUser,
    db: DbSession,
) -> dict:
    """
    Publish a draft property (set status to pending_review or active).
    """
    result = await db.execute(
        select(Property)
        .where(Property.id == property_id)
        .options(selectinload(Property.images))
    )
    prop = result.scalar_one_or_none()

    if not prop:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Property not found",
        )

    if prop.landlord_id != current_user.id and current_user.role != UserRole.ADMIN:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to publish this property",
        )

    if prop.status != PropertyStatus.DRAFT:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Only draft properties can be published",
        )

    # Verified landlords go directly to active, others need review
    if current_user.is_landlord_verified or current_user.role == UserRole.ADMIN:
        prop.status = PropertyStatus.ACTIVE
    else:
        prop.status = PropertyStatus.PENDING_REVIEW

    await db.commit()
    await db.refresh(prop)

    return property_to_response(prop)


# Image management
@router.post("/{property_id}/images", response_model=PropertyImageResponse, status_code=status.HTTP_201_CREATED)
async def add_property_image(
    property_id: uuid.UUID,
    image_data: PropertyImageCreate,
    current_user: LandlordUser,
    db: DbSession,
) -> PropertyImage:
    """
    Add an image to a property.
    """
    result = await db.execute(
        select(Property).where(Property.id == property_id)
    )
    prop = result.scalar_one_or_none()

    if not prop:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Property not found",
        )

    if prop.landlord_id != current_user.id and current_user.role != UserRole.ADMIN:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to add images to this property",
        )

    image = PropertyImage(
        property_id=property_id,
        url=image_data.url,
        thumbnail_url=image_data.thumbnail_url,
        caption=image_data.caption,
        is_primary=image_data.is_primary,
        order=image_data.order,
    )

    db.add(image)
    await db.commit()
    await db.refresh(image)

    return image


@router.delete("/{property_id}/images/{image_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_property_image(
    property_id: uuid.UUID,
    image_id: uuid.UUID,
    current_user: LandlordUser,
    db: DbSession,
) -> None:
    """
    Delete an image from a property.
    """
    result = await db.execute(
        select(Property).where(Property.id == property_id)
    )
    prop = result.scalar_one_or_none()

    if not prop:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Property not found",
        )

    if prop.landlord_id != current_user.id and current_user.role != UserRole.ADMIN:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to delete images from this property",
        )

    result = await db.execute(
        select(PropertyImage).where(
            and_(
                PropertyImage.id == image_id,
                PropertyImage.property_id == property_id
            )
        )
    )
    image = result.scalar_one_or_none()

    if not image:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Image not found",
        )

    await db.delete(image)
    await db.commit()


# Admin routes
@router.post("/{property_id}/verify", response_model=PropertyResponse)
async def verify_property(
    property_id: uuid.UUID,
    admin_user: AdminUser,
    db: DbSession,
) -> dict:
    """
    Verify a property listing (admin only).
    """
    result = await db.execute(
        select(Property)
        .where(Property.id == property_id)
        .options(selectinload(Property.images))
    )
    prop = result.scalar_one_or_none()

    if not prop:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Property not found",
        )

    prop.is_verified = True
    prop.verified_at = datetime.now(timezone.utc)

    await db.commit()
    await db.refresh(prop)

    return property_to_response(prop)


@router.post("/{property_id}/approve", response_model=PropertyResponse)
async def approve_property(
    property_id: uuid.UUID,
    admin_user: AdminUser,
    db: DbSession,
) -> dict:
    """
    Approve a pending property (set to active) - admin only.
    """
    result = await db.execute(
        select(Property)
        .where(Property.id == property_id)
        .options(selectinload(Property.images))
    )
    prop = result.scalar_one_or_none()

    if not prop:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Property not found",
        )

    if prop.status != PropertyStatus.PENDING_REVIEW:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Only pending properties can be approved",
        )

    prop.status = PropertyStatus.ACTIVE
    prop.is_verified = True
    prop.verified_at = datetime.now(timezone.utc)

    await db.commit()
    await db.refresh(prop)

    return property_to_response(prop)
