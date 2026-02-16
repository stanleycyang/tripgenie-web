/**
 * HTTP Request Logger Middleware
 * Logs incoming requests and response times
 */
import { Request, Response, NextFunction } from 'express';
/**
 * Log HTTP requests with timing information
 */
export declare const httpLogger: (req: Request, res: Response, next: NextFunction) => void;
/**
 * Request ID middleware
 * Adds unique ID to each request for tracing
 */
export declare const requestId: (req: Request, res: Response, next: NextFunction) => void;
//# sourceMappingURL=requestLogger.d.ts.map