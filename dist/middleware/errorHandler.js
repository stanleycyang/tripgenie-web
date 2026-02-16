"use strict";
/**
 * Global Error Handler Middleware
 * Catches all errors and returns consistent API responses
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.asyncHandler = exports.notFoundHandler = exports.errorHandler = void 0;
const zod_1 = require("zod");
const logger_1 = require("../config/logger");
const types_1 = require("../types");
const env_1 = require("../config/env");
/**
 * Format Zod validation errors into a readable format
 */
const formatZodErrors = (error) => {
    const errors = {};
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
const errorHandler = (error, _req, res, _next) => {
    // Log the error
    logger_1.logger.error({
        error: {
            name: error.name,
            message: error.message,
            stack: env_1.isDev ? error.stack : undefined,
        },
    }, 'Error occurred');
    // Handle Zod validation errors
    if (error instanceof zod_1.ZodError) {
        const response = {
            success: false,
            error: 'Validation failed',
            errors: formatZodErrors(error),
        };
        res.status(400).json(response);
        return;
    }
    // Handle custom AppError instances
    if (error instanceof types_1.AppError) {
        const response = {
            success: false,
            error: error.message,
        };
        res.status(error.statusCode).json(response);
        return;
    }
    // Handle PostgreSQL errors
    if ('code' in error && typeof error.code === 'string') {
        const pgError = error;
        switch (pgError.code) {
            case '23505': // Unique violation
                res.status(409).json({
                    success: false,
                    error: 'A record with this value already exists',
                });
                return;
            case '23503': // Foreign key violation
                res.status(400).json({
                    success: false,
                    error: 'Referenced record does not exist',
                });
                return;
            case '22P02': // Invalid text representation (e.g., invalid UUID)
                res.status(400).json({
                    success: false,
                    error: 'Invalid ID format',
                });
                return;
            default:
                // Log unknown database errors
                logger_1.logger.error({ code: pgError.code, detail: pgError.detail }, 'Database error');
        }
    }
    // Default to 500 Internal Server Error
    const response = {
        success: false,
        error: env_1.isDev ? error.message : 'An unexpected error occurred',
    };
    res.status(500).json(response);
};
exports.errorHandler = errorHandler;
/**
 * 404 Not Found handler
 * Catches requests to undefined routes
 */
const notFoundHandler = (req, res) => {
    const response = {
        success: false,
        error: `Cannot ${req.method} ${req.path}`,
    };
    res.status(404).json(response);
};
exports.notFoundHandler = notFoundHandler;
/**
 * Async handler wrapper
 * Catches async errors and passes them to the error handler
 */
const asyncHandler = (fn) => {
    return (req, res, next) => {
        Promise.resolve(fn(req, res, next)).catch(next);
    };
};
exports.asyncHandler = asyncHandler;
//# sourceMappingURL=errorHandler.js.map