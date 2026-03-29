export class AttendanceRepository {
  constructor(pool) {
    this.pool = pool;
  }

  async create({ bookingId }) {
    const [result] = await this.pool.query('INSERT INTO attendance (booking_id) VALUES (?)', [bookingId]);
    return result.insertId;
  }

  async findByBookingId(bookingId) {
    const [rows] = await this.pool.query(
      'SELECT id, booking_id, entry_time FROM attendance WHERE booking_id = ? LIMIT 1',
      [bookingId]
    );
    return rows[0] || null;
  }
}
