/**
 * Trip Service
 * Handles all trip-related business logic
 */

import { TripModel } from '../models';
import { logger } from '../config/logger';
import { Trip, TripStatus, NotFoundError, ForbiddenError, PaginatedResponse } from '../types';
import { CreateTripInput, UpdateTripInput, TripQuery } from '../utils/validation';

/**
 * Create a new trip
 */
export const createTrip = async (userId: string, input: CreateTripInput): Promise<Trip> => {
  const trip = await TripModel.create(userId, input);

  logger.info(
    { tripId: trip.id, userId, destination: trip.destination },
    'New trip created'
  );

  return trip;
};

/**
 * Get trip by ID (with ownership verification)
 */
export const getTripById = async (tripId: string, userId: string): Promise<Trip> => {
  const trip = await TripModel.findByIdAndUser(tripId, userId);

  if (!trip) {
    throw new NotFoundError('Trip');
  }

  return trip;
};

/**
 * Get all trips for a user with pagination and filters
 */
export const getUserTrips = async (
  userId: string,
  query: TripQuery
): Promise<PaginatedResponse<Trip>> => {
  const { page, limit, status, destination } = query;

  const { trips, total } = await TripModel.findByUser(userId, {
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

/**
 * Update a trip
 */
export const updateTrip = async (
  tripId: string,
  userId: string,
  input: UpdateTripInput
): Promise<Trip> => {
  // Check trip exists and belongs to user
  const existingTrip = await TripModel.findByIdAndUser(tripId, userId);

  if (!existingTrip) {
    throw new NotFoundError('Trip');
  }

  // Validate date changes if both dates are provided
  if (input.start_date && input.end_date) {
    const startDate = new Date(input.start_date);
    const endDate = new Date(input.end_date);
    if (endDate < startDate) {
      throw new ForbiddenError('End date must be on or after start date');
    }
  }

  // If only start_date is provided, check against existing end_date
  if (input.start_date && !input.end_date) {
    const newStart = new Date(input.start_date);
    if (newStart > existingTrip.end_date) {
      throw new ForbiddenError('Start date cannot be after end date');
    }
  }

  // If only end_date is provided, check against existing start_date
  if (input.end_date && !input.start_date) {
    const newEnd = new Date(input.end_date);
    if (newEnd < existingTrip.start_date) {
      throw new ForbiddenError('End date cannot be before start date');
    }
  }

  const updatedTrip = await TripModel.update(tripId, userId, input);

  if (!updatedTrip) {
    throw new NotFoundError('Trip');
  }

  logger.info({ tripId, userId }, 'Trip updated');

  return updatedTrip;
};

/**
 * Delete a trip
 */
export const deleteTrip = async (tripId: string, userId: string): Promise<void> => {
  const deleted = await TripModel.deleteTrip(tripId, userId);

  if (!deleted) {
    throw new NotFoundError('Trip');
  }

  logger.info({ tripId, userId }, 'Trip deleted');
};

/**
 * Update trip status
 */
export const updateTripStatus = async (
  tripId: string,
  userId: string,
  status: TripStatus
): Promise<Trip> => {
  return updateTrip(tripId, userId, { status } as UpdateTripInput);
};

/**
 * Get upcoming trips for a user
 */
export const getUpcomingTrips = async (userId: string, limit: number = 5): Promise<Trip[]> => {
  return TripModel.findUpcoming(userId, limit);
};

/**
 * Get trip statistics for a user
 */
export const getTripStats = async (
  userId: string
): Promise<{
  total: number;
  upcoming: number;
  completed: number;
}> => {
  const total = await TripModel.countByUser(userId);

  const { trips: upcomingTrips } = await TripModel.findByUser(userId, {
    status: 'booked',
    limit: 1000,
  });

  const { trips: completedTrips } = await TripModel.findByUser(userId, {
    status: 'completed',
    limit: 1000,
  });

  return {
    total,
    upcoming: upcomingTrips.length,
    completed: completedTrips.length,
  };
};
