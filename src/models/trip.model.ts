/**
 * Trip Model
 * Handles all trip-related database operations
 */

import { query } from '../config/database';
import { Trip, TripStatus, CreateTripInput, UpdateTripInput } from '../types';

interface TripRow {
  id: string;
  user_id: string;
  destination: string;
  start_date: Date;
  end_date: Date;
  budget: string | null; // PostgreSQL DECIMAL comes as string
  status: TripStatus;
  created_at: Date;
  updated_at: Date;
}

/**
 * Convert database row to Trip object
 */
const rowToTrip = (row: TripRow): Trip => ({
  id: row.id,
  user_id: row.user_id,
  destination: row.destination,
  start_date: row.start_date,
  end_date: row.end_date,
  budget: row.budget ? parseFloat(row.budget) : null,
  status: row.status,
  created_at: row.created_at,
  updated_at: row.updated_at,
});

/**
 * Find trip by ID
 */
export const findById = async (id: string): Promise<Trip | null> => {
  const result = await query<TripRow>('SELECT * FROM trips WHERE id = $1', [id]);
  const row = result.rows[0];
  return row ? rowToTrip(row) : null;
};

/**
 * Find trip by ID and verify user ownership
 */
export const findByIdAndUser = async (id: string, userId: string): Promise<Trip | null> => {
  const result = await query<TripRow>(
    'SELECT * FROM trips WHERE id = $1 AND user_id = $2',
    [id, userId]
  );
  const row = result.rows[0];
  return row ? rowToTrip(row) : null;
};

/**
 * Find all trips for a user with optional filters
 */
export const findByUser = async (
  userId: string,
  options: {
    status?: TripStatus;
    destination?: string;
    page?: number;
    limit?: number;
  } = {}
): Promise<{ trips: Trip[]; total: number }> => {
  const { status, destination, page = 1, limit = 10 } = options;
  const offset = (page - 1) * limit;

  // Build WHERE clause
  const conditions: string[] = ['user_id = $1'];
  const values: unknown[] = [userId];
  let paramCount = 2;

  if (status) {
    conditions.push(`status = $${paramCount++}`);
    values.push(status);
  }

  if (destination) {
    conditions.push(`destination ILIKE $${paramCount++}`);
    values.push(`%${destination}%`);
  }

  const whereClause = conditions.join(' AND ');

  // Get total count
  const countResult = await query<{ count: string }>(
    `SELECT COUNT(*) FROM trips WHERE ${whereClause}`,
    values
  );
  const total = parseInt(countResult.rows[0]?.count ?? '0', 10);

  // Get trips with pagination
  values.push(limit, offset);
  const result = await query<TripRow>(
    `SELECT * FROM trips 
     WHERE ${whereClause}
     ORDER BY start_date DESC, created_at DESC
     LIMIT $${paramCount++} OFFSET $${paramCount}`,
    values
  );

  return {
    trips: result.rows.map(rowToTrip),
    total,
  };
};

/**
 * Create a new trip
 */
export const create = async (userId: string, data: CreateTripInput): Promise<Trip> => {
  const result = await query<TripRow>(
    `INSERT INTO trips (user_id, destination, start_date, end_date, budget, status)
     VALUES ($1, $2, $3, $4, $5, $6)
     RETURNING *`,
    [
      userId,
      data.destination,
      data.start_date,
      data.end_date,
      data.budget ?? null,
      data.status ?? 'draft',
    ]
  );

  const row = result.rows[0];
  if (!row) {
    throw new Error('Failed to create trip');
  }

  return rowToTrip(row);
};

/**
 * Update a trip
 */
export const update = async (
  id: string,
  userId: string,
  data: UpdateTripInput
): Promise<Trip | null> => {
  const updates: string[] = [];
  const values: unknown[] = [];
  let paramCount = 1;

  if (data.destination !== undefined) {
    updates.push(`destination = $${paramCount++}`);
    values.push(data.destination);
  }

  if (data.start_date !== undefined) {
    updates.push(`start_date = $${paramCount++}`);
    values.push(data.start_date);
  }

  if (data.end_date !== undefined) {
    updates.push(`end_date = $${paramCount++}`);
    values.push(data.end_date);
  }

  if (data.budget !== undefined) {
    updates.push(`budget = $${paramCount++}`);
    values.push(data.budget);
  }

  if (data.status !== undefined) {
    updates.push(`status = $${paramCount++}`);
    values.push(data.status);
  }

  if (updates.length === 0) {
    return findByIdAndUser(id, userId);
  }

  values.push(id, userId);

  const result = await query<TripRow>(
    `UPDATE trips 
     SET ${updates.join(', ')} 
     WHERE id = $${paramCount++} AND user_id = $${paramCount}
     RETURNING *`,
    values
  );

  const row = result.rows[0];
  return row ? rowToTrip(row) : null;
};

/**
 * Delete a trip
 */
export const deleteTrip = async (id: string, userId: string): Promise<boolean> => {
  const result = await query(
    'DELETE FROM trips WHERE id = $1 AND user_id = $2',
    [id, userId]
  );
  return (result.rowCount ?? 0) > 0;
};

/**
 * Get trip count for a user
 */
export const countByUser = async (userId: string): Promise<number> => {
  const result = await query<{ count: string }>(
    'SELECT COUNT(*) FROM trips WHERE user_id = $1',
    [userId]
  );
  return parseInt(result.rows[0]?.count ?? '0', 10);
};

/**
 * Get upcoming trips for a user
 */
export const findUpcoming = async (userId: string, limit: number = 5): Promise<Trip[]> => {
  const result = await query<TripRow>(
    `SELECT * FROM trips 
     WHERE user_id = $1 
       AND start_date >= CURRENT_DATE
       AND status NOT IN ('completed', 'cancelled')
     ORDER BY start_date ASC
     LIMIT $2`,
    [userId, limit]
  );
  return result.rows.map(rowToTrip);
};
