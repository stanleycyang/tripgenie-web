/**
 * Trip Controller
 * Handles trip-related HTTP endpoints
 */

import { Response } from 'express';
import { TripService } from '../services';
import { AuthenticatedRequest, ApiResponse, Trip } from '../types';
import { CreateTripInput, UpdateTripInput, TripQuery } from '../utils/validation';

/**
 * GET /api/trips
 * List all trips for the authenticated user
 */
export const listTrips = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  const userId = req.user?.userId;

  if (!userId) {
    res.status(401).json({ success: false, error: 'Unauthorized' });
    return;
  }

  const query = req.query as unknown as TripQuery;

  const result = await TripService.getUserTrips(userId, query);

  res.status(200).json(result);
};

/**
 * POST /api/trips
 * Create a new trip
 */
export const createTrip = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  const userId = req.user?.userId;

  if (!userId) {
    res.status(401).json({ success: false, error: 'Unauthorized' });
    return;
  }

  const input = req.body as CreateTripInput;

  const trip = await TripService.createTrip(userId, input);

  const response: ApiResponse<Trip> = {
    success: true,
    message: 'Trip created successfully',
    data: trip,
  };

  res.status(201).json(response);
};

/**
 * GET /api/trips/:id
 * Get a specific trip by ID
 */
export const getTrip = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
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

  const trip = await TripService.getTripById(id, userId);

  const response: ApiResponse<Trip> = {
    success: true,
    data: trip,
  };

  res.status(200).json(response);
};

/**
 * PUT /api/trips/:id
 * Update a trip
 */
export const updateTrip = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
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

  const input = req.body as UpdateTripInput;

  const trip = await TripService.updateTrip(id, userId, input);

  const response: ApiResponse<Trip> = {
    success: true,
    message: 'Trip updated successfully',
    data: trip,
  };

  res.status(200).json(response);
};

/**
 * DELETE /api/trips/:id
 * Delete a trip
 */
export const deleteTrip = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
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

  await TripService.deleteTrip(id, userId);

  const response: ApiResponse<null> = {
    success: true,
    message: 'Trip deleted successfully',
  };

  res.status(200).json(response);
};

/**
 * GET /api/trips/upcoming
 * Get upcoming trips for the user
 */
export const getUpcomingTrips = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  const userId = req.user?.userId;

  if (!userId) {
    res.status(401).json({ success: false, error: 'Unauthorized' });
    return;
  }

  const limit = parseInt(req.query.limit as string) || 5;

  const trips = await TripService.getUpcomingTrips(userId, limit);

  const response: ApiResponse<Trip[]> = {
    success: true,
    data: trips,
  };

  res.status(200).json(response);
};

/**
 * GET /api/trips/stats
 * Get trip statistics for the user
 */
export const getTripStats = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  const userId = req.user?.userId;

  if (!userId) {
    res.status(401).json({ success: false, error: 'Unauthorized' });
    return;
  }

  const stats = await TripService.getTripStats(userId);

  const response: ApiResponse<{ total: number; upcoming: number; completed: number }> = {
    success: true,
    data: stats,
  };

  res.status(200).json(response);
};
