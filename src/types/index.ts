/**
 * Core type definitions for TripGenie backend
 */

import { Request } from 'express';

// ============================================
// User Types
// ============================================

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

// ============================================
// Trip Types
// ============================================

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
  start_date: string; // ISO date string
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

// ============================================
// Itinerary Types
// ============================================

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

// ============================================
// User Preferences Types
// ============================================

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

// ============================================
// Auth Types
// ============================================

export interface JWTPayload {
  userId: string;
  email: string;
  iat?: number;
  exp?: number;
}

export interface AuthenticatedRequest extends Request {
  user?: JWTPayload;
}

// ============================================
// API Response Types
// ============================================

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

// ============================================
// Error Types
// ============================================

export class AppError extends Error {
  public statusCode: number;
  public isOperational: boolean;

  constructor(message: string, statusCode: number = 500) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }
}

export class ValidationError extends AppError {
  public errors: Record<string, string[]>;

  constructor(errors: Record<string, string[]>) {
    super('Validation failed', 400);
    this.errors = errors;
  }
}

export class NotFoundError extends AppError {
  constructor(resource: string) {
    super(`${resource} not found`, 404);
  }
}

export class UnauthorizedError extends AppError {
  constructor(message: string = 'Unauthorized') {
    super(message, 401);
  }
}

export class ForbiddenError extends AppError {
  constructor(message: string = 'Forbidden') {
    super(message, 403);
  }
}
