-- Optional seed data for local development / demos (safe to run multiple times)

INSERT INTO users (name, email)
SELECT 'Demo User', 'demo@example.com'
FROM DUAL
WHERE NOT EXISTS (SELECT 1 FROM users u WHERE u.email = 'demo@example.com' LIMIT 1);

INSERT INTO events (title, description, event_date, total_capacity, remaining_tickets)
SELECT 'Annual Tech Summit', 'Keynotes and workshops.', DATE_ADD(UTC_TIMESTAMP(), INTERVAL 90 DAY), 100, 100
FROM DUAL
WHERE NOT EXISTS (SELECT 1 FROM events e WHERE e.title = 'Annual Tech Summit' LIMIT 1);

INSERT INTO events (title, description, event_date, total_capacity, remaining_tickets)
SELECT 'Indie Music Night', 'Acoustic sets and open mic.', DATE_ADD(UTC_TIMESTAMP(), INTERVAL 45 DAY), 250, 250
FROM DUAL
WHERE NOT EXISTS (SELECT 1 FROM events e WHERE e.title = 'Indie Music Night' LIMIT 1);

INSERT INTO events (title, description, event_date, total_capacity, remaining_tickets)
SELECT 'Startup Pitch Day', 'Founders pitch to angel investors.', DATE_ADD(UTC_TIMESTAMP(), INTERVAL 30 DAY), 80, 80
FROM DUAL
WHERE NOT EXISTS (SELECT 1 FROM events e WHERE e.title = 'Startup Pitch Day' LIMIT 1);

INSERT INTO events (title, description, event_date, total_capacity, remaining_tickets)
SELECT 'Marathon City Run', 'Half marathon with chip timing.', DATE_ADD(UTC_TIMESTAMP(), INTERVAL 120 DAY), 2000, 2000
FROM DUAL
WHERE NOT EXISTS (SELECT 1 FROM events e WHERE e.title = 'Marathon City Run' LIMIT 1);

INSERT INTO events (title, description, event_date, total_capacity, remaining_tickets)
SELECT 'Design Systems Workshop', 'Hands-on Figma and tokens.', DATE_ADD(UTC_TIMESTAMP(), INTERVAL 14 DAY), 40, 40
FROM DUAL
WHERE NOT EXISTS (SELECT 1 FROM events e WHERE e.title = 'Design Systems Workshop' LIMIT 1);
