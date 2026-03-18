"""Rental application routes for applicants and landlords."""
import math
import uuid
from datetime import datetime, timezone
from typing import Optional, List

from fastapi import APIRouter, HTTPException, status, Query
from sqlalchemy import select, func, and_, or_
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import selectinload

from app.api.deps import DbSession, CurrentUser, LandlordUser
from app.models.application import RentalApplication, ApplicationStatus
from app.models.property import Property, PropertyStatus
from app.models.user import User, UserRole
from app.schemas.application import (
    ApplicationCreate,
    ApplicationUpdate,
    ApplicationStatusUpdate,
    ApplicationResponse,
    ApplicationListResponse,
)

router = APIRouter()


@router.get("/", response_model=ApplicationListResponse)
async def list_applications(
    current_user: CurrentUser,
    db: DbSession,
    page: int = Query(1, ge=1),
    page_size: int = Query(20, ge=1, le=100),
    status_filter: Optional[ApplicationStatus] = Query(None, alias="status"),
    property_id: Optional[uuid.UUID] = None,
) -> dict:
    """
    List applications based on user role.

    - Renters see their own submitted applications
    - Landlords see applications received for their properties
    - Admins see all applications
    """
    if current_user.role == UserRole.ADMIN:
        # Admins see all applications
        query = select(RentalApplication)
    elif current_user.role == UserRole.LANDLORD:
        # Landlords see applications to their properties
        prop_query = select(Property.id).where(Property.landlord_id == current_user.id)
        query = select(RentalApplication).where(
            RentalApplication.property_id.in_(prop_query)
        )
    else:
        # Renters see their own applications
        query = select(RentalApplication).where(
            RentalApplication.applicant_id == current_user.id
        )

    if status_filter is not None:
        query = query.where(RentalApplication.status == status_filter)

    if property_id is not None:
        query = query.where(RentalApplication.property_id == property_id)

    # Count total
    count_query = select(func.count()).select_from(query.subquery())
    total_result = await db.execute(count_query)
    total = total_result.scalar() or 0

    # Pagination and ordering
    offset = (page - 1) * page_size
    query = (
        query
        .order_by(RentalApplication.created_at.desc())
        .offset(offset)
        .limit(page_size)
    )

    result = await db.execute(query)
    items = list(result.scalars().all())

    total_pages = math.ceil(total / page_size) if total > 0 else 1

    return {
        "items": items,
        "total": total,
        "page": page,
        "page_size": page_size,
        "pages": total_pages,
    }


@router.post("/", response_model=ApplicationResponse, status_code=status.HTTP_201_CREATED)
async def create_application(
    application_in: ApplicationCreate,
    current_user: CurrentUser,
    db: DbSession,
) -> RentalApplication:
    """
    Submit a rental application for a property.

    - Applicant cannot apply to their own property
    - Cannot apply to inactive properties
    - Cannot apply twice to the same property
    """
    # Check property exists and is active
    result = await db.execute(
        select(Property).where(Property.id == application_in.property_id)
    )
    prop = result.scalar_one_or_none()

    if not prop:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Property not found",
        )

    if prop.status != PropertyStatus.ACTIVE:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Cannot apply to inactive property",
        )

    # Prevent self-application
    if prop.landlord_id == current_user.id:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Cannot apply to your own property",
        )

    # Check for existing application
    existing = await db.execute(
        select(RentalApplication).where(
            and_(
                RentalApplication.property_id == application_in.property_id,
                RentalApplication.applicant_id == current_user.id,
                RentalApplication.status.not_in([
                    ApplicationStatus.WITHDRAWN,
                    ApplicationStatus.DENIED
                ])
            )
        )
    )
    if existing.scalar_one_or_none():
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="You already have an active application for this property",
        )

    # Create application
    application_data = application_in.model_dump()

    # Convert references and documents to JSON-compatible format
    if application_data.get("references"):
        application_data["references"] = [
            ref.model_dump() if hasattr(ref, "model_dump") else ref
            for ref in application_data["references"]
        ]
    if application_data.get("documents"):
        application_data["documents"] = [
            doc.model_dump() if hasattr(doc, "model_dump") else doc
            for doc in application_data["documents"]
        ]

    application = RentalApplication(
        **application_data,
        applicant_id=current_user.id,
    )

    db.add(application)

    # Increment property inquiry count
    prop.inquiry_count += 1

    try:
        await db.commit()
        await db.refresh(application)
    except IntegrityError:
        await db.rollback()
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Failed to create application",
        )

    return application


