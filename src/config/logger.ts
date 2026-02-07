/**
 * Pino logger configuration
 * Provides structured logging with pretty printing in development
 */

import pino from 'pino';
import { env, isDev } from './env';

// Create logger with appropriate configuration
export const logger = pino({
  level: env.LOG_LEVEL,

  // Base properties included in every log
  base: {
    pid: process.pid,
    env: env.NODE_ENV,
  },

  // Timestamp format
  timestamp: pino.stdTimeFunctions.isoTime,

  // Pretty printing in development
  transport: isDev
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
  redact: isDev
    ? []
    : ['req.headers.authorization', 'req.headers.cookie', 'password', 'password_hash', 'token'],
});

// Create child loggers for specific modules
export const createLogger = (module: string): pino.Logger => {
  return logger.child({ module });
};

// Request logger - for Express middleware
export const requestLogger = createLogger('http');

// Database logger
export const dbLogger = createLogger('database');

// Auth logger
export const authLogger = createLogger('auth');

export default logger;
