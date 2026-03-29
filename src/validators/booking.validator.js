import Joi from 'joi';

export const createBookingSchema = Joi.object({
  userId: Joi.number().integer().positive().required(),
  eventId: Joi.number().integer().positive().required(),
});
