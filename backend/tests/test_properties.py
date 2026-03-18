"""Tests for property listing endpoints."""

import pytest
from httpx import AsyncClient

from app.models.user import User
from app.models.property import Property
from tests.conftest import auth_header


@pytest.mark.asyncio
async def test_list_properties_empty(client: AsyncClient):
    resp = await client.get("/api/v1/properties/")
    assert resp.status_code == 200
    data = resp.json()
    assert data["items"] == []
    assert data["total"] == 0


@pytest.mark.asyncio
async def test_list_properties_with_data(client: AsyncClient, sample_property: Property):
    resp = await client.get("/api/v1/properties/")
    assert resp.status_code == 200
    data = resp.json()
    assert data["total"] == 1
    assert data["items"][0]["title"] == "Test Downtown Apartment"


@pytest.mark.asyncio
async def test_get_property_by_id(client: AsyncClient, sample_property: Property):
    resp = await client.get(f"/api/v1/properties/{sample_property.id}")
    assert resp.status_code == 200
    data = resp.json()
    assert data["title"] == "Test Downtown Apartment"
    assert data["neighborhood"] == "Downtown"


@pytest.mark.asyncio
async def test_get_property_not_found(client: AsyncClient):
    import uuid
    fake_id = uuid.uuid4()
    resp = await client.get(f"/api/v1/properties/{fake_id}")
    assert resp.status_code == 404


@pytest.mark.asyncio
async def test_filter_by_min_price(client: AsyncClient, sample_property: Property):
    resp = await client.get("/api/v1/properties/", params={"min_price": 3000})
    assert resp.status_code == 200
    assert resp.json()["total"] == 0

    resp = await client.get("/api/v1/properties/", params={"min_price": 1000})
    assert resp.status_code == 200
    assert resp.json()["total"] == 1


@pytest.mark.asyncio
async def test_filter_by_bedrooms(client: AsyncClient, sample_property: Property):
    resp = await client.get("/api/v1/properties/", params={"min_bedrooms": 3})
    assert resp.status_code == 200
    assert resp.json()["total"] == 0

    resp = await client.get("/api/v1/properties/", params={"min_bedrooms": 2})
    assert resp.status_code == 200
    assert resp.json()["total"] == 1


@pytest.mark.asyncio
async def test_create_property_as_landlord(client: AsyncClient, landlord: User):
    resp = await client.post("/api/v1/properties/", json={
        "title": "New Listing",
        "description": "A brand new property listing for testing.",
        "property_type": "apartment",
        "address": "456 Oak Ave",
        "city": "Springfield",
        "state": "IL",
        "zip_code": "62702",
        "neighborhood": "Midtown",
        "monthly_rent": 1800,
        "bedrooms": 1,
        "bathrooms": 1,
    }, headers=auth_header(landlord))
    assert resp.status_code == 201
    data = resp.json()
    assert data["title"] == "New Listing"
    assert data["status"] == "draft"


@pytest.mark.asyncio
async def test_create_property_as_renter_forbidden(client: AsyncClient, renter: User):
    resp = await client.post("/api/v1/properties/", json={
        "title": "Renter Listing",
        "description": "Should not work.",
        "property_type": "apartment",
        "address": "789 Elm St",
        "city": "Springfield",
        "state": "IL",
        "zip_code": "62703",
        "monthly_rent": 1500,
        "bedrooms": 1,
        "bathrooms": 1,
    }, headers=auth_header(renter))
    assert resp.status_code == 403


@pytest.mark.asyncio
async def test_create_property_unauthenticated(client: AsyncClient):
    resp = await client.post("/api/v1/properties/", json={
        "title": "Anon Listing",
        "description": "Should not work.",
        "property_type": "apartment",
        "address": "000 Nowhere",
        "city": "Springfield",
        "state": "IL",
        "zip_code": "62700",
        "monthly_rent": 1000,
        "bedrooms": 1,
        "bathrooms": 1,
    })
    assert resp.status_code == 401
