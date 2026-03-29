import Joi from 'joi';

export const createEventSchema = Joi.object({
  title: Joi.string().trim().min(1).max(500).required(),
  description: Joi.string().allow('', null).max(10000).optional(),
  date: Joi.date().iso().greater('now').required().messages({
    'date.greater': 'date must be in the future',
  }),
  totalCapacity: Joi.number().integer().min(1).max(1000000).required(),
});

export const listEventsQuerySchema = Joi.object({
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).max(100).default(20),
});

export const eventIdParamSchema = Joi.object({
  id: Joi.number().integer().positive().required(),
});
