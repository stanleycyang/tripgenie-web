"use strict";
/**
 * Trip Model
 * Handles all trip-related database operations
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.findUpcoming = exports.countByUser = exports.deleteTrip = exports.update = exports.create = exports.findByUser = exports.findByIdAndUser = exports.findById = void 0;
const database_1 = require("../config/database");
/**
 * Convert database row to Trip object
 */
const rowToTrip = (row) => ({
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
const findById = async (id) => {
    const result = await (0, database_1.query)('SELECT * FROM trips WHERE id = $1', [id]);
    const row = result.rows[0];
    return row ? rowToTrip(row) : null;
};
exports.findById = findById;
/**
 * Find trip by ID and verify user ownership
 */
const findByIdAndUser = async (id, userId) => {
    const result = await (0, database_1.query)('SELECT * FROM trips WHERE id = $1 AND user_id = $2', [id, userId]);
    const row = result.rows[0];
    return row ? rowToTrip(row) : null;
};
exports.findByIdAndUser = findByIdAndUser;
/**
 * Find all trips for a user with optional filters
 */
const findByUser = async (userId, options = {}) => {
    const { status, destination, page = 1, limit = 10 } = options;
    const offset = (page - 1) * limit;
    // Build WHERE clause
    const conditions = ['user_id = $1'];
    const values = [userId];
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
    const countResult = await (0, database_1.query)(`SELECT COUNT(*) FROM trips WHERE ${whereClause}`, values);
    const total = parseInt(countResult.rows[0]?.count ?? '0', 10);
    // Get trips with pagination
    values.push(limit, offset);
    const result = await (0, database_1.query)(`SELECT * FROM trips 
     WHERE ${whereClause}
     ORDER BY start_date DESC, created_at DESC
     LIMIT $${paramCount++} OFFSET $${paramCount}`, values);
    return {
        trips: result.rows.map(rowToTrip),
        total,
    };
};
exports.findByUser = findByUser;
/**
 * Create a new trip
 */
const create = async (userId, data) => {
    const result = await (0, database_1.query)(`INSERT INTO trips (user_id, destination, start_date, end_date, budget, status)
     VALUES ($1, $2, $3, $4, $5, $6)
     RETURNING *`, [
        userId,
        data.destination,
        data.start_date,
        data.end_date,
        data.budget ?? null,
        data.status ?? 'draft',
    ]);
    const row = result.rows[0];
    if (!row) {
        throw new Error('Failed to create trip');
    }
    return rowToTrip(row);
};
exports.create = create;
/**
 * Update a trip
 */
const update = async (id, userId, data) => {
    const updates = [];
    const values = [];
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
        return (0, exports.findByIdAndUser)(id, userId);
    }
    values.push(id, userId);
    const result = await (0, database_1.query)(`UPDATE trips 
     SET ${updates.join(', ')} 
     WHERE id = $${paramCount++} AND user_id = $${paramCount}
     RETURNING *`, values);
    const row = result.rows[0];
    return row ? rowToTrip(row) : null;
};
exports.update = update;
/**
 * Delete a trip
 */
const deleteTrip = async (id, userId) => {
    const result = await (0, database_1.query)('DELETE FROM trips WHERE id = $1 AND user_id = $2', [id, userId]);
    return (result.rowCount ?? 0) > 0;
};
exports.deleteTrip = deleteTrip;
/**
 * Get trip count for a user
 */
const countByUser = async (userId) => {
    const result = await (0, database_1.query)('SELECT COUNT(*) FROM trips WHERE user_id = $1', [userId]);
    return parseInt(result.rows[0]?.count ?? '0', 10);
};
exports.countByUser = countByUser;
/**
 * Get upcoming trips for a user
 */
const findUpcoming = async (userId, limit = 5) => {
    const result = await (0, database_1.query)(`SELECT * FROM trips 
     WHERE user_id = $1 
       AND start_date >= CURRENT_DATE
       AND status NOT IN ('completed', 'cancelled')
     ORDER BY start_date ASC
     LIMIT $2`, [userId, limit]);
    return result.rows.map(rowToTrip);
};
exports.findUpcoming = findUpcoming;
//# sourceMappingURL=trip.model.js.map