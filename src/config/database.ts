/**
 * PostgreSQL database connection pool
 * Uses node-postgres (pg) for connection management
 */

import { Pool, PoolConfig, QueryResult, QueryResultRow, PoolClient } from 'pg';
import { env, isDev } from './env';
import { logger } from './logger';

// Build connection configuration
const getPoolConfig = (): PoolConfig => {
  // Prefer DATABASE_URL if provided (common in cloud deployments)
  if (env.DATABASE_URL) {
    return {
      connectionString: env.DATABASE_URL,
      ssl: env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
    };
  }

  // Otherwise use individual connection parameters
  return {
    host: env.DB_HOST,
    port: env.DB_PORT,
    user: env.DB_USER,
    password: env.DB_PASSWORD,
    database: env.DB_NAME,
    // Connection pool settings
    max: 20, // Maximum number of clients in the pool
    idleTimeoutMillis: 30000, // Close idle clients after 30 seconds
    connectionTimeoutMillis: 2000, // Return error after 2 seconds if no connection
  };
};

// Create the connection pool
export const pool = new Pool(getPoolConfig());

// Log pool events in development
if (isDev) {
  pool.on('connect', () => {
    logger.debug('New client connected to PostgreSQL');
  });

  pool.on('remove', () => {
    logger.debug('Client removed from PostgreSQL pool');
  });
}

// Handle pool errors
pool.on('error', (err) => {
  logger.error({ err }, 'Unexpected error on idle PostgreSQL client');
});

/**
 * Execute a SQL query with parameters
 * @param text - SQL query string
 * @param params - Query parameters
 * @returns Query result
 */
export const query = async <T extends QueryResultRow = QueryResultRow>(
  text: string,
  params?: unknown[]
): Promise<QueryResult<T>> => {
  const start = Date.now();
  try {
    const result = await pool.query<T>(text, params);
    const duration = Date.now() - start;

    if (isDev) {
      logger.debug(
        {
          query: text,
          duration,
          rows: result.rowCount,
        },
        'Executed query'
      );
    }

    return result;
  } catch (error) {
    logger.error({ error, query: text }, 'Database query error');
    throw error;
  }
};

/**
 * Get a client from the pool for transactions
 * Remember to release the client after use!
 */
export const getClient = async (): Promise<PoolClient> => {
  const client = await pool.connect();
  return client;
};

/**
 * Execute multiple queries in a transaction
 * @param queries - Array of { text, params } objects
 * @returns Array of query results
 */
export const transaction = async <T extends QueryResultRow = QueryResultRow>(
  queries: Array<{ text: string; params?: unknown[] }>
): Promise<QueryResult<T>[]> => {
  const client = await getClient();
  const results: QueryResult<T>[] = [];

  try {
    await client.query('BEGIN');

    for (const q of queries) {
      const result = await client.query<T>(q.text, q.params);
      results.push(result);
    }

    await client.query('COMMIT');
    return results;
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
};

/**
 * Test database connection
 */
export const testConnection = async (): Promise<boolean> => {
  try {
    const result = await query('SELECT NOW()');
    logger.info('✅ Database connection successful');
    return result.rowCount !== null && result.rowCount > 0;
  } catch (error) {
    logger.error({ error }, '❌ Database connection failed');
    return false;
  }
};

/**
 * Gracefully close the pool
 */
export const closePool = async (): Promise<void> => {
  await pool.end();
  logger.info('Database pool closed');
};
