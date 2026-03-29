# Event Booking API

Production-oriented **Node.js + Express + MySQL** backend for listing events, booking tickets with transactional inventory control, listing a user’s bookings, and marking attendance by booking code.

## Architecture

- **No `src/models` folder:** there is no ORM; request shapes are validated with **Joi** (`validators/`) and rows are mapped in **repositories** / **utils**.  
- **Clean layering:** Controller → Service → Repository → MySQL  
- **SOLID / DRY / KISS:** thin controllers, injectable collaborators via a composition root (`src/container.js`)  
- **Concurrency:** booking uses a **transaction** with **`SELECT … FOR UPDATE`** on the `events` row, then conditional `UPDATE` + `INSERT` to avoid overbooking  
- **Validation:** **Joi** at the edge; **centralized error handler** with consistent JSON  
- **API docs:** OpenAPI **3** spec at `docs/openapi.yaml`, served by Swagger UI at **`/api-docs`**  
- **Pooling:** **mysql2** connection pool (size from env)

## Folder structure

```
.
├── db/
│   ├── schema.sql          # Dev reset: DROP + CREATE (local / docker init)
│   ├── migrations/
│   │   └── 001_initial_schema.sql   # First migration — empty DB only (no DROP)
│   └── seed.sql            # Optional demo data
├── docs/
│   └── openapi.yaml        # OpenAPI specification
├── postman/
│   └── Event-Booking-API.postman_collection.json
├── src/
│   ├── app.js              # Express app, middleware, Swagger, routes
│   ├── server.js           # HTTP listener
│   ├── container.js        # Dependency wiring
│   ├── config/
│   │   └── env.js          # Env validation
│   ├── db/
│   │   └── pool.js         # mysql2 connection pool
│   ├── controllers/
│   ├── services/
│   ├── repositories/
│   ├── routes/
│   ├── middlewares/
│   ├── validators/
│   └── utils/
├── docker-compose.yml
├── Dockerfile
├── package.json
└── README.md
```

## API (base path `/api`)

| Method | Path | Description |
|--------|------|-------------|
| `GET` | `/events` | Upcoming events (paginated: `page`, `limit`) |
| `POST` | `/events` | Create event |
| `POST` | `/bookings` | Book ticket (transaction + row lock) |
| `GET` | `/users/:id/bookings` | User’s bookings (with event summary, single query) |
| `POST` | `/events/:id/attendance` | Mark attendance with `bookingCode` (UUID) |

Health: `GET /health` (no `/api` prefix).  
Interactive docs: `GET /api-docs`.

### Response shape

**Success:** `{ "success": true, "data": …, "meta": … }` (meta when paginated)  

**Error:** `{ "success": false, "error": { "message", "code", "details?" } }`

## Configuration

Copy `.env.example` to `.env` and adjust:

| Variable | Description |
|----------|-------------|
| `PORT` | HTTP port (default `3000`) |
| `DB_HOST`, `DB_PORT` | MySQL host/port |
| `DB_USER`, `DB_PASSWORD`, `DB_NAME` | Credentials & database name |
| `DB_CONNECTION_LIMIT` | Pool size (default `10`) |

## Local setup (without Docker)

1. **MySQL 8** — create database and user matching `.env`.  
2. **Tables:** either run **`db/migrations/001_initial_schema.sql`** on an empty DB, or **`db/schema.sql`** if you want DROP + recreate (handy for dev).  
3. **Optional seed:** `mysql -u USER -p DB_NAME < db/seed.sql`  
4. **Install & run:**

```bash
npm install
cp .env.example .env
# edit .env
npm start
```

For development with auto-restart: `npm run dev` (Node 18+ `--watch`).

## Docker (API only)

MySQL alag se chal raha ho (local / cloud) — **`docker-compose` sirf Node API** build/run karta hai. **`DB_*` values project root ki `.env` se** container ke andar load hoti hain (same as `npm start`).

```bash
docker compose up --build
```

- API: `http://localhost:${PORT}` (default `3000`)  
- Agar MySQL **host machine** par hai aur DB `DB_HOST=127.0.0.1` hai, Docker se connect ke liye macOS/Windows par `DB_HOST=host.docker.internal` use karo; Linux par `extra_hosts` ya DB ka reachable IP.

## Postman

Import `postman/Event-Booking-API.postman_collection.json` and set `baseUrl` / `rootUrl` if your host differs.

## Engineering notes

- **Indexes:** `events.event_date` for upcoming listing; `bookings.user_id`, `bookings.event_id`; unique `bookings.booking_code`; unique `attendance.booking_id`.  
- **No N+1** on user bookings: one `JOIN` query in `BookingRepository.findByUserId`.  
- **Attendance races:** duplicate insert on `attendance.booking_id` is turned into `409 ALREADY_CHECKED_IN`.  
- **Timezones:** listing uses `UTC_TIMESTAMP()` for “upcoming”; store event times consistently (prefer UTC in clients).

## License

MIT (or your organization’s default).
