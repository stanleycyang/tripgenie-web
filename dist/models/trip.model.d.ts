/**
 * Trip Model
 * Handles all trip-related database operations
 */
import { Trip, TripStatus, CreateTripInput, UpdateTripInput } from '../types';
/**
 * Find trip by ID
 */
export declare const findById: (id: string) => Promise<Trip | null>;
/**
 * Find trip by ID and verify user ownership
 */
export declare const findByIdAndUser: (id: string, userId: string) => Promise<Trip | null>;
/**
 * Find all trips for a user with optional filters
 */
export declare const findByUser: (userId: string, options?: {
    status?: TripStatus;
    destination?: string;
    page?: number;
    limit?: number;
}) => Promise<{
    trips: Trip[];
    total: number;
}>;
/**
 * Create a new trip
 */
export declare const create: (userId: string, data: CreateTripInput) => Promise<Trip>;
/**
 * Update a trip
 */
export declare const update: (id: string, userId: string, data: UpdateTripInput) => Promise<Trip | null>;
/**
 * Delete a trip
 */
export declare const deleteTrip: (id: string, userId: string) => Promise<boolean>;
/**
 * Get trip count for a user
 */
export declare const countByUser: (userId: string) => Promise<number>;
/**
 * Get upcoming trips for a user
 */
export declare const findUpcoming: (userId: string, limit?: number) => Promise<Trip[]>;
//# sourceMappingURL=trip.model.d.ts.map