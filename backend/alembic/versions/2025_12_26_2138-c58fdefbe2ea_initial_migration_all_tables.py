"""Initial migration - all tables

Revision ID: c58fdefbe2ea
Revises:
Create Date: 2025-12-26 21:38:44.898561

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql
import geoalchemy2

# revision identifiers, used by Alembic.
revision: str = 'c58fdefbe2ea'
down_revision: Union[str, None] = None
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # Create users table
    op.create_table('users',
        sa.Column('id', sa.UUID(), nullable=False),
        sa.Column('email', sa.String(length=255), nullable=False),
        sa.Column('hashed_password', sa.String(length=255), nullable=False),
        sa.Column('first_name', sa.String(length=100), nullable=False),
        sa.Column('last_name', sa.String(length=100), nullable=False),
        sa.Column('phone', sa.String(length=20), nullable=True),
        sa.Column('avatar_url', sa.String(length=500), nullable=True),
        sa.Column('bio', sa.Text(), nullable=True),
        sa.Column('role', sa.Enum('RENTER', 'LANDLORD', 'ADMIN', name='userrole'), nullable=False),
        sa.Column('is_active', sa.Boolean(), nullable=False),
        sa.Column('is_verified', sa.Boolean(), nullable=False),
        sa.Column('email_verified', sa.Boolean(), nullable=False),
        sa.Column('is_landlord_verified', sa.Boolean(), nullable=False),
        sa.Column('company_name', sa.String(length=200), nullable=True),
        sa.Column('created_at', sa.DateTime(), nullable=False),
        sa.Column('updated_at', sa.DateTime(), nullable=False),
        sa.Column('last_login', sa.DateTime(), nullable=True),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_users_email'), 'users', ['email'], unique=True)

    # Create landlord_verifications table
    op.create_table('landlord_verifications',
        sa.Column('id', sa.UUID(), nullable=False),
        sa.Column('user_id', sa.UUID(), nullable=False),
        sa.Column('verification_type', sa.Enum('IDENTITY', 'OWNERSHIP', 'BUSINESS', name='verificationtype'), nullable=False),
        sa.Column('status', sa.Enum('PENDING', 'IN_REVIEW', 'APPROVED', 'REJECTED', 'EXPIRED', name='verificationstatus'), nullable=False),
        sa.Column('identity_verification_id', sa.String(length=100), nullable=True),
        sa.Column('identity_verified_at', sa.DateTime(), nullable=True),
        sa.Column('ownership_documents', postgresql.JSONB(astext_type=sa.Text()), nullable=True),
        sa.Column('business_license', sa.String(length=100), nullable=True),
        sa.Column('business_verified_at', sa.DateTime(), nullable=True),
        sa.Column('admin_notes', sa.Text(), nullable=True),
        sa.Column('reviewed_by', sa.String(length=100), nullable=True),
        sa.Column('submitted_at', sa.DateTime(), nullable=False),
        sa.Column('reviewed_at', sa.DateTime(), nullable=True),
        sa.Column('expires_at', sa.DateTime(), nullable=True),
        sa.Column('created_at', sa.DateTime(), nullable=False),
        sa.Column('updated_at', sa.DateTime(), nullable=False),
        sa.ForeignKeyConstraint(['user_id'], ['users.id'], ),
        sa.PrimaryKeyConstraint('id'),
        sa.UniqueConstraint('user_id')
    )

    # Create properties table
    op.create_table('properties',
        sa.Column('id', sa.UUID(), nullable=False),
        sa.Column('landlord_id', sa.UUID(), nullable=False),
        sa.Column('title', sa.String(length=200), nullable=False),
        sa.Column('slug', sa.String(length=250), nullable=False),
        sa.Column('description', sa.Text(), nullable=False),
        sa.Column('property_type', sa.Enum('APARTMENT', 'CONDO', 'HOUSE', 'TOWNHOUSE', 'STUDIO', 'ROOM', name='propertytype'), nullable=False),
        sa.Column('status', sa.Enum('DRAFT', 'PENDING_REVIEW', 'ACTIVE', 'RENTED', 'INACTIVE', name='propertystatus'), nullable=False),
        sa.Column('address', sa.String(length=300), nullable=False),
        sa.Column('unit_number', sa.String(length=20), nullable=True),
        sa.Column('city', sa.String(length=100), nullable=False),
        sa.Column('state', sa.String(length=50), nullable=False),
        sa.Column('zip_code', sa.String(length=10), nullable=False),
        sa.Column('neighborhood', sa.String(length=100), nullable=True),
        sa.Column('location', geoalchemy2.types.Geometry(geometry_type='POINT', srid=4326, from_text='ST_GeomFromEWKT', name='geometry'), nullable=True),
        sa.Column('monthly_rent', sa.Numeric(precision=10, scale=2), nullable=False),
        sa.Column('security_deposit', sa.Numeric(precision=10, scale=2), nullable=True),
        sa.Column('application_fee', sa.Numeric(precision=10, scale=2), nullable=True),
        sa.Column('bedrooms', sa.Integer(), nullable=False),
        sa.Column('bathrooms', sa.Numeric(precision=3, scale=1), nullable=False),
        sa.Column('square_feet', sa.Integer(), nullable=True),
        sa.Column('year_built', sa.Integer(), nullable=True),
        sa.Column('amenities', postgresql.JSONB(astext_type=sa.Text()), nullable=True),
        sa.Column('pets_allowed', sa.Boolean(), nullable=False),
        sa.Column('pet_deposit', sa.Numeric(precision=10, scale=2), nullable=True),
        sa.Column('smoking_allowed', sa.Boolean(), nullable=False),
        sa.Column('available_date', sa.DateTime(), nullable=True),
        sa.Column('lease_term_months', sa.Integer(), nullable=False),
        sa.Column('is_verified', sa.Boolean(), nullable=False),
        sa.Column('verified_at', sa.DateTime(), nullable=True),
        sa.Column('view_count', sa.Integer(), nullable=False),
        sa.Column('inquiry_count', sa.Integer(), nullable=False),
        sa.Column('created_at', sa.DateTime(), nullable=False),
        sa.Column('updated_at', sa.DateTime(), nullable=False),
        sa.ForeignKeyConstraint(['landlord_id'], ['users.id'], ),
        sa.PrimaryKeyConstraint('id'),
        sa.UniqueConstraint('slug')
    )
    # Use raw SQL with IF NOT EXISTS since geoalchemy2 may auto-create the spatial index
    op.execute('CREATE INDEX IF NOT EXISTS idx_properties_location ON properties USING gist (location)')
    op.execute('CREATE INDEX IF NOT EXISTS idx_properties_neighborhood ON properties (neighborhood)')
    op.execute('CREATE INDEX IF NOT EXISTS idx_properties_status_price ON properties (status, monthly_rent)')

    # Create property_images table
    op.create_table('property_images',
        sa.Column('id', sa.UUID(), nullable=False),
        sa.Column('property_id', sa.UUID(), nullable=False),
        sa.Column('url', sa.String(length=500), nullable=False),
        sa.Column('thumbnail_url', sa.String(length=500), nullable=True),
        sa.Column('caption', sa.String(length=200), nullable=True),
        sa.Column('is_primary', sa.Boolean(), nullable=False),
        sa.Column('order', sa.Integer(), nullable=False),
        sa.Column('created_at', sa.DateTime(), nullable=False),
        sa.ForeignKeyConstraint(['property_id'], ['properties.id'], ondelete='CASCADE'),
        sa.PrimaryKeyConstraint('id')
    )

    # Create rental_applications table
    op.create_table('rental_applications',
        sa.Column('id', sa.UUID(), nullable=False),
        sa.Column('property_id', sa.UUID(), nullable=False),
        sa.Column('applicant_id', sa.UUID(), nullable=False),
        sa.Column('status', sa.Enum('PENDING', 'UNDER_REVIEW', 'APPROVED', 'DENIED', 'WITHDRAWN', name='applicationstatus'), nullable=False),
        sa.Column('employment_status', sa.String(length=100), nullable=True),
        sa.Column('employer_name', sa.String(length=200), nullable=True),
        sa.Column('annual_income', sa.Numeric(precision=12, scale=2), nullable=True),
        sa.Column('desired_move_in', sa.DateTime(), nullable=True),
        sa.Column('desired_lease_term', sa.Integer(), nullable=True),
        sa.Column('num_occupants', sa.Integer(), nullable=False),
        sa.Column('has_pets', sa.Boolean(), nullable=False),
        sa.Column('pet_details', sa.Text(), nullable=True),
        sa.Column('cover_letter', sa.Text(), nullable=True),
        sa.Column('references', postgresql.JSONB(astext_type=sa.Text()), nullable=True),
        sa.Column('documents', postgresql.JSONB(astext_type=sa.Text()), nullable=True),
        sa.Column('screening_report_id', sa.String(length=100), nullable=True),
        sa.Column('screening_status', sa.String(length=50), nullable=True),
        sa.Column('landlord_notes', sa.Text(), nullable=True),
        sa.Column('reviewed_at', sa.DateTime(), nullable=True),
        sa.Column('created_at', sa.DateTime(), nullable=False),
        sa.Column('updated_at', sa.DateTime(), nullable=False),
        sa.ForeignKeyConstraint(['applicant_id'], ['users.id'], ),
        sa.ForeignKeyConstraint(['property_id'], ['properties.id'], ),
        sa.PrimaryKeyConstraint('id')
    )


def downgrade() -> None:
    op.drop_table('rental_applications')
    op.drop_table('property_images')
    op.execute('DROP INDEX IF EXISTS idx_properties_status_price')
    op.execute('DROP INDEX IF EXISTS idx_properties_neighborhood')
    op.execute('DROP INDEX IF EXISTS idx_properties_location')
    op.drop_table('properties')
    op.drop_table('landlord_verifications')
    op.drop_index(op.f('ix_users_email'), table_name='users')
    op.drop_table('users')

    # Drop enums
    op.execute('DROP TYPE IF EXISTS applicationstatus')
    op.execute('DROP TYPE IF EXISTS propertystatus')
    op.execute('DROP TYPE IF EXISTS propertytype')
    op.execute('DROP TYPE IF EXISTS verificationstatus')
    op.execute('DROP TYPE IF EXISTS verificationtype')
    op.execute('DROP TYPE IF EXISTS userrole')
