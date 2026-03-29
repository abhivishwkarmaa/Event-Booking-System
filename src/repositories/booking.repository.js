import { AppError } from '../utils/AppError.js';

export class BookingRepository {
  constructor(pool) {
    this.pool = pool;
  }

  async createWithTicketDecrement({ userId, eventId, bookingCode }) {
    const conn = await this.pool.getConnection();
    try {
      await conn.beginTransaction();

      const [locked] = await conn.query(
        `SELECT id, title, event_date, total_capacity, remaining_tickets
         FROM events WHERE id = ? FOR UPDATE`,
        [eventId]
      );

      if (!locked.length) {
        await conn.rollback();
        throw new AppError('Event not found', 404, 'EVENT_NOT_FOUND');
      }

      const ev = locked[0];
      if (ev.remaining_tickets < 1) {
        await conn.rollback();
        throw new AppError('Sold out', 409, 'SOLD_OUT');
      }

      const [upd] = await conn.query(
        `UPDATE events SET remaining_tickets = remaining_tickets - 1
         WHERE id = ? AND remaining_tickets > 0`,
        [eventId]
      );

      if (upd.affectedRows !== 1) {
        await conn.rollback();
        throw new AppError('Sold out', 409, 'SOLD_OUT');
      }

      const [ins] = await conn.query(
        `INSERT INTO bookings (user_id, event_id, booking_code) VALUES (?, ?, ?)`,
        [userId, eventId, bookingCode]
      );

      await conn.commit();

      return {
        id: ins.insertId,
        userId,
        eventId,
        bookingCode,
      };
    } catch (err) {
      await conn.rollback();
      if (err instanceof AppError) throw err;
      if (err.code === 'ER_DUP_ENTRY') {
        throw new AppError('Duplicate booking code', 409, 'BOOKING_CODE_DUPLICATE');
      }
      throw err;
    } finally {
      conn.release();
    }
  }

  async findByUserId(userId) {
    const sql = `
      SELECT
        b.id, b.user_id, b.event_id, b.booking_code, b.booking_date,
        e.title AS event_title, e.event_date, e.total_capacity, e.remaining_tickets
      FROM bookings b
      INNER JOIN events e ON e.id = b.event_id
      WHERE b.user_id = ?
      ORDER BY b.booking_date DESC
    `;
    const [rows] = await this.pool.query(sql, [userId]);
    return rows;
  }

  async findByBookingCodeAndEventId(bookingCode, eventId) {
    const [rows] = await this.pool.query(
      `SELECT b.id, b.user_id, b.event_id, b.booking_code, b.booking_date
       FROM bookings b
       WHERE b.booking_code = ? AND b.event_id = ?
       LIMIT 1`,
      [bookingCode, eventId]
    );
    return rows[0] || null;
  }
}
