# Event Booking System — Backend API

REST service for event listings, ticket booking, per-user booking history, and attendance by booking code.

Stack: Node.js (ES modules), Express, MySQL via `mysql2`, Joi validation, OpenAPI 3 (`docs/openapi.yaml`), Postman collection, Docker optional.

## Setup and run

### Local (Node.js + MySQL)

| Step | Action |
|------|--------|
| 1 | Clone the repository and open the project directory. |
| 2 | Install dependencies: `npm install` |
| 3 | Create a MySQL database and a user with access to it. |
| 4 | Apply schema: run one of these from the project root: (a) empty DB: `mysql -u USER -p DATABASE < db/migrations/001_initial_schema.sql` (b) full reset with drops: `mysql -u USER -p DATABASE < db/schema.sql` |
| 5 | `cp .env.example .env` and set `DB_HOST`, `DB_PORT`, `DB_USER`, `DB_PASSWORD`, `DB_NAME`, and `PORT` (default `5000`). |
| 6 | Optional sample data: `mysql -u USER -p DATABASE < db/seed.sql` |
| 7 | Start: `npm start` or `npm run dev` (Node 18+). |
| 8 | Check `GET /health`, Swagger at `/api-docs`, and `GET /api/events?page=1&limit=20` using your `PORT`. |

### Docker Compose (API + MySQL)

Includes MySQL 8 and the API. First start runs `db/schema.sql` and `db/seed.sql` via MySQL init; data persists in a named volume.

1. Copy `.env.example` to `.env` and set `DB_USER`, `DB_PASSWORD`, `DB_NAME` (defaults align with Compose). Compose sets `DB_HOST=mysql` and `DB_PORT=3306` for the API container.
2. From the project root: `docker compose up --build`
3. API: `http://localhost:${PORT}` (default `5000`). MySQL on the host: `MYSQL_PUBLISH_PORT` maps to container `3306` (default host port `3307` if system MySQL uses `3306`).

To run only the API container against MySQL elsewhere, set `DB_HOST` to `host.docker.internal` (macOS/Windows) or the host LAN IP (Linux).

### Quick commands (after database exists)

```bash
npm install
cp .env.example .env
# edit .env
npm start
```

## Specification coverage

Implements the Event Booking backend brief: REST API, MySQL, OpenAPI, Postman, optional Docker.

| Topic | Brief | Implementation |
|------|--------|----------------|
| Runtime | Node.js + Express | Express 4, `async/await` |
| Persistence | MySQL driver or ORM | `mysql2` pool |
| Users | `id`, `name`, `email` | `users`, unique `email` |
| Events | title, description, date, capacities | `events` (`event_date`, capacities, `CHECK`) |
| Bookings | user, event, time, unique code | `bookings` with `booking_date`, `booking_code` (UUID), FKs |
| Attendance | Entry time | `attendance` on `booking_id`, `entry_time` |
| Concurrency | Safe booking | Transaction, `SELECT … FOR UPDATE`, conditional `UPDATE`, insert |
| `GET /events` | Upcoming | `GET /api/events`, pagination |
| `POST /events` | Create | `POST /api/events`, Joi |
| `POST /bookings` | Book + code | `POST /api/bookings` |
| `GET /users/:id/bookings` | User bookings | `GET /api/users/:id/bookings` with event fields |
| `POST /events/:id/attendance` | Check-in | `POST /api/events/:id/attendance`, `bookingCode` |
| Quality | Errors, validation | Central handler; Joi |
| Docs | OpenAPI | `docs/openapi.yaml`, `/api-docs`, dynamic spec at `/api-docs/swagger.json` |

Attendance assumes one ticket per booking. Duplicate check-in returns HTTP 409.

## Technical notes

| Area | Approach |
|------|----------|
| API | Base path `/api`; JSON with `success`, `data`, `error` |
| Layout | Controllers, services, repositories; `src/container.js` |
| MySQL | InnoDB, FKs, indexes on hot columns |
| OpenAPI | Matches routes and response shapes |

## Prerequisites

- Node.js 18+
- MySQL 8.x
- npm

## Configuration

| Variable | Role |
|----------|------|
| `PORT` | HTTP port (default `5000`) |
| `DB_HOST`, `DB_PORT` | MySQL endpoint |
| `DB_USER`, `DB_PASSWORD`, `DB_NAME` | Credentials |
| `DB_CONNECTION_LIMIT` | Pool size (default `10`) |

## Database files

| File | Use |
|------|-----|
| `db/schema.sql` | Full DDL with `DROP` (dev reset) |
| `db/migrations/001_initial_schema.sql` | Create-only for empty DB |
| `db/seed.sql` | Sample data |

## API overview

Routes under `/api`.

| Method | Path | Purpose |
|--------|------|---------|
| GET | `/events` | Upcoming events (`page`, `limit`) |
| POST | `/events` | Create event |
| POST | `/bookings` | Create booking |
| GET | `/users/:id/bookings` | User bookings |
| POST | `/events/:id/attendance` | Attendance with `bookingCode` |

Health: `GET /health` (no `/api` prefix).  
Swagger UI: `GET /api-docs`

## Postman

`postman/Event-Booking-API.postman_collection.json` — adjust `baseUrl` and `rootUrl` for your host/port.

## OpenAPI

- File: `docs/openapi.yaml`
- UI: `/api-docs` (servers from `/api-docs/swagger.json`)

## Repository contents

| Artifact | Path |
|----------|------|
| SQL schema | `db/schema.sql` |
| OpenAPI | `docs/openapi.yaml` |
| Postman | `postman/Event-Booking-API.postman_collection.json` |
| Docker | `Dockerfile`, `docker-compose.yml` |

## Deployment (optional)

- Render: https://event-booking-system-vl6o.onrender.com/api-docs/
- Self-hosted: open the chosen `PORT` in OS and provider firewalls; Swagger at `http://<host>:<port>/api-docs`.

## License

MIT unless your organization requires otherwise.
