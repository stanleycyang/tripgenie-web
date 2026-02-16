"use strict";
/**
 * Trip Controller
 * Handles trip-related HTTP endpoints
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTripStats = exports.getUpcomingTrips = exports.deleteTrip = exports.updateTrip = exports.getTrip = exports.createTrip = exports.listTrips = void 0;
const services_1 = require("../services");
/**
 * GET /api/trips
 * List all trips for the authenticated user
 */
const listTrips = async (req, res) => {
    const userId = req.user?.userId;
    if (!userId) {
        res.status(401).json({ success: false, error: 'Unauthorized' });
        return;
    }
    const query = req.query;
    const result = await services_1.TripService.getUserTrips(userId, query);
    res.status(200).json(result);
};
exports.listTrips = listTrips;
/**
 * POST /api/trips
 * Create a new trip
 */
const createTrip = async (req, res) => {
    const userId = req.user?.userId;
    if (!userId) {
        res.status(401).json({ success: false, error: 'Unauthorized' });
        return;
    }
    const input = req.body;
    const trip = await services_1.TripService.createTrip(userId, input);
    const response = {
        success: true,
        message: 'Trip created successfully',
        data: trip,
    };
    res.status(201).json(response);
};
exports.createTrip = createTrip;
/**
 * GET /api/trips/:id
 * Get a specific trip by ID
 */
const getTrip = async (req, res) => {
    const userId = req.user?.userId;
    if (!userId) {
        res.status(401).json({ success: false, error: 'Unauthorized' });
        return;
    }
    const { id } = req.params;
    if (!id) {
        res.status(400).json({ success: false, error: 'Trip ID is required' });
        return;
    }
    const trip = await services_1.TripService.getTripById(id, userId);
    const response = {
        success: true,
        data: trip,
    };
    res.status(200).json(response);
};
exports.getTrip = getTrip;
/**
 * PUT /api/trips/:id
 * Update a trip
 */
const updateTrip = async (req, res) => {
    const userId = req.user?.userId;
    if (!userId) {
        res.status(401).json({ success: false, error: 'Unauthorized' });
        return;
    }
    const { id } = req.params;
    if (!id) {
        res.status(400).json({ success: false, error: 'Trip ID is required' });
        return;
    }
    const input = req.body;
    const trip = await services_1.TripService.updateTrip(id, userId, input);
    const response = {
        success: true,
        message: 'Trip updated successfully',
        data: trip,
    };
    res.status(200).json(response);
};
exports.updateTrip = updateTrip;
/**
 * DELETE /api/trips/:id
 * Delete a trip
 */
const deleteTrip = async (req, res) => {
    const userId = req.user?.userId;
    if (!userId) {
        res.status(401).json({ success: false, error: 'Unauthorized' });
        return;
    }
    const { id } = req.params;
    if (!id) {
        res.status(400).json({ success: false, error: 'Trip ID is required' });
        return;
    }
    await services_1.TripService.deleteTrip(id, userId);
    const response = {
        success: true,
        message: 'Trip deleted successfully',
    };
    res.status(200).json(response);
};
exports.deleteTrip = deleteTrip;
/**
 * GET /api/trips/upcoming
 * Get upcoming trips for the user
 */
const getUpcomingTrips = async (req, res) => {
    const userId = req.user?.userId;
    if (!userId) {
        res.status(401).json({ success: false, error: 'Unauthorized' });
        return;
    }
    const limit = parseInt(req.query.limit) || 5;
    const trips = await services_1.TripService.getUpcomingTrips(userId, limit);
    const response = {
        success: true,
        data: trips,
    };
    res.status(200).json(response);
};
exports.getUpcomingTrips = getUpcomingTrips;
/**
 * GET /api/trips/stats
 * Get trip statistics for the user
 */
const getTripStats = async (req, res) => {
    const userId = req.user?.userId;
    if (!userId) {
        res.status(401).json({ success: false, error: 'Unauthorized' });
        return;
    }
    const stats = await services_1.TripService.getTripStats(userId);
    const response = {
        success: true,
        data: stats,
    };
    res.status(200).json(response);
};
exports.getTripStats = getTripStats;
//# sourceMappingURL=trip.controller.js.map