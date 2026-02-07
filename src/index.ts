/**
 * TripGenie Backend Server
 * Main entry point for the Express.js application
 */

import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { env, isDev } from './config/env';
import { logger } from './config/logger';
import { testConnection, closePool } from './config/database';
import { errorHandler, notFoundHandler, httpLogger, requestId } from './middleware';
import routes from './routes';

// Create Express application
const app = express();

// ============================================
// Security Middleware
// ============================================

// Helmet sets various HTTP headers for security
app.use(helmet());

// CORS configuration
app.use(
  cors({
    origin: env.CORS_ORIGIN.split(','),
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  })
);

// ============================================
// Request Processing Middleware
// ============================================

// Add request ID for tracing
app.use(requestId);

// HTTP request logging
app.use(httpLogger);

// Parse JSON bodies
app.use(express.json({ limit: '10mb' }));

// Parse URL-encoded bodies
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// ============================================
// API Routes
// ============================================

// Mount all API routes under /api
app.use('/api', routes);

// ============================================
// Error Handling
// ============================================

// Handle 404 for undefined routes
app.use(notFoundHandler);

// Global error handler (must be last)
app.use(errorHandler);

// ============================================
// Server Startup
// ============================================

const startServer = async (): Promise<void> => {
  try {
    // Test database connection
    const dbConnected = await testConnection();

    if (!dbConnected) {
      logger.error('Failed to connect to database. Please check your configuration.');
      logger.info('You can still start the server, but database operations will fail.');
    }

    // Start the server
    const server = app.listen(env.PORT, () => {
      logger.info(
        {
          port: env.PORT,
          env: env.NODE_ENV,
          cors: env.CORS_ORIGIN,
        },
        `🚀 TripGenie API server running on http://${env.HOST}:${env.PORT}`
      );

      if (isDev) {
        logger.info('📚 API Documentation: http://localhost:' + env.PORT + '/api/health');
      }
    });

    // Graceful shutdown handlers
    const gracefulShutdown = async (signal: string): Promise<void> => {
      logger.info(`${signal} received. Starting graceful shutdown...`);

      // Stop accepting new connections
      server.close(async () => {
        logger.info('HTTP server closed');

        // Close database pool
        await closePool();

        logger.info('All connections closed. Exiting.');
        process.exit(0);
      });

      // Force exit after timeout
      setTimeout(() => {
        logger.error('Could not close connections in time. Forcing exit.');
        process.exit(1);
      }, 10000);
    };

    process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
    process.on('SIGINT', () => gracefulShutdown('SIGINT'));

    // Handle uncaught exceptions
    process.on('uncaughtException', (error) => {
      logger.fatal({ error }, 'Uncaught exception');
      process.exit(1);
    });

    // Handle unhandled promise rejections
    process.on('unhandledRejection', (reason, promise) => {
      logger.fatal({ reason, promise }, 'Unhandled promise rejection');
      process.exit(1);
    });
  } catch (error) {
    logger.fatal({ error }, 'Failed to start server');
    process.exit(1);
  }
};

// Start the server
startServer().catch((error) => {
  // eslint-disable-next-line no-console
  console.error('Failed to start server:', error);
  process.exit(1);
});

export default app;
