"use strict";
/**
 * Database migration runner
 * Runs SQL migration files in order
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const database_1 = require("./database");
const logger_1 = require("./logger");
const MIGRATIONS_DIR = path_1.default.join(__dirname, '../../migrations');
/**
 * Ensure migrations table exists
 */
const ensureMigrationsTable = async () => {
    await (0, database_1.query)(`
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
const getExecutedMigrations = async () => {
    const result = await (0, database_1.query)('SELECT name FROM migrations ORDER BY id');
    return result.rows.map((row) => row.name);
};
/**
 * Get migration files from directory
 */
const getMigrationFiles = () => {
    if (!fs_1.default.existsSync(MIGRATIONS_DIR)) {
        logger_1.logger.warn('No migrations directory found');
        return [];
    }
    return fs_1.default
        .readdirSync(MIGRATIONS_DIR)
        .filter((file) => file.endsWith('.sql') && !file.includes('.down.'))
        .sort();
};
/**
 * Run pending migrations
 */
const runMigrations = async () => {
    logger_1.logger.info('Starting database migrations...');
    await ensureMigrationsTable();
    const executedMigrations = await getExecutedMigrations();
    const migrationFiles = getMigrationFiles();
    const pendingMigrations = migrationFiles.filter((file) => !executedMigrations.includes(file));
    if (pendingMigrations.length === 0) {
        logger_1.logger.info('No pending migrations');
        return;
    }
    logger_1.logger.info(`Found ${pendingMigrations.length} pending migration(s)`);
    for (const migrationFile of pendingMigrations) {
        const filePath = path_1.default.join(MIGRATIONS_DIR, migrationFile);
        const sql = fs_1.default.readFileSync(filePath, 'utf-8');
        logger_1.logger.info(`Running migration: ${migrationFile}`);
        const client = await database_1.pool.connect();
        try {
            await client.query('BEGIN');
            await client.query(sql);
            await client.query('INSERT INTO migrations (name) VALUES ($1)', [migrationFile]);
            await client.query('COMMIT');
            logger_1.logger.info(`✅ Migration completed: ${migrationFile}`);
        }
        catch (error) {
            await client.query('ROLLBACK');
            logger_1.logger.error({ error }, `❌ Migration failed: ${migrationFile}`);
            throw error;
        }
        finally {
            client.release();
        }
    }
    logger_1.logger.info('All migrations completed successfully');
};
/**
 * Rollback last migration (for development)
 */
const rollbackLastMigration = async () => {
    const executedMigrations = await getExecutedMigrations();
    if (executedMigrations.length === 0) {
        logger_1.logger.info('No migrations to rollback');
        return;
    }
    const lastMigration = executedMigrations[executedMigrations.length - 1];
    if (!lastMigration) {
        logger_1.logger.info('No migrations to rollback');
        return;
    }
    const downFile = lastMigration.replace('.sql', '.down.sql');
    const downPath = path_1.default.join(MIGRATIONS_DIR, downFile);
    if (!fs_1.default.existsSync(downPath)) {
        logger_1.logger.error(`No rollback file found: ${downFile}`);
        return;
    }
    const sql = fs_1.default.readFileSync(downPath, 'utf-8');
    logger_1.logger.info(`Rolling back: ${lastMigration}`);
    const client = await database_1.pool.connect();
    try {
        await client.query('BEGIN');
        await client.query(sql);
        await client.query('DELETE FROM migrations WHERE name = $1', [lastMigration]);
        await client.query('COMMIT');
        logger_1.logger.info(`✅ Rollback completed: ${lastMigration}`);
    }
    catch (error) {
        await client.query('ROLLBACK');
        logger_1.logger.error({ error }, `❌ Rollback failed: ${lastMigration}`);
        throw error;
    }
    finally {
        client.release();
    }
};
// CLI entry point
const main = async () => {
    const command = process.argv[2];
    try {
        if (command === 'down') {
            await rollbackLastMigration();
        }
        else {
            await runMigrations();
        }
    }
    catch (error) {
        logger_1.logger.error({ error }, 'Migration error');
        process.exit(1);
    }
    finally {
        await database_1.pool.end();
    }
};
main().catch((error) => {
    // eslint-disable-next-line no-console
    console.error(error);
    process.exit(1);
});
//# sourceMappingURL=migrate.js.map