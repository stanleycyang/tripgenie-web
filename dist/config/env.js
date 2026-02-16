"use strict";
/**
 * Environment configuration with validation
 * Loads and validates all environment variables
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.isTest = exports.isProd = exports.isDev = exports.env = void 0;
const zod_1 = require("zod");
const dotenv_1 = __importDefault(require("dotenv"));
// Load environment variables from .env file
dotenv_1.default.config();
// Define the schema for environment variables
const envSchema = zod_1.z.object({
    // Server
    NODE_ENV: zod_1.z.enum(['development', 'production', 'test']).default('development'),
    PORT: zod_1.z.string().transform(Number).default('3000'),
    HOST: zod_1.z.string().default('localhost'),
    // Database
    DATABASE_URL: zod_1.z.string().optional(),
    DB_HOST: zod_1.z.string().default('localhost'),
    DB_PORT: zod_1.z.string().transform(Number).default('5432'),
    DB_USER: zod_1.z.string().default('postgres'),
    DB_PASSWORD: zod_1.z.string().default(''),
    DB_NAME: zod_1.z.string().default('tripgenie'),
    // JWT
    JWT_SECRET: zod_1.z.string().min(32, 'JWT_SECRET must be at least 32 characters'),
    JWT_EXPIRES_IN: zod_1.z.string().default('7d'),
    // Bcrypt
    BCRYPT_SALT_ROUNDS: zod_1.z.string().transform(Number).default('12'),
    // CORS
    CORS_ORIGIN: zod_1.z.string().default('http://localhost:5173'),
    // Logging
    LOG_LEVEL: zod_1.z.enum(['fatal', 'error', 'warn', 'info', 'debug', 'trace']).default('info'),
    // Rate Limiting
    RATE_LIMIT_WINDOW_MS: zod_1.z.string().transform(Number).default('900000'),
    RATE_LIMIT_MAX_REQUESTS: zod_1.z.string().transform(Number).default('100'),
});
// Parse and validate environment variables
const parseEnv = () => {
    const result = envSchema.safeParse(process.env);
    if (!result.success) {
        // eslint-disable-next-line no-console
        console.error('❌ Invalid environment variables:');
        // eslint-disable-next-line no-console
        console.error(result.error.format());
        process.exit(1);
    }
    return result.data;
};
exports.env = parseEnv();
// Helper to check environment
exports.isDev = exports.env.NODE_ENV === 'development';
exports.isProd = exports.env.NODE_ENV === 'production';
exports.isTest = exports.env.NODE_ENV === 'test';
//# sourceMappingURL=env.js.map