/**
 * User Model
 * Handles all user-related database operations
 */
import { User, UserPublic } from '../types';
/**
 * Convert User to public representation (without password)
 */
export declare const toPublicUser: (user: User) => UserPublic;
/**
 * Find user by ID
 */
export declare const findById: (id: string) => Promise<User | null>;
/**
 * Find user by email
 */
export declare const findByEmail: (email: string) => Promise<User | null>;
/**
 * Create a new user
 */
export declare const create: (email: string, name: string, passwordHash: string) => Promise<User>;
/**
 * Update user details
 */
export declare const update: (id: string, data: Partial<Pick<User, "email" | "name">>) => Promise<User | null>;
/**
 * Update user password
 */
export declare const updatePassword: (id: string, passwordHash: string) => Promise<boolean>;
/**
 * Delete user
 */
export declare const deleteUser: (id: string) => Promise<boolean>;
/**
 * Check if email exists
 */
export declare const emailExists: (email: string) => Promise<boolean>;
//# sourceMappingURL=user.model.d.ts.map