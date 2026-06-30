import { Request, Response, NextFunction } from 'express';
import CONFIG from '../config/constants';
import { getClientIp } from '../utils/validators';

interface RateLimitStore {
  [ip: string]: { count: number; resetTime: number };
}

const store: RateLimitStore = {};

/**
 * Rate limiting middleware
 * Limits requests per IP address
 */
export const rateLimiter = (req: Request, res: Response, next: NextFunction) => {
  const clientIp = getClientIp(req);
  const now = Date.now();

  if (!store[clientIp]) {
    store[clientIp] = {
      count: 1,
      resetTime: now + CONFIG.RATE_LIMIT.windowMs
    };
    return next();
  }

  const record = store[clientIp];

  // Reset if window has passed
  if (now > record.resetTime) {
    record.count = 1;
    record.resetTime = now + CONFIG.RATE_LIMIT.windowMs;
    return next();
  }

  // Check if limit exceeded
  if (record.count >= CONFIG.RATE_LIMIT.maxRequests) {
    return res.status(429).json({
      error: CONFIG.ERRORS.RATE_LIMIT_EXCEEDED,
      retryAfter: Math.ceil((record.resetTime - now) / 1000)
    });
  }

  // Increment counter
  record.count++;
  next();
};
