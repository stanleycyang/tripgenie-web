"use strict";
/**
 * HTTP Request Logger Middleware
 * Logs incoming requests and response times
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.requestId = exports.httpLogger = void 0;
const crypto_1 = __importDefault(require("crypto"));
const logger_1 = require("../config/logger");
/**
 * Log HTTP requests with timing information
 */
const httpLogger = (req, res, next) => {
    const startTime = Date.now();
    // Log request
    const { method, url, ip } = req;
    const userAgent = req.get('user-agent') ?? 'unknown';
    // Get user ID if authenticated
    const userId = req.user?.userId;
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
            logger_1.requestLogger.error(logData, 'Request failed');
        }
        else if (statusCode >= 400) {
            logger_1.requestLogger.warn(logData, 'Request error');
        }
        else {
            logger_1.requestLogger.info(logData, 'Request completed');
        }
    });
    next();
};
exports.httpLogger = httpLogger;
/**
 * Request ID middleware
 * Adds unique ID to each request for tracing
 */
const requestId = (req, res, next) => {
    // Use existing request ID from headers or generate new one
    const id = req.get('x-request-id') ?? crypto_1.default.randomUUID();
    // Add to request object for logging
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    req.requestId = id;
    // Add to response headers for client tracing
    res.setHeader('x-request-id', id);
    next();
};
exports.requestId = requestId;
//# sourceMappingURL=requestLogger.js.map