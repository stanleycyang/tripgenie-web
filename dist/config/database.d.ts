/**
 * PostgreSQL database connection pool
 * Uses node-postgres (pg) for connection management
 */
import { Pool, QueryResult, QueryResultRow, PoolClient } from 'pg';
export declare const pool: Pool;
/**
 * Execute a SQL query with parameters
 * @param text - SQL query string
 * @param params - Query parameters
 * @returns Query result
 */
export declare const query: <T extends QueryResultRow = QueryResultRow>(text: string, params?: unknown[]) => Promise<QueryResult<T>>;
/**
 * Get a client from the pool for transactions
 * Remember to release the client after use!
 */
export declare const getClient: () => Promise<PoolClient>;
/**
 * Execute multiple queries in a transaction
 * @param queries - Array of { text, params } objects
 * @returns Array of query results
 */
export declare const transaction: <T extends QueryResultRow = QueryResultRow>(queries: Array<{
    text: string;
    params?: unknown[];
}>) => Promise<QueryResult<T>[]>;
/**
 * Test database connection
 */
export declare const testConnection: () => Promise<boolean>;
/**
 * Gracefully close the pool
 */
export declare const closePool: () => Promise<void>;
//# sourceMappingURL=database.d.ts.map