export class UserRepository {
  constructor(pool) {
    this.pool = pool;
  }

  async findById(id) {
    const [rows] = await this.pool.query(
      'SELECT id, name, email, created_at, updated_at FROM users WHERE id = ? LIMIT 1',
      [id]
    );
    return rows[0] || null;
  }
}
