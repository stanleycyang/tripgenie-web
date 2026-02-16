/**
 * Pino logger configuration
 * Provides structured logging with pretty printing in development
 */
import pino from 'pino';
export declare const logger: pino.Logger<never, boolean>;
export declare const createLogger: (module: string) => pino.Logger;
export declare const requestLogger: pino.Logger<never, boolean>;
export declare const dbLogger: pino.Logger<never, boolean>;
export declare const authLogger: pino.Logger<never, boolean>;
export default logger;
//# sourceMappingURL=logger.d.ts.map