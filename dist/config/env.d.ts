/**
 * Environment configuration with validation
 * Loads and validates all environment variables
 */
export declare const env: {
    NODE_ENV: "development" | "production" | "test";
    PORT: number;
    HOST: string;
    DB_HOST: string;
    DB_PORT: number;
    DB_USER: string;
    DB_PASSWORD: string;
    DB_NAME: string;
    JWT_SECRET: string;
    JWT_EXPIRES_IN: string;
    BCRYPT_SALT_ROUNDS: number;
    CORS_ORIGIN: string;
    LOG_LEVEL: "fatal" | "error" | "warn" | "info" | "debug" | "trace";
    RATE_LIMIT_WINDOW_MS: number;
    RATE_LIMIT_MAX_REQUESTS: number;
    DATABASE_URL?: string | undefined;
};
export declare const isDev: boolean;
export declare const isProd: boolean;
export declare const isTest: boolean;
//# sourceMappingURL=env.d.ts.map