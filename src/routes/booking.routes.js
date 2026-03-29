import express from 'express';
import { validateBody } from '../middlewares/validate.js';
import { createBookingSchema } from '../validators/booking.validator.js';

export function createBookingRouter(controllers) {
  const r = express.Router();
  r.post('/', validateBody(createBookingSchema), controllers.bookingController.create);
  return r;
}
