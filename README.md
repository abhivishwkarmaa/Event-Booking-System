# Event Booking System — Backend API

Backend service for a **mini event management** flow: browse upcoming events, book tickets with safe inventory updates, list a user’s bookings, and record attendance by booking code.

**Stack:** Node.js (ES modules), Express, MySQL (`mysql2` pool), Joi validation, OpenAPI 3 (`docs/openapi.yaml`), Postman collection, optional Docker image for the API.

---

## Setup and run

### Local (Node.js + MySQL)

| Step | Action |
|------|--------|
| 1 | Clone the repository and open the project directory. |
| 2 | Install dependencies: `npm install` |
| 3 | Create a MySQL database and a user with access to it. |
| 4 | Apply schema — run **one** of these from the project root:<br>• Empty database: `mysql -u USER -p DATABASE < db/migrations/001_initial_schema.sql`<br>• Full reset (drops existing tables): `mysql -u USER -p DATABASE < db/schema.sql` |
| 5 | Copy `cp .env.example .env` and set `DB_HOST`, `DB_PORT`, `DB_USER`, `DB_PASSWORD`, `DB_NAME`, and `PORT` (default `3000`). |
| 6 | *(Optional)* Load sample data: `mysql -u USER -p DATABASE < db/seed.sql` |
| 7 | Start: `npm start` — or `npm run dev` for auto-reload (Node 18+). |
| 8 | Verify: `GET /health`, Swagger at `/api-docs`, example `GET /api/events?page=1&limit=20` (use the configured `PORT`). |

### Docker Compose (API + MySQL)

The stack includes **MySQL 8** and the **API**. On first start, `db/schema.sql` and `db/seed.sql` run automatically (MySQL init). Data is stored in a named volume.

1. Copy `.env.example` to `.env` and set at least `DB_USER`, `DB_PASSWORD`, `DB_NAME` (defaults match Compose). Compose **overrides** `DB_HOST` to `mysql` and `DB_PORT` to `3306` for the API container.
2. From the project root: `docker compose up --build`
3. API: `http://localhost:${PORT}` (default `3000`). MySQL is exposed on the host as **`MYSQL_PUBLISH_PORT` → container 3306** (default **`3307`** so it does not clash with a system MySQL on **3306**).

**Docker without bundled MySQL:** run only the API image and point MySQL at an external host; set `DB_HOST` to `host.docker.internal` (macOS/Windows) or the host IP (Linux) when MySQL runs on the machine instead of Compose.

### Quick commands (after database is ready)

```bash
npm install
cp .env.example .env
# set MySQL variables in .env
npm start
```

---

## Specification coverage

The build follows the published **Event Booking System** backend brief (REST API, MySQL, OpenAPI, Postman, optional Docker).

| Topic | Brief | Implementation |
|------|--------|----------------|
| Runtime | Node.js + Express | Express 4, `async/await` |
| Persistence | MySQL driver or ORM | `mysql2` connection pool |
| Users | `id`, `name`, `email` | `users` table, unique `email` |
| Events | title, description, date, capacities | `events` (`event_date`, `total_capacity`, `remaining_tickets`, `CHECK` constraints) |
| Bookings | user, event, booking time, **unique code** | `bookings` with `booking_date`, **`booking_code` (UUID)**, FKs |
| Attendance | Entry time | `attendance` → `booking_id`, `entry_time` (user via booking) |
| Concurrency | Safe ticket booking | Transaction + `SELECT … FOR UPDATE` + conditional `UPDATE` + insert |
| `GET /events` | Upcoming events | `GET /api/events`, future dates, pagination |
| `POST /events` | Create event | `POST /api/events` + Joi |
| `POST /bookings` | Book + unique code | `POST /api/bookings`, transactional decrement |
| `GET /users/:id/bookings` | User’s bookings | `GET /api/users/:id/bookings` with event details (single query) |
| `POST /events/:id/attendance` | Code-based check-in | `POST /api/events/:id/attendance` with `bookingCode` |
| Quality | Errors, validation | Central error handler; Joi on body, query, params |
| Docs | OpenAPI / Swagger | `docs/openapi.yaml`, UI at `/api-docs`, dynamic base via `/api-docs/swagger.json` |

**Attendance model:** One booking corresponds to one ticket. Check-in uses the booking code; duplicate check-in returns `409`. Aggregate ticket counts per user per event can be derived from existing booking data.

---

## Technical notes

| Area | Approach |
|------|----------|
| API shape | Base path `/api`; JSON responses with `success`, `data`, and structured `error` |
| Layering | Controllers → services → repositories; wiring in `src/container.js` |
| MySQL | InnoDB, foreign keys, indexes on `event_date`, `user_id`, `event_id`, unique `booking_code` |
| OpenAPI | Spec aligned with live routes and response envelopes |

---

## Prerequisites

- Node.js 18+
- MySQL 8.x
- npm (or compatible client)

---

## Configuration

| Variable | Role |
|----------|------|
| `PORT` | HTTP port (default `3000`) |
| `DB_HOST`, `DB_PORT` | MySQL endpoint |
| `DB_USER`, `DB_PASSWORD`, `DB_NAME` | Credentials |
| `DB_CONNECTION_LIMIT` | Pool size (default `10`) |

---

## Database files

| File | Use |
|------|-----|
| `db/schema.sql` | Full DDL including `DROP` (development reset) |
| `db/migrations/001_initial_schema.sql` | Create-only migration for an empty database |
| `db/seed.sql` | Optional sample users and events |

---

## API overview

Routes are under **`/api`**.

| Method | Path | Purpose |
|--------|------|---------|
| GET | `/events` | Upcoming events (`page`, `limit`) |
| POST | `/events` | Create event |
| POST | `/bookings` | Create booking |
| GET | `/users/:id/bookings` | List bookings for user |
| POST | `/events/:id/attendance` | Attendance using `bookingCode` |

**Health:** `GET /health` (no `/api` prefix).  
**Swagger UI:** `GET /api-docs`

---

## Postman

Collection path: `postman/Event-Booking-API.postman_collection.json`  
Update the collection variables `baseUrl` and `rootUrl` if the host or port changes.

---

## OpenAPI

- Specification: `docs/openapi.yaml`
- Interactive UI: `/api-docs` (dynamic `servers` entry from `/api-docs/swagger.json`)

---

## Repository contents

| Artifact | Path |
|----------|------|
| SQL schema (export) | `db/schema.sql` |
| OpenAPI specification | `docs/openapi.yaml` |
| Postman collection | `postman/Event-Booking-API.postman_collection.json` |
| Docker | `Dockerfile`, `docker-compose.yml` (API + MySQL, schema + seed on init) |

---

## License

MIT (unless the organization specifies otherwise).


https://event-booking-system-vl6o.onrender.com/api-docs/

http://94.136.187.247:3008/api-docs