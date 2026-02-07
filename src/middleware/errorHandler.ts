/**
 * Global Error Handler Middleware
 * Catches all errors and returns consistent API responses
 */

import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';
import { logger } from '../config/logger';
import { AppError, ApiResponse } from '../types';
import { isDev } from '../config/env';

/**
 * Format Zod validation errors into a readable format
 */
const formatZodErrors = (error: ZodError): Record<string, string[]> => {
  const errors: Record<string, string[]> = {};

  for (const issue of error.issues) {
    const path = issue.path.join('.') || 'value';
    if (!errors[path]) {
      errors[path] = [];
    }
    errors[path].push(issue.message);
  }

  return errors;
};

/**
 * Global error handler middleware
 * Must have 4 parameters to be recognized as error handler
 */
export const errorHandler = (
  error: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
): void => {
  // Log the error
  logger.error(
    {
      error: {
        name: error.name,
        message: error.message,
        stack: isDev ? error.stack : undefined,
      },
    },
    'Error occurred'
  );

  // Handle Zod validation errors
  if (error instanceof ZodError) {
    const response: ApiResponse<null> & { errors?: Record<string, string[]> } = {
      success: false,
      error: 'Validation failed',
      errors: formatZodErrors(error),
    };
    res.status(400).json(response);
    return;
  }

  // Handle custom AppError instances
  if (error instanceof AppError) {
    const response: ApiResponse<null> = {
      success: false,
      error: error.message,
    };
    res.status(error.statusCode).json(response);
    return;
  }

  // Handle PostgreSQL errors
  if ('code' in error && typeof error.code === 'string') {
    const pgError = error as Error & { code: string; detail?: string };

    switch (pgError.code) {
      case '23505': // Unique violation
        res.status(409).json({
          success: false,
          error: 'A record with this value already exists',
        } as ApiResponse<null>);
        return;

      case '23503': // Foreign key violation
        res.status(400).json({
          success: false,
          error: 'Referenced record does not exist',
        } as ApiResponse<null>);
        return;

      case '22P02': // Invalid text representation (e.g., invalid UUID)
        res.status(400).json({
          success: false,
          error: 'Invalid ID format',
        } as ApiResponse<null>);
        return;

      default:
        // Log unknown database errors
        logger.error({ code: pgError.code, detail: pgError.detail }, 'Database error');
    }
  }

  // Default to 500 Internal Server Error
  const response: ApiResponse<null> = {
    success: false,
    error: isDev ? error.message : 'An unexpected error occurred',
  };

  res.status(500).json(response);
};

/**
 * 404 Not Found handler
 * Catches requests to undefined routes
 */
export const notFoundHandler = (req: Request, res: Response): void => {
  const response: ApiResponse<null> = {
    success: false,
    error: `Cannot ${req.method} ${req.path}`,
  };
  res.status(404).json(response);
};

/**
 * Async handler wrapper
 * Catches async errors and passes them to the error handler
 */
export const asyncHandler = <T>(
  fn: (req: Request, res: Response, next: NextFunction) => Promise<T>
) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};
