"use strict";
/**
 * PostgreSQL database connection pool
 * Uses node-postgres (pg) for connection management
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.closePool = exports.testConnection = exports.transaction = exports.getClient = exports.query = exports.pool = void 0;
const pg_1 = require("pg");
const env_1 = require("./env");
const logger_1 = require("./logger");
// Build connection configuration
const getPoolConfig = () => {
    // Prefer DATABASE_URL if provided (common in cloud deployments)
    if (env_1.env.DATABASE_URL) {
        return {
            connectionString: env_1.env.DATABASE_URL,
            ssl: env_1.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
        };
    }
    // Otherwise use individual connection parameters
    return {
        host: env_1.env.DB_HOST,
        port: env_1.env.DB_PORT,
        user: env_1.env.DB_USER,
        password: env_1.env.DB_PASSWORD,
        database: env_1.env.DB_NAME,
        // Connection pool settings
        max: 20, // Maximum number of clients in the pool
        idleTimeoutMillis: 30000, // Close idle clients after 30 seconds
        connectionTimeoutMillis: 2000, // Return error after 2 seconds if no connection
    };
};
// Create the connection pool
exports.pool = new pg_1.Pool(getPoolConfig());
// Log pool events in development
if (env_1.isDev) {
    exports.pool.on('connect', () => {
        logger_1.logger.debug('New client connected to PostgreSQL');
    });
    exports.pool.on('remove', () => {
        logger_1.logger.debug('Client removed from PostgreSQL pool');
    });
}
// Handle pool errors
exports.pool.on('error', (err) => {
    logger_1.logger.error({ err }, 'Unexpected error on idle PostgreSQL client');
});
/**
 * Execute a SQL query with parameters
 * @param text - SQL query string
 * @param params - Query parameters
 * @returns Query result
 */
const query = async (text, params) => {
    const start = Date.now();
    try {
        const result = await exports.pool.query(text, params);
        const duration = Date.now() - start;
        if (env_1.isDev) {
            logger_1.logger.debug({
                query: text,
                duration,
                rows: result.rowCount,
            }, 'Executed query');
        }
        return result;
    }
    catch (error) {
        logger_1.logger.error({ error, query: text }, 'Database query error');
        throw error;
    }
};
exports.query = query;
/**
 * Get a client from the pool for transactions
 * Remember to release the client after use!
 */
const getClient = async () => {
    const client = await exports.pool.connect();
    return client;
};
exports.getClient = getClient;
/**
 * Execute multiple queries in a transaction
 * @param queries - Array of { text, params } objects
 * @returns Array of query results
 */
const transaction = async (queries) => {
    const client = await (0, exports.getClient)();
    const results = [];
    try {
        await client.query('BEGIN');
        for (const q of queries) {
            const result = await client.query(q.text, q.params);
            results.push(result);
        }
        await client.query('COMMIT');
        return results;
    }
    catch (error) {
        await client.query('ROLLBACK');
        throw error;
    }
    finally {
        client.release();
    }
};
exports.transaction = transaction;
/**
 * Test database connection
 */
const testConnection = async () => {
    try {
        const result = await (0, exports.query)('SELECT NOW()');
        logger_1.logger.info('✅ Database connection successful');
        return result.rowCount !== null && result.rowCount > 0;
    }
    catch (error) {
        logger_1.logger.error({ error }, '❌ Database connection failed');
        return false;
    }
};
exports.testConnection = testConnection;
/**
 * Gracefully close the pool
 */
const closePool = async () => {
    await exports.pool.end();
    logger_1.logger.info('Database pool closed');
};
exports.closePool = closePool;
//# sourceMappingURL=database.js.map