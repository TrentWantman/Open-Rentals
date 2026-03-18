# Open Rentals

A self-hostable rental listing platform. Ships with landlord identity verification, PostGIS-powered geo-search, and a full renter application flow. Fork it and deploy it for your city.

![Homepage](screenshots/homepage.png)

## Stack

**Backend** — FastAPI, PostgreSQL + PostGIS, SQLAlchemy 2.0 (async), Alembic, Redis
**Frontend** — Next.js 14 (App Router), TypeScript, Tailwind CSS, Radix UI, Mapbox GL
**Infrastructure** — Docker, Cloudinary (images), Stripe (payments)

## Running locally

```bash
cp .env.example .env
cp backend/.env.example backend/.env
# Fill in SECRET_KEY — everything else is optional

docker-compose up -d

# First run only: apply migrations
docker-compose exec backend alembic upgrade head
```

- Frontend: http://localhost:3000
- API + docs: http://localhost:8000/docs

## Features

- Landlord identity verification with admin approval before listings go live
- Property listings with PostGIS radius search and Mapbox map view
- JWT auth with access + refresh tokens, role-based: renter / landlord / admin
- Full rental application flow with status tracking per listing
- Separate dashboards for renters and landlords
- Email notifications for applications and verification status

## Screenshots

| Listings | Listing Detail |
|----------|---------------|
| ![Listings](screenshots/listings.png) | ![Detail](screenshots/listing-detail.png) |

| Renter Dashboard |
|-----------------|
| ![Dashboard](screenshots/dashboard.png) |

## Project structure

```
backend/
  app/
    api/routes/     # auth, properties, applications, users
    core/           # config, security utilities
    models/         # SQLAlchemy ORM models
    schemas/        # Pydantic request/response schemas
    services/       # email, media upload
    db/             # async engine, session
  alembic/          # migrations

frontend/
  src/
    app/            # Next.js pages (App Router)
    components/     # UI, layout, property cards, dashboard
    lib/            # API client, auth context
```

## Environment variables

See `.env.example` and `backend/.env.example`. Required: `SECRET_KEY`, `DATABASE_URL`. Everything else (Mapbox, Cloudinary, Stripe, SMTP) is optional — the app runs without them with those features disabled.
