"use strict";
/**
 * Trip Service
 * Handles all trip-related business logic
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTripStats = exports.getUpcomingTrips = exports.updateTripStatus = exports.deleteTrip = exports.updateTrip = exports.getUserTrips = exports.getTripById = exports.createTrip = void 0;
const models_1 = require("../models");
const logger_1 = require("../config/logger");
const types_1 = require("../types");
/**
 * Create a new trip
 */
const createTrip = async (userId, input) => {
    const trip = await models_1.TripModel.create(userId, input);
    logger_1.logger.info({ tripId: trip.id, userId, destination: trip.destination }, 'New trip created');
    return trip;
};
exports.createTrip = createTrip;
/**
 * Get trip by ID (with ownership verification)
 */
const getTripById = async (tripId, userId) => {
    const trip = await models_1.TripModel.findByIdAndUser(tripId, userId);
    if (!trip) {
        throw new types_1.NotFoundError('Trip');
    }
    return trip;
};
exports.getTripById = getTripById;
/**
 * Get all trips for a user with pagination and filters
 */
const getUserTrips = async (userId, query) => {
    const { page, limit, status, destination } = query;
    const { trips, total } = await models_1.TripModel.findByUser(userId, {
        status,
        destination,
        page,
        limit,
    });
    const totalPages = Math.ceil(total / limit);
    return {
        success: true,
        data: trips,
        pagination: {
            page,
            limit,
            total,
            totalPages,
        },
    };
};
exports.getUserTrips = getUserTrips;
/**
 * Update a trip
 */
const updateTrip = async (tripId, userId, input) => {
    // Check trip exists and belongs to user
    const existingTrip = await models_1.TripModel.findByIdAndUser(tripId, userId);
    if (!existingTrip) {
        throw new types_1.NotFoundError('Trip');
    }
    // Validate date changes if both dates are provided
    if (input.start_date && input.end_date) {
        const startDate = new Date(input.start_date);
        const endDate = new Date(input.end_date);
        if (endDate < startDate) {
            throw new types_1.ForbiddenError('End date must be on or after start date');
        }
    }
    // If only start_date is provided, check against existing end_date
    if (input.start_date && !input.end_date) {
        const newStart = new Date(input.start_date);
        if (newStart > existingTrip.end_date) {
            throw new types_1.ForbiddenError('Start date cannot be after end date');
        }
    }
    // If only end_date is provided, check against existing start_date
    if (input.end_date && !input.start_date) {
        const newEnd = new Date(input.end_date);
        if (newEnd < existingTrip.start_date) {
            throw new types_1.ForbiddenError('End date cannot be before start date');
        }
    }
    const updatedTrip = await models_1.TripModel.update(tripId, userId, input);
    if (!updatedTrip) {
        throw new types_1.NotFoundError('Trip');
    }
    logger_1.logger.info({ tripId, userId }, 'Trip updated');
    return updatedTrip;
};
exports.updateTrip = updateTrip;
/**
 * Delete a trip
 */
const deleteTrip = async (tripId, userId) => {
    const deleted = await models_1.TripModel.deleteTrip(tripId, userId);
    if (!deleted) {
        throw new types_1.NotFoundError('Trip');
    }
    logger_1.logger.info({ tripId, userId }, 'Trip deleted');
};
exports.deleteTrip = deleteTrip;
/**
 * Update trip status
 */
const updateTripStatus = async (tripId, userId, status) => {
    return (0, exports.updateTrip)(tripId, userId, { status });
};
exports.updateTripStatus = updateTripStatus;
/**
 * Get upcoming trips for a user
 */
const getUpcomingTrips = async (userId, limit = 5) => {
    return models_1.TripModel.findUpcoming(userId, limit);
};
exports.getUpcomingTrips = getUpcomingTrips;
/**
 * Get trip statistics for a user
 */
const getTripStats = async (userId) => {
    const total = await models_1.TripModel.countByUser(userId);
    const { trips: upcomingTrips } = await models_1.TripModel.findByUser(userId, {
        status: 'booked',
        limit: 1000,
    });
    const { trips: completedTrips } = await models_1.TripModel.findByUser(userId, {
        status: 'completed',
        limit: 1000,
    });
    return {
        total,
        upcoming: upcomingTrips.length,
        completed: completedTrips.length,
    };
};
exports.getTripStats = getTripStats;
//# sourceMappingURL=trip.service.js.map