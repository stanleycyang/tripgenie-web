/**
 * Request Validation Middleware
 * Validates request body, params, and query using Zod schemas
 */

import { Request, Response, NextFunction } from 'express';
import { ZodSchema, ZodError } from 'zod';

type RequestLocation = 'body' | 'params' | 'query';

/**
 * Create validation middleware for a specific request location
 * @param schema - Zod schema to validate against
 * @param location - Where to find the data (body, params, query)
 */
export const validate = <T>(schema: ZodSchema<T>, location: RequestLocation = 'body') => {
  return (req: Request, _res: Response, next: NextFunction): void => {
    try {
      // Parse and validate the data
      const data = schema.parse(req[location]);

      // Replace request data with validated/transformed data
      // This ensures any transformations (like .trim(), .toLowerCase()) are applied
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (req as Record<string, any>)[location] = data;

      next();
    } catch (error) {
      if (error instanceof ZodError) {
        next(error);
      } else {
        next(error);
      }
    }
  };
};

/**
 * Validate request body
 */
export const validateBody = <T>(schema: ZodSchema<T>) => validate(schema, 'body');

/**
 * Validate request params
 */
export const validateParams = <T>(schema: ZodSchema<T>) => validate(schema, 'params');

/**
 * Validate request query
 */
export const validateQuery = <T>(schema: ZodSchema<T>) => validate(schema, 'query');

/**
 * Validate multiple locations at once
 */
export const validateRequest = <TBody, TParams, TQuery>(schemas: {
  body?: ZodSchema<TBody>;
  params?: ZodSchema<TParams>;
  query?: ZodSchema<TQuery>;
}) => {
  return (req: Request, _res: Response, next: NextFunction): void => {
    try {
      if (schemas.body) {
        req.body = schemas.body.parse(req.body);
      }
      if (schemas.params) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (req as any).params = schemas.params.parse(req.params);
      }
      if (schemas.query) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (req as any).query = schemas.query.parse(req.query);
      }
      next();
    } catch (error) {
      next(error);
    }
  };
};
