import Joi from 'joi';

export const markAttendanceSchema = Joi.object({
  bookingCode: Joi.string().uuid({ version: 'uuidv4' }).required(),
});
