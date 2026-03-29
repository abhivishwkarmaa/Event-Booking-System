import { fail } from '../utils/apiResponse.js';

export function notFound(req, res) {
  res.status(404).json(fail(`${req.method} ${req.originalUrl} not found`, 'NOT_FOUND'));
}
