/**
 * Auth Controller
 * Handles authentication HTTP endpoints
 */

import { Response } from 'express';
import { AuthService } from '../services';
import { AuthenticatedRequest, ApiResponse, UserPublic } from '../types';
import { RegisterInput, LoginInput } from '../utils/validation';

/**
 * POST /api/auth/register
 * Register a new user
 */
export const register = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  const input = req.body as RegisterInput;

  const result = await AuthService.register(input);

  const response: ApiResponse<{ user: UserPublic; token: string }> = {
    success: true,
    message: 'User registered successfully',
    data: result,
  };

  res.status(201).json(response);
};

/**
 * POST /api/auth/login
 * Login with email and password
 */
export const login = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  const input = req.body as LoginInput;

  const result = await AuthService.login(input);

  const response: ApiResponse<{ user: UserPublic; token: string }> = {
    success: true,
    message: 'Login successful',
    data: result,
  };

  res.status(200).json(response);
};

/**
 * GET /api/auth/me
 * Get current user profile (requires auth)
 */
export const getProfile = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  const userId = req.user?.userId;

  if (!userId) {
    res.status(401).json({ success: false, error: 'Unauthorized' });
    return;
  }

  const user = await AuthService.getProfile(userId);

  const response: ApiResponse<UserPublic> = {
    success: true,
    data: user,
  };

  res.status(200).json(response);
};

/**
 * PUT /api/auth/me
 * Update current user profile (requires auth)
 */
export const updateProfile = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  const userId = req.user?.userId;

  if (!userId) {
    res.status(401).json({ success: false, error: 'Unauthorized' });
    return;
  }

  const { name, email } = req.body as { name?: string; email?: string };

  const user = await AuthService.updateProfile(userId, { name, email });

  const response: ApiResponse<UserPublic> = {
    success: true,
    message: 'Profile updated successfully',
    data: user,
  };

  res.status(200).json(response);
};

/**
 * POST /api/auth/change-password
 * Change user password (requires auth)
 */
export const changePassword = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  const userId = req.user?.userId;

  if (!userId) {
    res.status(401).json({ success: false, error: 'Unauthorized' });
    return;
  }

  const { currentPassword, newPassword } = req.body as {
    currentPassword: string;
    newPassword: string;
  };

  await AuthService.changePassword(userId, currentPassword, newPassword);

  const response: ApiResponse<null> = {
    success: true,
    message: 'Password changed successfully',
  };

  res.status(200).json(response);
};
