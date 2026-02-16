"use strict";
/**
 * Pino logger configuration
 * Provides structured logging with pretty printing in development
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authLogger = exports.dbLogger = exports.requestLogger = exports.createLogger = exports.logger = void 0;
const pino_1 = __importDefault(require("pino"));
const env_1 = require("./env");
// Create logger with appropriate configuration
exports.logger = (0, pino_1.default)({
    level: env_1.env.LOG_LEVEL,
    // Base properties included in every log
    base: {
        pid: process.pid,
        env: env_1.env.NODE_ENV,
    },
    // Timestamp format
    timestamp: pino_1.default.stdTimeFunctions.isoTime,
    // Pretty printing in development
    transport: env_1.isDev
        ? {
            target: 'pino-pretty',
            options: {
                colorize: true,
                translateTime: 'SYS:standard',
                ignore: 'pid,hostname',
                singleLine: false,
            },
        }
        : undefined,
    // Redact sensitive fields in production
    redact: env_1.isDev
        ? []
        : ['req.headers.authorization', 'req.headers.cookie', 'password', 'password_hash', 'token'],
});
// Create child loggers for specific modules
const createLogger = (module) => {
    return exports.logger.child({ module });
};
exports.createLogger = createLogger;
// Request logger - for Express middleware
exports.requestLogger = (0, exports.createLogger)('http');
// Database logger
exports.dbLogger = (0, exports.createLogger)('database');
// Auth logger
exports.authLogger = (0, exports.createLogger)('auth');
exports.default = exports.logger;
//# sourceMappingURL=logger.js.map