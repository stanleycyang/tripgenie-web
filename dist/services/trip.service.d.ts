/**
 * Trip Service
 * Handles all trip-related business logic
 */
import { Trip, TripStatus, PaginatedResponse } from '../types';
import { CreateTripInput, UpdateTripInput, TripQuery } from '../utils/validation';
/**
 * Create a new trip
 */
export declare const createTrip: (userId: string, input: CreateTripInput) => Promise<Trip>;
/**
 * Get trip by ID (with ownership verification)
 */
export declare const getTripById: (tripId: string, userId: string) => Promise<Trip>;
/**
 * Get all trips for a user with pagination and filters
 */
export declare const getUserTrips: (userId: string, query: TripQuery) => Promise<PaginatedResponse<Trip>>;
/**
 * Update a trip
 */
export declare const updateTrip: (tripId: string, userId: string, input: UpdateTripInput) => Promise<Trip>;
/**
 * Delete a trip
 */
export declare const deleteTrip: (tripId: string, userId: string) => Promise<void>;
/**
 * Update trip status
 */
export declare const updateTripStatus: (tripId: string, userId: string, status: TripStatus) => Promise<Trip>;
/**
 * Get upcoming trips for a user
 */
export declare const getUpcomingTrips: (userId: string, limit?: number) => Promise<Trip[]>;
/**
 * Get trip statistics for a user
 */
export declare const getTripStats: (userId: string) => Promise<{
    total: number;
    upcoming: number;
    completed: number;
}>;
//# sourceMappingURL=trip.service.d.ts.map