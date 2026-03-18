"""API module for Open Rentals platform."""
from fastapi import APIRouter

from app.api.routes import auth, users, properties, applications

api_router = APIRouter()

api_router.include_router(auth.router, prefix="/auth", tags=["auth"])
api_router.include_router(users.router, prefix="/users", tags=["users"])
api_router.include_router(properties.router, prefix="/properties", tags=["properties"])
api_router.include_router(applications.router, prefix="/applications", tags=["applications"])
