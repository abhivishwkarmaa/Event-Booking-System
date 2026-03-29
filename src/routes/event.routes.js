import express from 'express';
import { validateBody, validateQuery, validateParams } from '../middlewares/validate.js';
import {
  createEventSchema,
  listEventsQuerySchema,
  eventIdParamSchema,
} from '../validators/event.validator.js';
import { markAttendanceSchema } from '../validators/attendance.validator.js';

export function createEventRouter(controllers) {
  const r = express.Router();
  const { eventController: ev, attendanceController: att } = controllers;

  r.get('/', validateQuery(listEventsQuerySchema), ev.list);
  r.post('/', validateBody(createEventSchema), ev.create);
  r.post(
    '/:id/attendance',
    validateParams(eventIdParamSchema),
    validateBody(markAttendanceSchema),
    att.mark
  );

  return r;
}
