import express from 'express';
import { validateParams } from '../middlewares/validate.js';
import { userIdParamSchema } from '../validators/user.validator.js';

export function createUserRouter(controllers) {
  const r = express.Router();
  r.get(
    '/:id/bookings',
    validateParams(userIdParamSchema),
    controllers.bookingController.listByUser
  );
  return r;
}
