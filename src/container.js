import { getPool } from './db/pool.js';
import { UserRepository } from './repositories/user.repository.js';
import { EventRepository } from './repositories/event.repository.js';
import { BookingRepository } from './repositories/booking.repository.js';
import { AttendanceRepository } from './repositories/attendance.repository.js';
import { EventService } from './services/event.service.js';
import { BookingService } from './services/booking.service.js';
import { AttendanceService } from './services/attendance.service.js';
import { EventController } from './controllers/event.controller.js';
import { BookingController } from './controllers/booking.controller.js';
import { AttendanceController } from './controllers/attendance.controller.js';

export function buildContainer() {
  const pool = getPool();

  const users = new UserRepository(pool);
  const events = new EventRepository(pool);
  const bookings = new BookingRepository(pool);
  const attendance = new AttendanceRepository(pool);

  const eventService = new EventService(events);
  const bookingService = new BookingService(bookings, users, events);
  const attendanceService = new AttendanceService(attendance, bookings);

  return {
    pool,
    controllers: {
      eventController: new EventController(eventService),
      bookingController: new BookingController(bookingService),
      attendanceController: new AttendanceController(attendanceService),
    },
  };
}
