import express from 'express';
import { createEventRouter } from './event.routes.js';
import { createBookingRouter } from './booking.routes.js';
import { createUserRouter } from './user.routes.js';

export function createApiRouter(controllers) {
  const r = express.Router();
  r.use('/events', createEventRouter(controllers));
  r.use('/bookings', createBookingRouter(controllers));
  r.use('/users', createUserRouter(controllers));
  return r;
}
