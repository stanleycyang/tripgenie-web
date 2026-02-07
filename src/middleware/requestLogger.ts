/**
 * HTTP Request Logger Middleware
 * Logs incoming requests and response times
 */

import { Request, Response, NextFunction } from 'express';
import crypto from 'crypto';
import { requestLogger } from '../config/logger';
import { AuthenticatedRequest } from '../types';

/**
 * Log HTTP requests with timing information
 */
export const httpLogger = (req: Request, res: Response, next: NextFunction): void => {
  const startTime = Date.now();

  // Log request
  const { method, url, ip } = req;
  const userAgent = req.get('user-agent') ?? 'unknown';

  // Get user ID if authenticated
  const userId = (req as AuthenticatedRequest).user?.userId;

  // On response finish, log the complete request
  res.on('finish', () => {
    const duration = Date.now() - startTime;
    const { statusCode } = res;

    // Choose log level based on status code
    const logData = {
      method,
      url,
      statusCode,
      duration,
      ip,
      userAgent,
      userId,
    };

    if (statusCode >= 500) {
      requestLogger.error(logData, 'Request failed');
    } else if (statusCode >= 400) {
      requestLogger.warn(logData, 'Request error');
    } else {
      requestLogger.info(logData, 'Request completed');
    }
  });

  next();
};

/**
 * Request ID middleware
 * Adds unique ID to each request for tracing
 */
export const requestId = (req: Request, res: Response, next: NextFunction): void => {
  // Use existing request ID from headers or generate new one
  const id = (req.get('x-request-id') as string) ?? crypto.randomUUID();

  // Add to request object for logging
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (req as any).requestId = id;

  // Add to response headers for client tracing
  res.setHeader('x-request-id', id);

  next();
};
