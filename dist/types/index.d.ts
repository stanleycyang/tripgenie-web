/**
 * Core type definitions for TripGenie backend
 */
import { Request } from 'express';
export interface User {
    id: string;
    email: string;
    name: string;
    password_hash: string;
    created_at: Date;
    updated_at: Date;
}
export type UserPublic = Omit<User, 'password_hash'>;
export interface CreateUserInput {
    email: string;
    name: string;
    password: string;
}
export interface LoginInput {
    email: string;
    password: string;
}
export type TripStatus = 'draft' | 'planning' | 'booked' | 'in_progress' | 'completed' | 'cancelled';
export interface Trip {
    id: string;
    user_id: string;
    destination: string;
    start_date: Date;
    end_date: Date;
    budget: number | null;
    status: TripStatus;
    created_at: Date;
    updated_at: Date;
}
export interface CreateTripInput {
    destination: string;
    start_date: string;
    end_date: string;
    budget?: number;
    status?: TripStatus;
}
export interface UpdateTripInput {
    destination?: string;
    start_date?: string;
    end_date?: string;
    budget?: number;
    status?: TripStatus;
}
export interface Activity {
    time: string;
    title: string;
    description: string;
    location?: string;
    duration_minutes?: number;
    cost?: number;
    category?: string;
}
export interface Itinerary {
    id: string;
    trip_id: string;
    day_number: number;
    activities: Activity[];
    notes: string | null;
    created_at: Date;
    updated_at: Date;
}
export interface CreateItineraryInput {
    trip_id: string;
    day_number: number;
    activities: Activity[];
    notes?: string;
}
export type TravelStyle = 'budget' | 'mid_range' | 'luxury' | 'backpacker' | 'business';
export interface Preferences {
    id: string;
    user_id: string;
    interests: string[];
    travel_style: TravelStyle | null;
    dietary_restrictions: string[];
    created_at: Date;
    updated_at: Date;
}
export interface UpdatePreferencesInput {
    interests?: string[];
    travel_style?: TravelStyle;
    dietary_restrictions?: string[];
}
export interface JWTPayload {
    userId: string;
    email: string;
    iat?: number;
    exp?: number;
}
export interface AuthenticatedRequest extends Request {
    user?: JWTPayload;
}
export interface ApiResponse<T> {
    success: boolean;
    data?: T;
    error?: string;
    message?: string;
}
export interface PaginatedResponse<T> extends ApiResponse<T[]> {
    pagination: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
    };
}
export declare class AppError extends Error {
    statusCode: number;
    isOperational: boolean;
    constructor(message: string, statusCode?: number);
}
export declare class ValidationError extends AppError {
    errors: Record<string, string[]>;
    constructor(errors: Record<string, string[]>);
}
export declare class NotFoundError extends AppError {
    constructor(resource: string);
}
export declare class UnauthorizedError extends AppError {
    constructor(message?: string);
}
export declare class ForbiddenError extends AppError {
    constructor(message?: string);
}
//# sourceMappingURL=index.d.ts.map