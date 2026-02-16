/**
 * Global Error Handler Middleware
 * Catches all errors and returns consistent API responses
 */
import { Request, Response, NextFunction } from 'express';
/**
 * Global error handler middleware
 * Must have 4 parameters to be recognized as error handler
 */
export declare const errorHandler: (error: Error, _req: Request, res: Response, _next: NextFunction) => void;
/**
 * 404 Not Found handler
 * Catches requests to undefined routes
 */
export declare const notFoundHandler: (req: Request, res: Response) => void;
/**
 * Async handler wrapper
 * Catches async errors and passes them to the error handler
 */
export declare const asyncHandler: <T>(fn: (req: Request, res: Response, next: NextFunction) => Promise<T>) => (req: Request, res: Response, next: NextFunction) => void;
//# sourceMappingURL=errorHandler.d.ts.map