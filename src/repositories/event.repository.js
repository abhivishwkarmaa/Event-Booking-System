export class EventRepository {
  constructor(pool) {
    this.pool = pool;
  }

  async findUpcoming({ limit, offset }) {
    const sql = `
      SELECT id, title, description, event_date, total_capacity, remaining_tickets,
             created_at, updated_at
      FROM events
      WHERE event_date >= UTC_TIMESTAMP()
      ORDER BY event_date ASC
      LIMIT ? OFFSET ?
    `;
    const [rows] = await this.pool.query(sql, [limit, offset]);

    const [countRows] = await this.pool.query(
      `SELECT COUNT(*) AS total FROM events WHERE event_date >= UTC_TIMESTAMP()`
    );
    const total = countRows[0]?.total ?? 0;

    return { rows, total: Number(total) };
  }

  async create({ title, description, eventDate, totalCapacity }) {
    const remainingTickets = totalCapacity;
    const [result] = await this.pool.query(
      `INSERT INTO events (title, description, event_date, total_capacity, remaining_tickets)
       VALUES (?, ?, ?, ?, ?)`,
      [title, description, eventDate, totalCapacity, remainingTickets]
    );
    return result.insertId;
  }

  async findById(id) {
    const [rows] = await this.pool.query(
      `SELECT id, title, description, event_date, total_capacity, remaining_tickets,
              created_at, updated_at
       FROM events WHERE id = ? LIMIT 1`,
      [id]
    );
    return rows[0] || null;
  }
}
