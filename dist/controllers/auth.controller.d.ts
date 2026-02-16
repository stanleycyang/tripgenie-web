/**
 * Auth Controller
 * Handles authentication HTTP endpoints
 */
import { Response } from 'express';
import { AuthenticatedRequest } from '../types';
/**
 * POST /api/auth/register
 * Register a new user
 */
export declare const register: (req: AuthenticatedRequest, res: Response) => Promise<void>;
/**
 * POST /api/auth/login
 * Login with email and password
 */
export declare const login: (req: AuthenticatedRequest, res: Response) => Promise<void>;
/**
 * GET /api/auth/me
 * Get current user profile (requires auth)
 */
export declare const getProfile: (req: AuthenticatedRequest, res: Response) => Promise<void>;
/**
 * PUT /api/auth/me
 * Update current user profile (requires auth)
 */
export declare const updateProfile: (req: AuthenticatedRequest, res: Response) => Promise<void>;
/**
 * POST /api/auth/change-password
 * Change user password (requires auth)
 */
export declare const changePassword: (req: AuthenticatedRequest, res: Response) => Promise<void>;
//# sourceMappingURL=auth.controller.d.ts.map