"""User management routes."""
import uuid
from typing import List

from fastapi import APIRouter, HTTPException, status, Query
from passlib.context import CryptContext
from sqlalchemy import select, func
from sqlalchemy.exc import IntegrityError

from app.api.deps import DbSession, CurrentUser, AdminUser
from app.models.user import User, UserRole
from app.schemas.user import (
    UserResponse,
    UserUpdate,
    UserPasswordUpdate,
    UserPublicResponse,
)

router = APIRouter()

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Verify a password against its hash."""
    return pwd_context.verify(plain_password, hashed_password)


def get_password_hash(password: str) -> str:
    """Hash a password."""
    return pwd_context.hash(password)


@router.get("/me", response_model=UserResponse)
async def get_my_profile(
    current_user: CurrentUser,
) -> User:
    """
    Get current user's full profile.
    """
    return current_user


@router.put("/me", response_model=UserResponse)
@router.patch("/me", response_model=UserResponse)
async def update_my_profile(
    user_update: UserUpdate,
    current_user: CurrentUser,
    db: DbSession,
) -> User:
    """
    Update current user's profile.

    All fields are optional - only provided fields will be updated.
    """
    update_data = user_update.model_dump(exclude_unset=True)

    for field, value in update_data.items():
        setattr(current_user, field, value)

    try:
        await db.commit()
        await db.refresh(current_user)
    except IntegrityError:
        await db.rollback()
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Update failed due to constraint violation",
        )

    return current_user


@router.post("/me/password", status_code=status.HTTP_204_NO_CONTENT)
async def change_password(
    password_update: UserPasswordUpdate,
    current_user: CurrentUser,
    db: DbSession,
) -> None:
    """
    Change current user's password.

    Requires current password for verification.
    """
    if not verify_password(password_update.current_password, current_user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect current password",
        )

    current_user.hashed_password = get_password_hash(password_update.new_password)
    await db.commit()


@router.get("/{user_id}", response_model=UserPublicResponse)
async def get_user_public_profile(
    user_id: uuid.UUID,
    db: DbSession,
) -> User:
    """
    Get a user's public profile.

    Returns limited information suitable for public display.
    """
    result = await db.execute(
        select(User).where(User.id == user_id)
    )
    user = result.scalar_one_or_none()

    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found",
        )

    if not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found",
        )

    return user


# Admin routes
@router.get("/", response_model=List[UserResponse])
async def list_users(
    admin_user: AdminUser,
    db: DbSession,
    skip: int = Query(0, ge=0),
    limit: int = Query(20, ge=1, le=100),
    role: UserRole | None = None,
    is_active: bool | None = None,
) -> List[User]:
    """
    List all users (admin only).

    Supports filtering by role and active status.
    """
    query = select(User)

    if role is not None:
        query = query.where(User.role == role)

    if is_active is not None:
        query = query.where(User.is_active == is_active)

    query = query.order_by(User.created_at.desc()).offset(skip).limit(limit)

    result = await db.execute(query)
    users = result.scalars().all()

    return list(users)


@router.get("/{user_id}/admin", response_model=UserResponse)
async def get_user_admin(
    user_id: uuid.UUID,
    admin_user: AdminUser,
    db: DbSession,
) -> User:
    """
    Get full user details (admin only).
    """
    result = await db.execute(
        select(User).where(User.id == user_id)
    )
    user = result.scalar_one_or_none()

    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found",
        )

    return user


@router.patch("/{user_id}/admin", response_model=UserResponse)
async def update_user_admin(
    user_id: uuid.UUID,
    user_update: UserUpdate,
    admin_user: AdminUser,
    db: DbSession,
) -> User:
    """
    Update any user's profile (admin only).
    """
    result = await db.execute(
        select(User).where(User.id == user_id)
    )
    user = result.scalar_one_or_none()

    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found",
        )

    update_data = user_update.model_dump(exclude_unset=True)

    for field, value in update_data.items():
        setattr(user, field, value)

    await db.commit()
    await db.refresh(user)

    return user


@router.post("/{user_id}/deactivate", response_model=UserResponse)
async def deactivate_user(
    user_id: uuid.UUID,
    admin_user: AdminUser,
    db: DbSession,
) -> User:
    """
    Deactivate a user account (admin only).
    """
    result = await db.execute(
        select(User).where(User.id == user_id)
    )
    user = result.scalar_one_or_none()

    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found",
        )

    if user.id == admin_user.id:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Cannot deactivate your own account",
        )

    user.is_active = False
    await db.commit()
    await db.refresh(user)

    return user


@router.post("/{user_id}/activate", response_model=UserResponse)
async def activate_user(
    user_id: uuid.UUID,
    admin_user: AdminUser,
    db: DbSession,
) -> User:
    """
    Activate a user account (admin only).
    """
    result = await db.execute(
        select(User).where(User.id == user_id)
    )
    user = result.scalar_one_or_none()

    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found",
        )

    user.is_active = True
    await db.commit()
    await db.refresh(user)

    return user


@router.post("/{user_id}/verify-landlord", response_model=UserResponse)
async def verify_landlord(
    user_id: uuid.UUID,
    admin_user: AdminUser,
    db: DbSession,
) -> User:
    """
    Mark a landlord as verified (admin only).

    This is a key anti-fraud feature.
    """
    result = await db.execute(
        select(User).where(User.id == user_id)
    )
    user = result.scalar_one_or_none()

    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found",
        )

    if user.role != UserRole.LANDLORD:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="User is not a landlord",
        )

    user.is_landlord_verified = True
    await db.commit()
    await db.refresh(user)

    return user
