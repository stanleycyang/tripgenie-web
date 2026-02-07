/**
 * Database migration runner
 * Runs SQL migration files in order
 */

import fs from 'fs';
import path from 'path';
import { pool, query } from './database';
import { logger } from './logger';

const MIGRATIONS_DIR = path.join(__dirname, '../../migrations');

interface Migration {
  id: number;
  name: string;
  executed_at: Date;
}

/**
 * Ensure migrations table exists
 */
const ensureMigrationsTable = async (): Promise<void> => {
  await query(`
    CREATE TABLE IF NOT EXISTS migrations (
      id SERIAL PRIMARY KEY,
      name VARCHAR(255) NOT NULL UNIQUE,
      executed_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    )
  `);
};

/**
 * Get list of executed migrations
 */
const getExecutedMigrations = async (): Promise<string[]> => {
  const result = await query<Migration>('SELECT name FROM migrations ORDER BY id');
  return result.rows.map((row) => row.name);
};

/**
 * Get migration files from directory
 */
const getMigrationFiles = (): string[] => {
  if (!fs.existsSync(MIGRATIONS_DIR)) {
    logger.warn('No migrations directory found');
    return [];
  }

  return fs
    .readdirSync(MIGRATIONS_DIR)
    .filter((file) => file.endsWith('.sql') && !file.includes('.down.'))
    .sort();
};

/**
 * Run pending migrations
 */
const runMigrations = async (): Promise<void> => {
  logger.info('Starting database migrations...');

  await ensureMigrationsTable();

  const executedMigrations = await getExecutedMigrations();
  const migrationFiles = getMigrationFiles();

  const pendingMigrations = migrationFiles.filter(
    (file) => !executedMigrations.includes(file)
  );

  if (pendingMigrations.length === 0) {
    logger.info('No pending migrations');
    return;
  }

  logger.info(`Found ${pendingMigrations.length} pending migration(s)`);

  for (const migrationFile of pendingMigrations) {
    const filePath = path.join(MIGRATIONS_DIR, migrationFile);
    const sql = fs.readFileSync(filePath, 'utf-8');

    logger.info(`Running migration: ${migrationFile}`);

    const client = await pool.connect();
    try {
      await client.query('BEGIN');
      await client.query(sql);
      await client.query('INSERT INTO migrations (name) VALUES ($1)', [migrationFile]);
      await client.query('COMMIT');
      logger.info(`✅ Migration completed: ${migrationFile}`);
    } catch (error) {
      await client.query('ROLLBACK');
      logger.error({ error }, `❌ Migration failed: ${migrationFile}`);
      throw error;
    } finally {
      client.release();
    }
  }

  logger.info('All migrations completed successfully');
};

/**
 * Rollback last migration (for development)
 */
const rollbackLastMigration = async (): Promise<void> => {
  const executedMigrations = await getExecutedMigrations();

  if (executedMigrations.length === 0) {
    logger.info('No migrations to rollback');
    return;
  }

  const lastMigration = executedMigrations[executedMigrations.length - 1];
  if (!lastMigration) {
    logger.info('No migrations to rollback');
    return;
  }
  const downFile = lastMigration.replace('.sql', '.down.sql');
  const downPath = path.join(MIGRATIONS_DIR, downFile);

  if (!fs.existsSync(downPath)) {
    logger.error(`No rollback file found: ${downFile}`);
    return;
  }

  const sql = fs.readFileSync(downPath, 'utf-8');

  logger.info(`Rolling back: ${lastMigration}`);

  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    await client.query(sql);
    await client.query('DELETE FROM migrations WHERE name = $1', [lastMigration]);
    await client.query('COMMIT');
    logger.info(`✅ Rollback completed: ${lastMigration}`);
  } catch (error) {
    await client.query('ROLLBACK');
    logger.error({ error }, `❌ Rollback failed: ${lastMigration}`);
    throw error;
  } finally {
    client.release();
  }
};

// CLI entry point
const main = async (): Promise<void> => {
  const command = process.argv[2];

  try {
    if (command === 'down') {
      await rollbackLastMigration();
    } else {
      await runMigrations();
    }
  } catch (error) {
    logger.error({ error }, 'Migration error');
    process.exit(1);
  } finally {
    await pool.end();
  }
};

main().catch((error) => {
  // eslint-disable-next-line no-console
  console.error(error);
  process.exit(1);
});
