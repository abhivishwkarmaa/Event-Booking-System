import { AppError } from '../utils/AppError.js';
import { fail } from '../utils/apiResponse.js';
import { config } from '../config/env.js';

export function errorHandler(err, req, res, _next) {
  if (res.headersSent) return;

  if (err instanceof AppError) {
    return res.status(err.statusCode).json(fail(err.message, err.code, err.details));
  }

  const dev = config.nodeEnv === 'development';
  console.error(err);
  return res.status(500).json(
    fail(dev ? err.message : 'Something went wrong', 'INTERNAL_ERROR', dev ? { stack: err.stack } : undefined)
  );
}
