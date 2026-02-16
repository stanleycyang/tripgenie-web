"use strict";
/**
 * User Model
 * Handles all user-related database operations
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.emailExists = exports.deleteUser = exports.updatePassword = exports.update = exports.create = exports.findByEmail = exports.findById = exports.toPublicUser = void 0;
const database_1 = require("../config/database");
/**
 * Convert database row to User object
 */
const rowToUser = (row) => ({
    id: row.id,
    email: row.email,
    name: row.name,
    password_hash: row.password_hash,
    created_at: row.created_at,
    updated_at: row.updated_at,
});
/**
 * Convert User to public representation (without password)
 */
const toPublicUser = (user) => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password_hash, ...publicUser } = user;
    return publicUser;
};
exports.toPublicUser = toPublicUser;
/**
 * Find user by ID
 */
const findById = async (id) => {
    const result = await (0, database_1.query)('SELECT * FROM users WHERE id = $1', [id]);
    const row = result.rows[0];
    return row ? rowToUser(row) : null;
};
exports.findById = findById;
/**
 * Find user by email
 */
const findByEmail = async (email) => {
    const result = await (0, database_1.query)('SELECT * FROM users WHERE email = $1', [email.toLowerCase()]);
    const row = result.rows[0];
    return row ? rowToUser(row) : null;
};
exports.findByEmail = findByEmail;
/**
 * Create a new user
 */
const create = async (email, name, passwordHash) => {
    const result = await (0, database_1.query)(`INSERT INTO users (email, name, password_hash)
     VALUES ($1, $2, $3)
     RETURNING *`, [email.toLowerCase(), name, passwordHash]);
    const row = result.rows[0];
    if (!row) {
        throw new Error('Failed to create user');
    }
    return rowToUser(row);
};
exports.create = create;
/**
 * Update user details
 */
const update = async (id, data) => {
    const updates = [];
    const values = [];
    let paramCount = 1;
    if (data.email !== undefined) {
        updates.push(`email = $${paramCount++}`);
        values.push(data.email.toLowerCase());
    }
    if (data.name !== undefined) {
        updates.push(`name = $${paramCount++}`);
        values.push(data.name);
    }
    if (updates.length === 0) {
        return (0, exports.findById)(id);
    }
    values.push(id);
    const result = await (0, database_1.query)(`UPDATE users SET ${updates.join(', ')} WHERE id = $${paramCount} RETURNING *`, values);
    const row = result.rows[0];
    return row ? rowToUser(row) : null;
};
exports.update = update;
/**
 * Update user password
 */
const updatePassword = async (id, passwordHash) => {
    const result = await (0, database_1.query)('UPDATE users SET password_hash = $1 WHERE id = $2', [
        passwordHash,
        id,
    ]);
    return (result.rowCount ?? 0) > 0;
};
exports.updatePassword = updatePassword;
/**
 * Delete user
 */
const deleteUser = async (id) => {
    const result = await (0, database_1.query)('DELETE FROM users WHERE id = $1', [id]);
    return (result.rowCount ?? 0) > 0;
};
exports.deleteUser = deleteUser;
/**
 * Check if email exists
 */
const emailExists = async (email) => {
    const result = await (0, database_1.query)('SELECT 1 FROM users WHERE email = $1', [email.toLowerCase()]);
    return (result.rowCount ?? 0) > 0;
};
exports.emailExists = emailExists;
//# sourceMappingURL=user.model.js.map