@router.get("/my-applications", response_model=ApplicationListResponse)
async def get_my_applications(
    current_user: CurrentUser,
    db: DbSession,
    page: int = Query(1, ge=1),
    page_size: int = Query(20, ge=1, le=100),
    status_filter: Optional[ApplicationStatus] = Query(None, alias="status"),
) -> dict:
    """
    Get current user's submitted applications.
    """
    query = select(RentalApplication).where(
        RentalApplication.applicant_id == current_user.id
    )

    if status_filter is not None:
        query = query.where(RentalApplication.status == status_filter)

    # Count total
    count_query = select(func.count()).select_from(query.subquery())
    total_result = await db.execute(count_query)
    total = total_result.scalar() or 0

    # Pagination and ordering
    offset = (page - 1) * page_size
    query = (
        query
        .order_by(RentalApplication.created_at.desc())
        .offset(offset)
        .limit(page_size)
    )

    result = await db.execute(query)
    items = list(result.scalars().all())

    total_pages = math.ceil(total / page_size) if total > 0 else 1

    return {
        "items": items,
        "total": total,
        "page": page,
        "page_size": page_size,
        "pages": total_pages,
    }


@router.get("/received", response_model=ApplicationListResponse)
async def get_received_applications(
    current_user: LandlordUser,
    db: DbSession,
    page: int = Query(1, ge=1),
    page_size: int = Query(20, ge=1, le=100),
    status_filter: Optional[ApplicationStatus] = Query(None, alias="status"),
    property_id: Optional[uuid.UUID] = None,
) -> dict:
    """
    Get applications received for landlord's properties.
    """
    # Get landlord's property IDs
    prop_query = select(Property.id).where(Property.landlord_id == current_user.id)

    query = select(RentalApplication).where(
        RentalApplication.property_id.in_(prop_query)
    )

    if status_filter is not None:
        query = query.where(RentalApplication.status == status_filter)

    if property_id is not None:
        query = query.where(RentalApplication.property_id == property_id)

    # Count total
    count_query = select(func.count()).select_from(query.subquery())
    total_result = await db.execute(count_query)
    total = total_result.scalar() or 0

    # Pagination and ordering
    offset = (page - 1) * page_size
    query = (
        query
        .order_by(RentalApplication.created_at.desc())
        .offset(offset)
        .limit(page_size)
    )

    result = await db.execute(query)
    items = list(result.scalars().all())

    total_pages = math.ceil(total / page_size) if total > 0 else 1

    return {
        "items": items,
        "total": total,
        "page": page,
        "page_size": page_size,
        "pages": total_pages,
    }


@router.get("/{application_id}", response_model=ApplicationResponse)
async def get_application(
    application_id: uuid.UUID,
    current_user: CurrentUser,
    db: DbSession,
) -> RentalApplication:
    """
    Get a single application by ID.

    Accessible by the applicant or the property owner.
    """
    result = await db.execute(
        select(RentalApplication).where(RentalApplication.id == application_id)
    )
    application = result.scalar_one_or_none()

    if not application:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Application not found",
        )

    # Check authorization
    is_applicant = application.applicant_id == current_user.id
    is_admin = current_user.role == UserRole.ADMIN

    # Check if current user is the property owner
    is_owner = False
    if not is_applicant and not is_admin:
        prop_result = await db.execute(
            select(Property).where(Property.id == application.property_id)
        )
        prop = prop_result.scalar_one_or_none()
        if prop and prop.landlord_id == current_user.id:
            is_owner = True

    if not (is_applicant or is_owner or is_admin):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to view this application",
        )

    return application


@router.patch("/{application_id}", response_model=ApplicationResponse)
async def update_application(
    application_id: uuid.UUID,
    application_update: ApplicationUpdate,
    current_user: CurrentUser,
    db: DbSession,
) -> RentalApplication:
    """
    Update an application (by the applicant only).

    Can only update pending or under_review applications.
    """
    result = await db.execute(
        select(RentalApplication).where(RentalApplication.id == application_id)
    )
    application = result.scalar_one_or_none()

    if not application:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Application not found",
        )

    # Only applicant can update their application
    if application.applicant_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to update this application",
        )

    # Can only update if pending or under review
    if application.status not in (ApplicationStatus.PENDING, ApplicationStatus.UNDER_REVIEW):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Cannot update application in current status",
        )

    # Update fields
    update_data = application_update.model_dump(exclude_unset=True)

    # Handle references and documents
    if "references" in update_data and update_data["references"]:
        update_data["references"] = [
            ref.model_dump() if hasattr(ref, "model_dump") else ref
            for ref in update_data["references"]
        ]
    if "documents" in update_data and update_data["documents"]:
        update_data["documents"] = [
            doc.model_dump() if hasattr(doc, "model_dump") else doc
            for doc in update_data["documents"]
        ]

    for field, value in update_data.items():
        setattr(application, field, value)

    await db.commit()
    await db.refresh(application)

    return application


