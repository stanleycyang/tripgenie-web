/**
 * JWT Authentication Middleware
 * Validates Bearer tokens and attaches user info to requests
 */
import { Response, NextFunction } from 'express';
import { AuthenticatedRequest, JWTPayload } from '../types';
/**
 * Verify JWT token and attach user payload to request
 */
export declare const authenticate: (req: AuthenticatedRequest, _res: Response, next: NextFunction) => void;
/**
 * Optional authentication - doesn't fail if no token
 * Useful for routes that work differently for authenticated vs anonymous users
 */
export declare const optionalAuth: (req: AuthenticatedRequest, _res: Response, next: NextFunction) => void;
/**
 * Generate JWT token for a user
 */
export declare const generateToken: (userId: string, email: string) => string;
/**
 * Decode token without verification (for debugging)
 */
export declare const decodeToken: (token: string) => JWTPayload | null;
//# sourceMappingURL=auth.d.ts.map