import { v4 as uuidv4 } from 'uuid';
import { AppError } from '../utils/AppError.js';
import { mapEvent, mapBookingListRow } from '../utils/mappers.js';

export class BookingService {
  constructor(bookingRepository, userRepository, eventRepository) {
    this.bookings = bookingRepository;
    this.users = userRepository;
    this.events = eventRepository;
  }

  async create({ userId, eventId }) {
    if (!(await this.users.findById(userId))) {
      throw new AppError('User not found', 404, 'USER_NOT_FOUND');
    }
    if (!(await this.events.findById(eventId))) {
      throw new AppError('Event not found', 404, 'EVENT_NOT_FOUND');
    }

    const bookingCode = uuidv4();
    const row = await this.bookings.createWithTicketDecrement({
      userId,
      eventId,
      bookingCode,
    });

    const eventRow = await this.events.findById(eventId);
    return {
      id: row.id,
      userId: row.userId,
      eventId: row.eventId,
      bookingCode: row.bookingCode,
      event: mapEvent(eventRow),
    };
  }

  async listByUserId(userId) {
    if (!(await this.users.findById(userId))) {
      throw new AppError('User not found', 404, 'USER_NOT_FOUND');
    }
    const rows = await this.bookings.findByUserId(userId);
    return rows.map(mapBookingListRow);
  }
}
