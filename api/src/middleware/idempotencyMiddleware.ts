import { Request, Response, NextFunction } from 'express';

interface CachedResponse {
  statusCode: number;
  headers: Record<string, string>;
  body: any;
  timestamp: number;
}

// In-memory idempotency cache (production would back with Redis TTL)
const idempotencyStore = new Map<string, CachedResponse>();

// Clean up cache entries older than 24 hours
const TTL_MS = 24 * 60 * 60 * 1000;
const cleanupTimer = setInterval(() => {
  const now = Date.now();
  for (const [key, val] of idempotencyStore.entries()) {
    if (now - val.timestamp > TTL_MS) {
      idempotencyStore.delete(key);
    }
  }
}, 60 * 60 * 1000);
if (cleanupTimer.unref) {
  cleanupTimer.unref();
}

/**
 * Idempotency Middleware:
 * Inspects 'Idempotency-Key' on mutating methods (POST, PUT, PATCH, DELETE).
 * If a request with the same idempotency key was previously processed, returns
 * the exact cached HTTP response without re-executing financial or payroll logic.
 */
export const idempotencyMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const idempotencyKey = req.headers['idempotency-key'] as string;

  // Only enforce / cache if key is explicitly supplied or on mutating financial/payroll actions
  if (!idempotencyKey) {
    return next();
  }

  const cached = idempotencyStore.get(idempotencyKey);
  if (cached) {
    res.setHeader('X-Cache-Lookup', 'HIT-IDEMPOTENT');
    res.setHeader('Idempotency-Key', idempotencyKey);
    return res.status(cached.statusCode).json(cached.body);
  }

  // Intercept response to cache upon completion
  const originalJson = res.json.bind(res);
  res.json = (body: any) => {
    // Only cache successful or client error statuses (don't cache 500s)
    if (res.statusCode < 500) {
      idempotencyStore.set(idempotencyKey, {
        statusCode: res.statusCode,
        headers: { 'content-type': 'application/json' },
        body,
        timestamp: Date.now(),
      });
    }
    res.setHeader('X-Cache-Lookup', 'MISS-STORED');
    res.setHeader('Idempotency-Key', idempotencyKey);
    return originalJson(body);
  };

  next();
};

export const clearIdempotencyCache = () => {
  idempotencyStore.clear();
};
