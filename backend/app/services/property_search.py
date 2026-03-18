from decimal import Decimal
from typing import Any, Optional
from uuid import UUID

from geoalchemy2.functions import ST_DWithin, ST_MakePoint, ST_SetSRID
from sqlalchemy import select, func, and_, or_, ColumnElement
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.property import Property, PropertyStatus, PropertyType


class PropertySearchService:
    """Service for searching and filtering properties with PostGIS geo-queries."""

    def __init__(self, db: AsyncSession):
        self.db = db

    async def search(
        self,
        *,
        # Location filters
        latitude: Optional[float] = None,
        longitude: Optional[float] = None,
        radius_miles: float = 5.0,
        neighborhood: Optional[str] = None,
        zip_code: Optional[str] = None,
        # Property filters
        property_type: Optional[PropertyType] = None,
        min_price: Optional[Decimal] = None,
        max_price: Optional[Decimal] = None,
        min_bedrooms: Optional[int] = None,
        max_bedrooms: Optional[int] = None,
        min_bathrooms: Optional[Decimal] = None,
        max_bathrooms: Optional[Decimal] = None,
        min_sqft: Optional[int] = None,
        max_sqft: Optional[int] = None,
        # Amenity filters
        pets_allowed: Optional[bool] = None,
        has_parking: Optional[bool] = None,
        has_laundry: Optional[bool] = None,
        # Verification
        verified_only: bool = False,
        # Pagination
        offset: int = 0,
        limit: int = 20,
        # Sorting
        sort_by: str = "created_at",  # created_at, price, distance
        sort_order: str = "desc",  # asc, desc
    ) -> tuple[list[Property], int]:
        """
        Search properties with filters and geo-search.
        Returns tuple of (properties, total_count).
        """
        # Base query - only active properties
        query = select(Property).where(Property.status == PropertyStatus.ACTIVE)
        count_query = select(func.count(Property.id)).where(
            Property.status == PropertyStatus.ACTIVE
        )

        conditions: list[ColumnElement[bool]] = []

        # Geo-search: find properties within radius
        if latitude is not None and longitude is not None:
            # Convert miles to meters (1 mile = 1609.34 meters)
            radius_meters = radius_miles * 1609.34

            # Create point from lat/lng
            search_point = ST_SetSRID(ST_MakePoint(longitude, latitude), 4326)

            # Filter by distance
            geo_condition = ST_DWithin(
                Property.location,
                search_point,
                radius_meters,
                use_spheroid=True
            )
            conditions.append(geo_condition)

        # Neighborhood filter
        if neighborhood:
            conditions.append(
                func.lower(Property.neighborhood) == neighborhood.lower()
            )

        # Zip code filter
        if zip_code:
            conditions.append(Property.zip_code == zip_code)

        # Property type filter
        if property_type:
            conditions.append(Property.property_type == property_type)

        # Price range
        if min_price is not None:
            conditions.append(Property.monthly_rent >= min_price)
        if max_price is not None:
            conditions.append(Property.monthly_rent <= max_price)

        # Bedrooms
        if min_bedrooms is not None:
            conditions.append(Property.bedrooms >= min_bedrooms)
        if max_bedrooms is not None:
            conditions.append(Property.bedrooms <= max_bedrooms)

        # Bathrooms
        if min_bathrooms is not None:
            conditions.append(Property.bathrooms >= min_bathrooms)
        if max_bathrooms is not None:
            conditions.append(Property.bathrooms <= max_bathrooms)

        # Square footage
        if min_sqft is not None:
            conditions.append(Property.square_feet >= min_sqft)
        if max_sqft is not None:
            conditions.append(Property.square_feet <= max_sqft)

        # Pets
        if pets_allowed is not None:
            conditions.append(Property.pets_allowed == pets_allowed)

        # Amenity filters (JSONB)
        if has_parking is not None:
            conditions.append(
                Property.amenities["parking"].astext.cast(Boolean) == has_parking
            )
        if has_laundry is not None:
            conditions.append(
                or_(
                    Property.amenities["laundry"].astext == "in_unit",
                    Property.amenities["laundry"].astext == "in_building",
                )
            )

        # Verified only
        if verified_only:
            conditions.append(Property.is_verified == True)

        # Apply all conditions
        if conditions:
            query = query.where(and_(*conditions))
            count_query = count_query.where(and_(*conditions))

        # Sorting
        order_col: Any
        if sort_by == "price":
            order_col = Property.monthly_rent
        elif sort_by == "distance" and latitude and longitude:
            # Sort by distance from search point
            search_point = ST_SetSRID(ST_MakePoint(longitude, latitude), 4326)
            order_col = func.ST_Distance(Property.location, search_point)
        else:
            order_col = Property.created_at

        if sort_order == "asc":
            query = query.order_by(order_col.asc())
        else:
            query = query.order_by(order_col.desc())

        # Get total count
        total_result = await self.db.execute(count_query)
        total = total_result.scalar() or 0

        # Apply pagination
        query = query.offset(offset).limit(limit)

        # Execute query
        result = await self.db.execute(query)
        properties = list(result.scalars().all())

        return properties, total

    async def get_by_slug(self, slug: str) -> Optional[Property]:
        """Get a property by its slug."""
        query = select(Property).where(Property.slug == slug)
        result = await self.db.execute(query)
        return result.scalar_one_or_none()

    async def get_by_id(self, property_id: UUID) -> Optional[Property]:
        """Get a property by ID."""
        query = select(Property).where(Property.id == property_id)
        result = await self.db.execute(query)
        return result.scalar_one_or_none()

    async def get_landlord_properties(
        self,
        landlord_id: UUID,
        status: Optional[PropertyStatus] = None,
        offset: int = 0,
        limit: int = 20,
    ) -> tuple[list[Property], int]:
        """Get all properties for a landlord."""
        query = select(Property).where(Property.landlord_id == landlord_id)
        count_query = select(func.count(Property.id)).where(
            Property.landlord_id == landlord_id
        )

        if status:
            query = query.where(Property.status == status)
            count_query = count_query.where(Property.status == status)

        query = query.order_by(Property.created_at.desc())
        query = query.offset(offset).limit(limit)

        total_result = await self.db.execute(count_query)
        total = total_result.scalar() or 0

        result = await self.db.execute(query)
        properties = list(result.scalars().all())

        return properties, total

    async def increment_view_count(self, property_id: UUID) -> None:
        """Increment the view count for a property."""
        property = await self.get_by_id(property_id)
        if property:
            property.view_count += 1
            await self.db.commit()

    async def get_featured_properties(self, limit: int = 6) -> list[Property]:
        """Get featured/verified properties for homepage."""
        query = (
            select(Property)
            .where(
                and_(
                    Property.status == PropertyStatus.ACTIVE,
                    Property.is_verified == True,
                )
            )
            .order_by(Property.created_at.desc())
            .limit(limit)
        )
        result = await self.db.execute(query)
        return list(result.scalars().all())

    async def get_neighborhoods(self) -> list[dict]:
        """Get list of neighborhoods with property counts."""
        query = (
            select(
                Property.neighborhood,
                func.count(Property.id).label("count"),
                func.avg(Property.monthly_rent).label("avg_rent"),
            )
            .where(
                and_(
                    Property.status == PropertyStatus.ACTIVE,
                    Property.neighborhood.isnot(None),
                )
            )
            .group_by(Property.neighborhood)
            .order_by(func.count(Property.id).desc())
        )
        result = await self.db.execute(query)
        return [
            {
                "name": row.neighborhood,
                "count": row.count,
                "avg_rent": float(row.avg_rent) if row.avg_rent else None,
            }
            for row in result.all()
        ]


# Import needed for JSONB boolean casting
from sqlalchemy import Boolean
