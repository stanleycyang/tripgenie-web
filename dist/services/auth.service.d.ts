/**
 * Authentication Service
 * Handles user registration, login, and password management
 */
import { UserPublic } from '../types';
import { RegisterInput, LoginInput } from '../utils/validation';
interface AuthResult {
    user: UserPublic;
    token: string;
}
/**
 * Register a new user
 */
export declare const register: (input: RegisterInput) => Promise<AuthResult>;
/**
 * Login user with email and password
 */
export declare const login: (input: LoginInput) => Promise<AuthResult>;
/**
 * Get current user profile
 */
export declare const getProfile: (userId: string) => Promise<UserPublic>;
/**
 * Update user profile
 */
export declare const updateProfile: (userId: string, data: {
    name?: string;
    email?: string;
}) => Promise<UserPublic>;
/**
 * Change user password
 */
export declare const changePassword: (userId: string, currentPassword: string, newPassword: string) => Promise<void>;
/**
 * Validate that a password meets requirements
 * (Useful for password change operations)
 */
export declare const validatePasswordStrength: (password: string) => boolean;
export {};
//# sourceMappingURL=auth.service.d.ts.map