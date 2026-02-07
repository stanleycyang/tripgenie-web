/**
 * Authentication Service
 * Handles user registration, login, and password management
 */

import bcrypt from 'bcrypt';
import { UserModel } from '../models';
import { generateToken } from '../middleware/auth';
import { env } from '../config/env';
import { authLogger } from '../config/logger';
import { UserPublic, AppError, UnauthorizedError } from '../types';
import { RegisterInput, LoginInput } from '../utils/validation';

interface AuthResult {
  user: UserPublic;
  token: string;
}

/**
 * Register a new user
 */
export const register = async (input: RegisterInput): Promise<AuthResult> => {
  const { email, name, password } = input;

  // Check if email already exists
  const existingUser = await UserModel.findByEmail(email);
  if (existingUser) {
    throw new AppError('Email already registered', 409);
  }

  // Hash password
  const passwordHash = await bcrypt.hash(password, env.BCRYPT_SALT_ROUNDS);

  // Create user
  const user = await UserModel.create(email, name, passwordHash);

  authLogger.info({ userId: user.id, email: user.email }, 'New user registered');

  // Generate token
  const token = generateToken(user.id, user.email);

  return {
    user: UserModel.toPublicUser(user),
    token,
  };
};

/**
 * Login user with email and password
 */
export const login = async (input: LoginInput): Promise<AuthResult> => {
  const { email, password } = input;

  // Find user by email
  const user = await UserModel.findByEmail(email);
  if (!user) {
    // Use generic message to prevent email enumeration
    throw new UnauthorizedError('Invalid email or password');
  }

  // Verify password
  const isValidPassword = await bcrypt.compare(password, user.password_hash);
  if (!isValidPassword) {
    authLogger.warn({ email }, 'Failed login attempt');
    throw new UnauthorizedError('Invalid email or password');
  }

  authLogger.info({ userId: user.id }, 'User logged in');

  // Generate token
  const token = generateToken(user.id, user.email);

  return {
    user: UserModel.toPublicUser(user),
    token,
  };
};

/**
 * Get current user profile
 */
export const getProfile = async (userId: string): Promise<UserPublic> => {
  const user = await UserModel.findById(userId);
  if (!user) {
    throw new AppError('User not found', 404);
  }

  return UserModel.toPublicUser(user);
};

/**
 * Update user profile
 */
export const updateProfile = async (
  userId: string,
  data: { name?: string; email?: string }
): Promise<UserPublic> => {
  // If email is being changed, check for duplicates
  if (data.email) {
    const existingUser = await UserModel.findByEmail(data.email);
    if (existingUser && existingUser.id !== userId) {
      throw new AppError('Email already in use', 409);
    }
  }

  const user = await UserModel.update(userId, data);
  if (!user) {
    throw new AppError('User not found', 404);
  }

  authLogger.info({ userId }, 'User profile updated');

  return UserModel.toPublicUser(user);
};

/**
 * Change user password
 */
export const changePassword = async (
  userId: string,
  currentPassword: string,
  newPassword: string
): Promise<void> => {
  const user = await UserModel.findById(userId);
  if (!user) {
    throw new AppError('User not found', 404);
  }

  // Verify current password
  const isValidPassword = await bcrypt.compare(currentPassword, user.password_hash);
  if (!isValidPassword) {
    throw new UnauthorizedError('Current password is incorrect');
  }

  // Hash new password
  const passwordHash = await bcrypt.hash(newPassword, env.BCRYPT_SALT_ROUNDS);

  // Update password
  await UserModel.updatePassword(userId, passwordHash);

  authLogger.info({ userId }, 'User password changed');
};

/**
 * Validate that a password meets requirements
 * (Useful for password change operations)
 */
export const validatePasswordStrength = (password: string): boolean => {
  // Minimum 8 characters, at least one uppercase, one lowercase, one number
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
  return passwordRegex.test(password);
};
