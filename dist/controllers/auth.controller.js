"use strict";
/**
 * Auth Controller
 * Handles authentication HTTP endpoints
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.changePassword = exports.updateProfile = exports.getProfile = exports.login = exports.register = void 0;
const services_1 = require("../services");
/**
 * POST /api/auth/register
 * Register a new user
 */
const register = async (req, res) => {
    const input = req.body;
    const result = await services_1.AuthService.register(input);
    const response = {
        success: true,
        message: 'User registered successfully',
        data: result,
    };
    res.status(201).json(response);
};
exports.register = register;
/**
 * POST /api/auth/login
 * Login with email and password
 */
const login = async (req, res) => {
    const input = req.body;
    const result = await services_1.AuthService.login(input);
    const response = {
        success: true,
        message: 'Login successful',
        data: result,
    };
    res.status(200).json(response);
};
exports.login = login;
/**
 * GET /api/auth/me
 * Get current user profile (requires auth)
 */
const getProfile = async (req, res) => {
    const userId = req.user?.userId;
    if (!userId) {
        res.status(401).json({ success: false, error: 'Unauthorized' });
        return;
    }
    const user = await services_1.AuthService.getProfile(userId);
    const response = {
        success: true,
        data: user,
    };
    res.status(200).json(response);
};
exports.getProfile = getProfile;
/**
 * PUT /api/auth/me
 * Update current user profile (requires auth)
 */
const updateProfile = async (req, res) => {
    const userId = req.user?.userId;
    if (!userId) {
        res.status(401).json({ success: false, error: 'Unauthorized' });
        return;
    }
    const { name, email } = req.body;
    const user = await services_1.AuthService.updateProfile(userId, { name, email });
    const response = {
        success: true,
        message: 'Profile updated successfully',
        data: user,
    };
    res.status(200).json(response);
};
exports.updateProfile = updateProfile;
/**
 * POST /api/auth/change-password
 * Change user password (requires auth)
 */
const changePassword = async (req, res) => {
    const userId = req.user?.userId;
    if (!userId) {
        res.status(401).json({ success: false, error: 'Unauthorized' });
        return;
    }
    const { currentPassword, newPassword } = req.body;
    await services_1.AuthService.changePassword(userId, currentPassword, newPassword);
    const response = {
        success: true,
        message: 'Password changed successfully',
    };
    res.status(200).json(response);
};
exports.changePassword = changePassword;
//# sourceMappingURL=auth.controller.js.map