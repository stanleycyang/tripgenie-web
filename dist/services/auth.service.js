"use strict";
/**
 * Authentication Service
 * Handles user registration, login, and password management
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validatePasswordStrength = exports.changePassword = exports.updateProfile = exports.getProfile = exports.login = exports.register = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const models_1 = require("../models");
const auth_1 = require("../middleware/auth");
const env_1 = require("../config/env");
const logger_1 = require("../config/logger");
const types_1 = require("../types");
/**
 * Register a new user
 */
const register = async (input) => {
    const { email, name, password } = input;
    // Check if email already exists
    const existingUser = await models_1.UserModel.findByEmail(email);
    if (existingUser) {
        throw new types_1.AppError('Email already registered', 409);
    }
    // Hash password
    const passwordHash = await bcrypt_1.default.hash(password, env_1.env.BCRYPT_SALT_ROUNDS);
    // Create user
    const user = await models_1.UserModel.create(email, name, passwordHash);
    logger_1.authLogger.info({ userId: user.id, email: user.email }, 'New user registered');
    // Generate token
    const token = (0, auth_1.generateToken)(user.id, user.email);
    return {
        user: models_1.UserModel.toPublicUser(user),
        token,
    };
};
exports.register = register;
/**
 * Login user with email and password
 */
const login = async (input) => {
    const { email, password } = input;
    // Find user by email
    const user = await models_1.UserModel.findByEmail(email);
    if (!user) {
        // Use generic message to prevent email enumeration
        throw new types_1.UnauthorizedError('Invalid email or password');
    }
    // Verify password
    const isValidPassword = await bcrypt_1.default.compare(password, user.password_hash);
    if (!isValidPassword) {
        logger_1.authLogger.warn({ email }, 'Failed login attempt');
        throw new types_1.UnauthorizedError('Invalid email or password');
    }
    logger_1.authLogger.info({ userId: user.id }, 'User logged in');
    // Generate token
    const token = (0, auth_1.generateToken)(user.id, user.email);
    return {
        user: models_1.UserModel.toPublicUser(user),
        token,
    };
};
exports.login = login;
/**
 * Get current user profile
 */
const getProfile = async (userId) => {
    const user = await models_1.UserModel.findById(userId);
    if (!user) {
        throw new types_1.AppError('User not found', 404);
    }
    return models_1.UserModel.toPublicUser(user);
};
exports.getProfile = getProfile;
/**
 * Update user profile
 */
const updateProfile = async (userId, data) => {
    // If email is being changed, check for duplicates
    if (data.email) {
        const existingUser = await models_1.UserModel.findByEmail(data.email);
        if (existingUser && existingUser.id !== userId) {
            throw new types_1.AppError('Email already in use', 409);
        }
    }
    const user = await models_1.UserModel.update(userId, data);
    if (!user) {
        throw new types_1.AppError('User not found', 404);
    }
    logger_1.authLogger.info({ userId }, 'User profile updated');
    return models_1.UserModel.toPublicUser(user);
};
exports.updateProfile = updateProfile;
/**
 * Change user password
 */
const changePassword = async (userId, currentPassword, newPassword) => {
    const user = await models_1.UserModel.findById(userId);
    if (!user) {
        throw new types_1.AppError('User not found', 404);
    }
    // Verify current password
    const isValidPassword = await bcrypt_1.default.compare(currentPassword, user.password_hash);
    if (!isValidPassword) {
        throw new types_1.UnauthorizedError('Current password is incorrect');
    }
    // Hash new password
    const passwordHash = await bcrypt_1.default.hash(newPassword, env_1.env.BCRYPT_SALT_ROUNDS);
    // Update password
    await models_1.UserModel.updatePassword(userId, passwordHash);
    logger_1.authLogger.info({ userId }, 'User password changed');
};
exports.changePassword = changePassword;
/**
 * Validate that a password meets requirements
 * (Useful for password change operations)
 */
const validatePasswordStrength = (password) => {
    // Minimum 8 characters, at least one uppercase, one lowercase, one number
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
    return passwordRegex.test(password);
};
exports.validatePasswordStrength = validatePasswordStrength;
//# sourceMappingURL=auth.service.js.map