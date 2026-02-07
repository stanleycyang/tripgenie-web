/**
 * User Model
 * Handles all user-related database operations
 */

import { query } from '../config/database';
import { User, UserPublic } from '../types';

interface UserRow {
  id: string;
  email: string;
  name: string;
  password_hash: string;
  created_at: Date;
  updated_at: Date;
}

/**
 * Convert database row to User object
 */
const rowToUser = (row: UserRow): User => ({
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
export const toPublicUser = (user: User): UserPublic => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { password_hash, ...publicUser } = user;
  return publicUser;
};

/**
 * Find user by ID
 */
export const findById = async (id: string): Promise<User | null> => {
  const result = await query<UserRow>('SELECT * FROM users WHERE id = $1', [id]);
  const row = result.rows[0];
  return row ? rowToUser(row) : null;
};

/**
 * Find user by email
 */
export const findByEmail = async (email: string): Promise<User | null> => {
  const result = await query<UserRow>('SELECT * FROM users WHERE email = $1', [email.toLowerCase()]);
  const row = result.rows[0];
  return row ? rowToUser(row) : null;
};

/**
 * Create a new user
 */
export const create = async (
  email: string,
  name: string,
  passwordHash: string
): Promise<User> => {
  const result = await query<UserRow>(
    `INSERT INTO users (email, name, password_hash)
     VALUES ($1, $2, $3)
     RETURNING *`,
    [email.toLowerCase(), name, passwordHash]
  );

  const row = result.rows[0];
  if (!row) {
    throw new Error('Failed to create user');
  }

  return rowToUser(row);
};

/**
 * Update user details
 */
export const update = async (
  id: string,
  data: Partial<Pick<User, 'email' | 'name'>>
): Promise<User | null> => {
  const updates: string[] = [];
  const values: unknown[] = [];
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
    return findById(id);
  }

  values.push(id);

  const result = await query<UserRow>(
    `UPDATE users SET ${updates.join(', ')} WHERE id = $${paramCount} RETURNING *`,
    values
  );

  const row = result.rows[0];
  return row ? rowToUser(row) : null;
};

/**
 * Update user password
 */
export const updatePassword = async (id: string, passwordHash: string): Promise<boolean> => {
  const result = await query('UPDATE users SET password_hash = $1 WHERE id = $2', [
    passwordHash,
    id,
  ]);
  return (result.rowCount ?? 0) > 0;
};

/**
 * Delete user
 */
export const deleteUser = async (id: string): Promise<boolean> => {
  const result = await query('DELETE FROM users WHERE id = $1', [id]);
  return (result.rowCount ?? 0) > 0;
};

/**
 * Check if email exists
 */
export const emailExists = async (email: string): Promise<boolean> => {
  const result = await query('SELECT 1 FROM users WHERE email = $1', [email.toLowerCase()]);
  return (result.rowCount ?? 0) > 0;
};
