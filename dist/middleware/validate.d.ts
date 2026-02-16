/**
 * Request Validation Middleware
 * Validates request body, params, and query using Zod schemas
 */
import { Request, Response, NextFunction } from 'express';
import { ZodSchema } from 'zod';
type RequestLocation = 'body' | 'params' | 'query';
/**
 * Create validation middleware for a specific request location
 * @param schema - Zod schema to validate against
 * @param location - Where to find the data (body, params, query)
 */
export declare const validate: <T>(schema: ZodSchema<T>, location?: RequestLocation) => (req: Request, _res: Response, next: NextFunction) => void;
/**
 * Validate request body
 */
export declare const validateBody: <T>(schema: ZodSchema<T>) => (req: Request, _res: Response, next: NextFunction) => void;
/**
 * Validate request params
 */
export declare const validateParams: <T>(schema: ZodSchema<T>) => (req: Request, _res: Response, next: NextFunction) => void;
/**
 * Validate request query
 */
export declare const validateQuery: <T>(schema: ZodSchema<T>) => (req: Request, _res: Response, next: NextFunction) => void;
/**
 * Validate multiple locations at once
 */
export declare const validateRequest: <TBody, TParams, TQuery>(schemas: {
    body?: ZodSchema<TBody>;
    params?: ZodSchema<TParams>;
    query?: ZodSchema<TQuery>;
}) => (req: Request, _res: Response, next: NextFunction) => void;
export {};
//# sourceMappingURL=validate.d.ts.map