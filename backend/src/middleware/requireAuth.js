import { ApiError } from '../utils/apiError.js';
import { verifyToken } from '../utils/token.js';

export function requireAuth(req, res, next) {
  const header = req.headers.authorization || '';

  if (!header.startsWith('Bearer ')) {
    return next(new ApiError('Authorization token is required', 401));
  }

  const token = header.slice(7).trim();

  try {
    const payload = verifyToken(token);
    req.user = payload;
    next();
  } catch (error) {
    next(new ApiError('Invalid or expired token', 401));
  }
}