@router.put("/{application_id}/status", response_model=ApplicationResponse)
@router.post("/{application_id}/status", response_model=ApplicationResponse)
async def update_application_status(
    application_id: uuid.UUID,
    status_update: ApplicationStatusUpdate,
    current_user: LandlordUser,
    db: DbSession,
) -> RentalApplication:
    """
    Update application status (by landlord).

    Landlord can:
    - Move to under_review
    - Approve or deny the application
    """
    result = await db.execute(
        select(RentalApplication).where(RentalApplication.id == application_id)
    )
    application = result.scalar_one_or_none()

    if not application:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Application not found",
        )

    # Check if current user owns the property
    prop_result = await db.execute(
        select(Property).where(Property.id == application.property_id)
    )
    prop = prop_result.scalar_one_or_none()

    if not prop:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Property not found",
        )

    if prop.landlord_id != current_user.id and current_user.role != UserRole.ADMIN:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to update this application",
        )

    # Validate status transition
    valid_transitions = {
        ApplicationStatus.PENDING: [ApplicationStatus.UNDER_REVIEW, ApplicationStatus.APPROVED, ApplicationStatus.DENIED],
        ApplicationStatus.UNDER_REVIEW: [ApplicationStatus.APPROVED, ApplicationStatus.DENIED],
    }

    current_status = application.status
    new_status = status_update.status

    if current_status not in valid_transitions:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Cannot change status from {current_status.value}",
        )

    if new_status not in valid_transitions[current_status]:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Invalid status transition from {current_status.value} to {new_status.value}",
        )

    # Update status
    application.status = new_status
    application.landlord_notes = status_update.landlord_notes
    application.reviewed_at = datetime.now(timezone.utc)

    # If approved, mark property as rented
    if new_status == ApplicationStatus.APPROVED:
        prop.status = PropertyStatus.RENTED
        # Optionally deny other pending applications
        await db.execute(
            select(RentalApplication)
            .where(
                and_(
                    RentalApplication.property_id == application.property_id,
                    RentalApplication.id != application_id,
                    RentalApplication.status.in_([
                        ApplicationStatus.PENDING,
                        ApplicationStatus.UNDER_REVIEW
                    ])
                )
            )
        )
    await db.commit()
    await db.refresh(application)

    return application


@router.post("/{application_id}/withdraw", response_model=ApplicationResponse)
async def withdraw_application(
    application_id: uuid.UUID,
    current_user: CurrentUser,
    db: DbSession,
) -> RentalApplication:
    """
    Withdraw an application (by the applicant).
    """
    result = await db.execute(
        select(RentalApplication).where(RentalApplication.id == application_id)
    )
    application = result.scalar_one_or_none()

    if not application:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Application not found",
        )

    if application.applicant_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to withdraw this application",
        )

    # Can only withdraw pending or under_review applications
    if application.status not in (ApplicationStatus.PENDING, ApplicationStatus.UNDER_REVIEW):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Cannot withdraw application in current status",
        )

    application.status = ApplicationStatus.WITHDRAWN
    await db.commit()
    await db.refresh(application)

    return application


@router.delete("/{application_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_application(
    application_id: uuid.UUID,
    current_user: CurrentUser,
    db: DbSession,
) -> None:
    """
    Delete an application (by the applicant, only if withdrawn).
    """
    result = await db.execute(
        select(RentalApplication).where(RentalApplication.id == application_id)
    )
    application = result.scalar_one_or_none()

    if not application:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Application not found",
        )

    if application.applicant_id != current_user.id and current_user.role != UserRole.ADMIN:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to delete this application",
        )

    # Applicants can only delete withdrawn applications
    if current_user.role != UserRole.ADMIN and application.status != ApplicationStatus.WITHDRAWN:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Can only delete withdrawn applications",
        )

    await db.delete(application)
    await db.commit()


# Property-specific application listing (for property detail page)
@router.get("/property/{property_id}", response_model=ApplicationListResponse)
async def get_property_applications(
    property_id: uuid.UUID,
    current_user: LandlordUser,
    db: DbSession,
    page: int = Query(1, ge=1),
    page_size: int = Query(20, ge=1, le=100),
    status_filter: Optional[ApplicationStatus] = Query(None, alias="status"),
) -> dict:
    """
    Get all applications for a specific property (landlord only).
    """
    # Verify property ownership
    prop_result = await db.execute(
        select(Property).where(Property.id == property_id)
    )
    prop = prop_result.scalar_one_or_none()

    if not prop:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Property not found",
        )

    if prop.landlord_id != current_user.id and current_user.role != UserRole.ADMIN:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to view applications for this property",
        )

    query = select(RentalApplication).where(
        RentalApplication.property_id == property_id
    )

    if status_filter is not None:
        query = query.where(RentalApplication.status == status_filter)

    # Count total
    count_query = select(func.count()).select_from(query.subquery())
    total_result = await db.execute(count_query)
    total = total_result.scalar() or 0

    # Pagination and ordering
    offset = (page - 1) * page_size
    query = (
        query
        .order_by(RentalApplication.created_at.desc())
        .offset(offset)
        .limit(page_size)
    )

    result = await db.execute(query)
    items = list(result.scalars().all())

    total_pages = math.ceil(total / page_size) if total > 0 else 1

    return {
        "items": items,
        "total": total,
        "page": page,
        "page_size": page_size,
        "pages": total_pages,
    }
