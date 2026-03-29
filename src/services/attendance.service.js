import { AppError } from '../utils/AppError.js';
import { toIso } from '../utils/mappers.js';

export class AttendanceService {
  constructor(attendanceRepository, bookingRepository) {
    this.attendance = attendanceRepository;
    this.bookings = bookingRepository;
  }

  async markAttendance(eventId, bookingCode) {
    const booking = await this.bookings.findByBookingCodeAndEventId(bookingCode, eventId);
    if (!booking) {
      throw new AppError('Invalid code for this event', 404, 'BOOKING_NOT_FOUND');
    }

    if (await this.attendance.findByBookingId(booking.id)) {
      throw new AppError('Already checked in', 409, 'ALREADY_CHECKED_IN');
    }

    try {
      await this.attendance.create({ bookingId: booking.id });
    } catch (err) {
      if (err.code === 'ER_DUP_ENTRY') {
        throw new AppError('Already checked in', 409, 'ALREADY_CHECKED_IN');
      }
      throw err;
    }

    const record = await this.attendance.findByBookingId(booking.id);
    return {
      bookingId: booking.id,
      eventId: booking.event_id,
      bookingCode: booking.booking_code,
      entryTime: toIso(record.entry_time),
    };
  }
}
