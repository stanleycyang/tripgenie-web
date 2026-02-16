"use strict";
/**
 * JWT Authentication Middleware
 * Validates Bearer tokens and attaches user info to requests
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.decodeToken = exports.generateToken = exports.optionalAuth = exports.authenticate = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const env_1 = require("../config/env");
const logger_1 = require("../config/logger");
const types_1 = require("../types");
/**
 * Verify JWT token and attach user payload to request
 */
const authenticate = (req, _res, next) => {
    try {
        // Get token from Authorization header
        const authHeader = req.headers.authorization;
        if (!authHeader) {
            throw new types_1.UnauthorizedError('No authorization header provided');
        }
        // Check Bearer format
        const parts = authHeader.split(' ');
        if (parts.length !== 2 || parts[0] !== 'Bearer') {
            throw new types_1.UnauthorizedError('Invalid authorization header format. Use: Bearer <token>');
        }
        const token = parts[1];
        if (!token) {
            throw new types_1.UnauthorizedError('No token provided');
        }
        // Verify token
        const decoded = jsonwebtoken_1.default.verify(token, env_1.env.JWT_SECRET);
        // Attach user info to request
        req.user = {
            userId: decoded.userId,
            email: decoded.email,
        };
        logger_1.authLogger.debug({ userId: decoded.userId }, 'User authenticated');
        next();
    }
    catch (error) {
        if (error instanceof jsonwebtoken_1.default.JsonWebTokenError) {
            next(new types_1.UnauthorizedError('Invalid token'));
        }
        else if (error instanceof jsonwebtoken_1.default.TokenExpiredError) {
            next(new types_1.UnauthorizedError('Token has expired'));
        }
        else {
            next(error);
        }
    }
};
exports.authenticate = authenticate;
/**
 * Optional authentication - doesn't fail if no token
 * Useful for routes that work differently for authenticated vs anonymous users
 */
const optionalAuth = (req, _res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader) {
            return next();
        }
        const parts = authHeader.split(' ');
        if (parts.length !== 2 || parts[0] !== 'Bearer' || !parts[1]) {
            return next();
        }
        const token = parts[1];
        const decoded = jsonwebtoken_1.default.verify(token, env_1.env.JWT_SECRET);
        req.user = {
            userId: decoded.userId,
            email: decoded.email,
        };
        next();
    }
    catch {
        // Invalid token in optional auth - just continue without user
        next();
    }
};
exports.optionalAuth = optionalAuth;
/**
 * Generate JWT token for a user
 */
const generateToken = (userId, email) => {
    const payload = {
        userId,
        email,
    };
    return jsonwebtoken_1.default.sign(payload, env_1.env.JWT_SECRET, {
        expiresIn: env_1.env.JWT_EXPIRES_IN,
    });
};
exports.generateToken = generateToken;
/**
 * Decode token without verification (for debugging)
 */
const decodeToken = (token) => {
    try {
        return jsonwebtoken_1.default.decode(token);
    }
    catch {
        return null;
    }
};
exports.decodeToken = decodeToken;
//# sourceMappingURL=auth.js.map