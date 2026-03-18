import uuid
from typing import Optional

import cloudinary
import cloudinary.uploader
from fastapi import UploadFile, HTTPException

from app.core.config import settings


class MediaService:
    """Service for handling media uploads to Cloudinary."""

    def __init__(self):
        # Configure Cloudinary
        cloudinary.config(
            cloud_name=settings.CLOUDINARY_CLOUD_NAME,
            api_key=settings.CLOUDINARY_API_KEY,
            api_secret=settings.CLOUDINARY_API_SECRET,
            secure=True,
        )

    async def upload_property_image(
        self,
        file: UploadFile,
        property_id: uuid.UUID,
    ) -> dict:
        """
        Upload a property image to Cloudinary.
        Returns dict with url and thumbnail_url.
        """
        # Validate file type
        allowed_types = ["image/jpeg", "image/png", "image/webp"]
        if file.content_type not in allowed_types:
            raise HTTPException(
                status_code=400,
                detail=f"File type {file.content_type} not allowed. Use JPEG, PNG, or WebP.",
            )

        # Validate file size (max 10MB)
        max_size = 10 * 1024 * 1024  # 10MB
        contents = await file.read()
        if len(contents) > max_size:
            raise HTTPException(
                status_code=400,
                detail="File size exceeds 10MB limit.",
            )

        try:
            # Upload to Cloudinary with transformations
            result = cloudinary.uploader.upload(
                contents,
                folder=f"miami-rentals/properties/{property_id}",
                public_id=str(uuid.uuid4()),
                resource_type="image",
                transformation=[
                    {"width": 1920, "height": 1080, "crop": "limit"},
                    {"quality": "auto:good"},
                    {"format": "webp"},
                ],
            )

            # Generate thumbnail URL
            thumbnail_url = cloudinary.CloudinaryImage(result["public_id"]).build_url(
                transformation=[
                    {"width": 400, "height": 300, "crop": "fill"},
                    {"quality": "auto:good"},
                    {"format": "webp"},
                ]
            )

            return {
                "url": result["secure_url"],
                "thumbnail_url": thumbnail_url,
                "public_id": result["public_id"],
                "width": result.get("width"),
                "height": result.get("height"),
            }

        except Exception as e:
            raise HTTPException(
                status_code=500,
                detail=f"Failed to upload image: {str(e)}",
            )

    async def upload_avatar(
        self,
        file: UploadFile,
        user_id: uuid.UUID,
    ) -> str:
        """Upload a user avatar. Returns the URL."""
        allowed_types = ["image/jpeg", "image/png", "image/webp"]
        if file.content_type not in allowed_types:
            raise HTTPException(
                status_code=400,
                detail=f"File type {file.content_type} not allowed.",
            )

        contents = await file.read()
        max_size = 5 * 1024 * 1024  # 5MB
        if len(contents) > max_size:
            raise HTTPException(
                status_code=400,
                detail="File size exceeds 5MB limit.",
            )

        try:
            result = cloudinary.uploader.upload(
                contents,
                folder="miami-rentals/avatars",
                public_id=str(user_id),
                resource_type="image",
                overwrite=True,
                transformation=[
                    {"width": 400, "height": 400, "crop": "fill", "gravity": "face"},
                    {"quality": "auto:good"},
                    {"format": "webp"},
                ],
            )
            return result["secure_url"]

        except Exception as e:
            raise HTTPException(
                status_code=500,
                detail=f"Failed to upload avatar: {str(e)}",
            )

    async def upload_document(
        self,
        file: UploadFile,
        user_id: uuid.UUID,
        doc_type: str,
    ) -> dict:
        """
        Upload a verification document (PDF, image).
        Returns dict with url and metadata.
        """
        allowed_types = [
            "image/jpeg", "image/png", "image/webp",
            "application/pdf",
        ]
        if file.content_type not in allowed_types:
            raise HTTPException(
                status_code=400,
                detail="Only images and PDFs are allowed for documents.",
            )

        contents = await file.read()
        max_size = 20 * 1024 * 1024  # 20MB for documents
        if len(contents) > max_size:
            raise HTTPException(
                status_code=400,
                detail="File size exceeds 20MB limit.",
            )

        try:
            resource_type = "raw" if file.content_type == "application/pdf" else "image"

            result = cloudinary.uploader.upload(
                contents,
                folder=f"miami-rentals/documents/{user_id}",
                public_id=f"{doc_type}_{uuid.uuid4()}",
                resource_type=resource_type,
            )

            return {
                "url": result["secure_url"],
                "public_id": result["public_id"],
                "type": doc_type,
                "original_filename": file.filename,
            }

        except Exception as e:
            raise HTTPException(
                status_code=500,
                detail=f"Failed to upload document: {str(e)}",
            )

    async def delete_image(self, public_id: str) -> bool:
        """Delete an image from Cloudinary."""
        try:
            result = cloudinary.uploader.destroy(public_id)
            return result.get("result") == "ok"
        except Exception:
            return False
