/**
 * Auth Routes
 * /api/auth/*
 */

import { Router } from 'express';
import { AuthController } from '../controllers';
import { authenticate, validateBody, asyncHandler } from '../middleware';
import { registerSchema, loginSchema } from '../utils/validation';

const router = Router();

/**
 * @route   POST /api/auth/register
 * @desc    Register a new user
 * @access  Public
 */
router.post(
  '/register',
  validateBody(registerSchema),
  asyncHandler(AuthController.register)
);

/**
 * @route   POST /api/auth/login
 * @desc    Login user and get token
 * @access  Public
 */
router.post(
  '/login',
  validateBody(loginSchema),
  asyncHandler(AuthController.login)
);

/**
 * @route   GET /api/auth/me
 * @desc    Get current user profile
 * @access  Private
 */
router.get(
  '/me',
  authenticate,
  asyncHandler(AuthController.getProfile)
);

/**
 * @route   PUT /api/auth/me
 * @desc    Update current user profile
 * @access  Private
 */
router.put(
  '/me',
  authenticate,
  asyncHandler(AuthController.updateProfile)
);

/**
 * @route   POST /api/auth/change-password
 * @desc    Change user password
 * @access  Private
 */
router.post(
  '/change-password',
  authenticate,
  asyncHandler(AuthController.changePassword)
);

export default router;
