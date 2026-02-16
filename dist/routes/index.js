"use strict";
/**
 * API Routes Index
 * Combines all route modules
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_routes_1 = __importDefault(require("./auth.routes"));
const trip_routes_1 = __importDefault(require("./trip.routes"));
const router = (0, express_1.Router)();
// Health check endpoint
router.get('/health', (_req, res) => {
    res.json({
        success: true,
        message: 'TripGenie API is running',
        timestamp: new Date().toISOString(),
    });
});
// Mount route modules
router.use('/auth', auth_routes_1.default);
router.use('/trips', trip_routes_1.default);
exports.default = router;
//# sourceMappingURL=index.js.map