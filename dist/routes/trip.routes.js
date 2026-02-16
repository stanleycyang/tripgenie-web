"use strict";
/**
 * Trip Routes
 * /api/trips/*
 */
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const controllers_1 = require("../controllers");
const middleware_1 = require("../middleware");
const validation_1 = require("../utils/validation");
const router = (0, express_1.Router)();
// All trip routes require authentication
router.use(middleware_1.authenticate);
/**
 * @route   GET /api/trips
 * @desc    List all trips for the user
 * @access  Private
 * @query   page, limit, status, destination
 */
router.get('/', (0, middleware_1.validateQuery)(validation_1.tripQuerySchema), (0, middleware_1.asyncHandler)(controllers_1.TripController.listTrips));
/**
 * @route   GET /api/trips/upcoming
 * @desc    Get upcoming trips
 * @access  Private
 * @query   limit (default: 5)
 */
router.get('/upcoming', (0, middleware_1.asyncHandler)(controllers_1.TripController.getUpcomingTrips));
/**
 * @route   GET /api/trips/stats
 * @desc    Get trip statistics
 * @access  Private
 */
router.get('/stats', (0, middleware_1.asyncHandler)(controllers_1.TripController.getTripStats));
/**
 * @route   POST /api/trips
 * @desc    Create a new trip
 * @access  Private
 */
router.post('/', (0, middleware_1.validateBody)(validation_1.createTripSchema), (0, middleware_1.asyncHandler)(controllers_1.TripController.createTrip));
/**
 * @route   GET /api/trips/:id
 * @desc    Get a specific trip
 * @access  Private
 */
router.get('/:id', (0, middleware_1.asyncHandler)(controllers_1.TripController.getTrip));
/**
 * @route   PUT /api/trips/:id
 * @desc    Update a trip
 * @access  Private
 */
router.put('/:id', (0, middleware_1.validateBody)(validation_1.updateTripSchema), (0, middleware_1.asyncHandler)(controllers_1.TripController.updateTrip));
/**
 * @route   DELETE /api/trips/:id
 * @desc    Delete a trip
 * @access  Private
 */
router.delete('/:id', (0, middleware_1.asyncHandler)(controllers_1.TripController.deleteTrip));
exports.default = router;
//# sourceMappingURL=trip.routes.js.map