"use strict";
/**
 * TripGenie Backend Server
 * Main entry point for the Express.js application
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const env_1 = require("./config/env");
const logger_1 = require("./config/logger");
const database_1 = require("./config/database");
const middleware_1 = require("./middleware");
const routes_1 = __importDefault(require("./routes"));
// Create Express application
const app = (0, express_1.default)();
// ============================================
// Security Middleware
// ============================================
// Helmet sets various HTTP headers for security
app.use((0, helmet_1.default)());
// CORS configuration
app.use((0, cors_1.default)({
    origin: env_1.env.CORS_ORIGIN.split(','),
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
}));
// ============================================
// Request Processing Middleware
// ============================================
// Add request ID for tracing
app.use(middleware_1.requestId);
// HTTP request logging
app.use(middleware_1.httpLogger);
// Parse JSON bodies
app.use(express_1.default.json({ limit: '10mb' }));
// Parse URL-encoded bodies
app.use(express_1.default.urlencoded({ extended: true, limit: '10mb' }));
// ============================================
// API Routes
// ============================================
// Mount all API routes under /api
app.use('/api', routes_1.default);
// ============================================
// Error Handling
// ============================================
// Handle 404 for undefined routes
app.use(middleware_1.notFoundHandler);
// Global error handler (must be last)
app.use(middleware_1.errorHandler);
// ============================================
// Server Startup
// ============================================
const startServer = async () => {
    try {
        // Test database connection
        const dbConnected = await (0, database_1.testConnection)();
        if (!dbConnected) {
            logger_1.logger.error('Failed to connect to database. Please check your configuration.');
            logger_1.logger.info('You can still start the server, but database operations will fail.');
        }
        // Start the server
        const server = app.listen(env_1.env.PORT, () => {
            logger_1.logger.info({
                port: env_1.env.PORT,
                env: env_1.env.NODE_ENV,
                cors: env_1.env.CORS_ORIGIN,
            }, `🚀 TripGenie API server running on http://${env_1.env.HOST}:${env_1.env.PORT}`);
            if (env_1.isDev) {
                logger_1.logger.info('📚 API Documentation: http://localhost:' + env_1.env.PORT + '/api/health');
            }
        });
        // Graceful shutdown handlers
        const gracefulShutdown = async (signal) => {
            logger_1.logger.info(`${signal} received. Starting graceful shutdown...`);
            // Stop accepting new connections
            server.close(async () => {
                logger_1.logger.info('HTTP server closed');
                // Close database pool
                await (0, database_1.closePool)();
                logger_1.logger.info('All connections closed. Exiting.');
                process.exit(0);
            });
            // Force exit after timeout
            setTimeout(() => {
                logger_1.logger.error('Could not close connections in time. Forcing exit.');
                process.exit(1);
            }, 10000);
        };
        process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
        process.on('SIGINT', () => gracefulShutdown('SIGINT'));
        // Handle uncaught exceptions
        process.on('uncaughtException', (error) => {
            logger_1.logger.fatal({ error }, 'Uncaught exception');
            process.exit(1);
        });
        // Handle unhandled promise rejections
        process.on('unhandledRejection', (reason, promise) => {
            logger_1.logger.fatal({ reason, promise }, 'Unhandled promise rejection');
            process.exit(1);
        });
    }
    catch (error) {
        logger_1.logger.fatal({ error }, 'Failed to start server');
        process.exit(1);
    }
};
// Start the server
startServer().catch((error) => {
    // eslint-disable-next-line no-console
    console.error('Failed to start server:', error);
    process.exit(1);
});
exports.default = app;
//# sourceMappingURL=index.js.map