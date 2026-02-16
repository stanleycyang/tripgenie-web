"use strict";
/**
 * Auth Routes
 * /api/auth/*
 */
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const controllers_1 = require("../controllers");
const middleware_1 = require("../middleware");
const validation_1 = require("../utils/validation");
const router = (0, express_1.Router)();
/**
 * @route   POST /api/auth/register
 * @desc    Register a new user
 * @access  Public
 */
router.post('/register', (0, middleware_1.validateBody)(validation_1.registerSchema), (0, middleware_1.asyncHandler)(controllers_1.AuthController.register));
/**
 * @route   POST /api/auth/login
 * @desc    Login user and get token
 * @access  Public
 */
router.post('/login', (0, middleware_1.validateBody)(validation_1.loginSchema), (0, middleware_1.asyncHandler)(controllers_1.AuthController.login));
/**
 * @route   GET /api/auth/me
 * @desc    Get current user profile
 * @access  Private
 */
router.get('/me', middleware_1.authenticate, (0, middleware_1.asyncHandler)(controllers_1.AuthController.getProfile));
/**
 * @route   PUT /api/auth/me
 * @desc    Update current user profile
 * @access  Private
 */
router.put('/me', middleware_1.authenticate, (0, middleware_1.asyncHandler)(controllers_1.AuthController.updateProfile));
/**
 * @route   POST /api/auth/change-password
 * @desc    Change user password
 * @access  Private
 */
router.post('/change-password', middleware_1.authenticate, (0, middleware_1.asyncHandler)(controllers_1.AuthController.changePassword));
exports.default = router;
//# sourceMappingURL=auth.routes.js.map