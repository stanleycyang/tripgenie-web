/**
 * Trip Controller
 * Handles trip-related HTTP endpoints
 */
import { Response } from 'express';
import { AuthenticatedRequest } from '../types';
/**
 * GET /api/trips
 * List all trips for the authenticated user
 */
export declare const listTrips: (req: AuthenticatedRequest, res: Response) => Promise<void>;
/**
 * POST /api/trips
 * Create a new trip
 */
export declare const createTrip: (req: AuthenticatedRequest, res: Response) => Promise<void>;
/**
 * GET /api/trips/:id
 * Get a specific trip by ID
 */
export declare const getTrip: (req: AuthenticatedRequest, res: Response) => Promise<void>;
/**
 * PUT /api/trips/:id
 * Update a trip
 */
export declare const updateTrip: (req: AuthenticatedRequest, res: Response) => Promise<void>;
/**
 * DELETE /api/trips/:id
 * Delete a trip
 */
export declare const deleteTrip: (req: AuthenticatedRequest, res: Response) => Promise<void>;
/**
 * GET /api/trips/upcoming
 * Get upcoming trips for the user
 */
export declare const getUpcomingTrips: (req: AuthenticatedRequest, res: Response) => Promise<void>;
/**
 * GET /api/trips/stats
 * Get trip statistics for the user
 */
export declare const getTripStats: (req: AuthenticatedRequest, res: Response) => Promise<void>;
//# sourceMappingURL=trip.controller.d.ts.map