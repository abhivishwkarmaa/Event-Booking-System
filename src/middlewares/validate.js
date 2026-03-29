import { AppError } from '../utils/AppError.js';

function pickErrors(error) {
  return error.details.map((d) => ({
    path: d.path.join('.'),
    message: d.message,
  }));
}

export function validateBody(schema) {
  return (req, _res, next) => {
    const { error, value } = schema.validate(req.body, { abortEarly: false, stripUnknown: true });
    if (error) {
      return next(new AppError('Validation failed', 400, 'VALIDATION_ERROR', pickErrors(error)));
    }
    req.body = value;
    next();
  };
}

export function validateQuery(schema) {
  return (req, _res, next) => {
    const { error, value } = schema.validate(req.query, { abortEarly: false, stripUnknown: true });
    if (error) {
      return next(new AppError('Validation failed', 400, 'VALIDATION_ERROR', pickErrors(error)));
    }
    req.query = value;
    next();
  };
}

export function validateParams(schema) {
  return (req, _res, next) => {
    const { error, value } = schema.validate(req.params, { abortEarly: false, stripUnknown: true });
    if (error) {
      return next(new AppError('Validation failed', 400, 'VALIDATION_ERROR', pickErrors(error)));
    }
    req.params = value;
    next();
  };
}
