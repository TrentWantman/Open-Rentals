"""Tests for authentication endpoints."""

import pytest
from httpx import AsyncClient

from tests.conftest import auth_header


@pytest.mark.asyncio
async def test_register_renter(client: AsyncClient):
    resp = await client.post("/api/v1/auth/register", json={
        "email": "newuser@test.com",
        "password": "SecurePass123",
        "first_name": "New",
        "last_name": "User",
        "role": "renter",
    })
    assert resp.status_code == 201
    data = resp.json()
    assert data["email"] == "newuser@test.com"
    assert data["first_name"] == "New"
    assert "hashed_password" not in data


@pytest.mark.asyncio
async def test_register_duplicate_email(client: AsyncClient, renter):
    resp = await client.post("/api/v1/auth/register", json={
        "email": "renter@test.com",
        "password": "SecurePass123",
        "first_name": "Dup",
        "last_name": "User",
        "role": "renter",
    })
    assert resp.status_code == 409


@pytest.mark.asyncio
async def test_login_json(client: AsyncClient, renter):
    resp = await client.post("/api/v1/auth/login/json", json={
        "email": "renter@test.com",
        "password": "testpass123",
    })
    assert resp.status_code == 200
    data = resp.json()
    assert "access_token" in data
    assert data["token_type"] == "bearer"


@pytest.mark.asyncio
async def test_login_wrong_password(client: AsyncClient, renter):
    resp = await client.post("/api/v1/auth/login/json", json={
        "email": "renter@test.com",
        "password": "wrongpassword",
    })
    assert resp.status_code == 401


@pytest.mark.asyncio
async def test_get_current_user(client: AsyncClient, renter):
    resp = await client.get("/api/v1/auth/me", headers=auth_header(renter))
    assert resp.status_code == 200
    data = resp.json()
    assert data["email"] == "renter@test.com"


@pytest.mark.asyncio
async def test_get_current_user_no_token(client: AsyncClient):
    resp = await client.get("/api/v1/auth/me")
    assert resp.status_code == 401
