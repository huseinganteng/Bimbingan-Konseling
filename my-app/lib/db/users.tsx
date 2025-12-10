//----File ini untuk operasi database pada tabel users (CRUD: Buat, Baca, Update, Hapus), mencari user, dan validasi data user----\\
// ============================================
// USER DATABASE OPERATIONS
// Helper functions untuk CRUD operations pada tabel users
// ============================================

import { query, queryOne, execute } from './mysql';
import type { User, UserCreate, UserUpdate } from '../types/database';

// Get user by ID
export async function getUserById(id: number): Promise<User | null> {
  return queryOne<User>(
    `SELECT * FROM users WHERE id = ? AND deleted_at IS NULL`,
    [id]
  );
}

// Get user by username, email, or nisn
export async function getUserByIdentifier(
  identifier: string,
  role?: string
): Promise<User | null> {
  // Pastikan identifier adalah string
  const searchIdentifier = String(identifier).trim();
  
  let sql = `
    SELECT * FROM users 
    WHERE (username = ? OR email = ? OR CAST(nisn AS CHAR) = ?) 
      AND is_active = 1 
      AND deleted_at IS NULL
  `;
  const params: any[] = [searchIdentifier, searchIdentifier, searchIdentifier];

  if (role) {
    sql += ` AND role = ?`;
    params.push(role);
  }

  sql += ` LIMIT 1`;

  // Debug logging
  console.log('getUserByIdentifier query:', { 
    identifier: searchIdentifier, 
    role, 
    sql: sql.substring(0, 200), 
    params 
  });

  try {
    const result = await queryOne<User>(sql, params);
    console.log('getUserByIdentifier result:', result ? { 
      id: result.id, 
      username: result.username,
      email: result.email, 
      nisn: result.nisn,
      role: result.role,
      is_active: result.is_active,
      hasPassword: !!result.password_hash
    } : null);
    
    return result;
  } catch (error: any) {
    console.error('getUserByIdentifier error:', error);
    throw error;
  }
}

// Get all users
export async function getAllUsers(
  role?: string,
  isActive?: boolean
): Promise<User[]> {
  let sql = `SELECT * FROM users WHERE deleted_at IS NULL`;
  const params: any[] = [];

  if (role) {
    sql += ` AND role = ?`;
    params.push(role);
  }

  if (isActive !== undefined) {
    sql += ` AND is_active = ?`;
    params.push(isActive);
  }

  sql += ` ORDER BY created_at DESC`;

  return query<User>(sql, params);
}

// Get all siswa
export async function getAllSiswa(
  kelas?: string,
  jurusan?: string
): Promise<User[]> {
  let sql = `SELECT * FROM users WHERE role = 'siswa' AND deleted_at IS NULL`;
  const params: any[] = [];

  if (kelas) {
    sql += ` AND kelas = ?`;
    params.push(kelas);
  }

  if (jurusan) {
    sql += ` AND jurusan = ?`;
    params.push(jurusan);
  }

  sql += ` ORDER BY nama_lengkap ASC`;

  return query<User>(sql, params);
}

// Create new user
export async function createUser(userData: UserCreate): Promise<number> {
  const fields = Object.keys(userData).join(', ');
  const placeholders = Object.keys(userData).map(() => '?').join(', ');
  const values = Object.values(userData);

  const result = await execute(
    `INSERT INTO users (${fields}) VALUES (${placeholders})`,
    values
  );

  return result.insertId;
}

// Update user
export async function updateUser(
  id: number,
  userData: UserUpdate
): Promise<boolean> {
  const fields = Object.keys(userData)
    .map((key) => `${key} = ?`)
    .join(', ');
  const values = Object.values(userData);

  if (fields.length === 0) {
    return false;
  }

  const result = await execute(
    `UPDATE users SET ${fields}, updated_at = NOW() WHERE id = ? AND deleted_at IS NULL`,
    [...values, id]
  );

  return result.affectedRows > 0;
}

// Delete user (soft delete)
export async function deleteUser(id: number): Promise<boolean> {
  const result = await execute(
    `UPDATE users SET deleted_at = NOW() WHERE id = ? AND deleted_at IS NULL`,
    [id]
  );

  return result.affectedRows > 0;
}

// Hard delete user (permanent)
export async function hardDeleteUser(id: number): Promise<boolean> {
  const result = await execute(`DELETE FROM users WHERE id = ?`, [id]);
  return result.affectedRows > 0;
}

// Update last login
export async function updateLastLogin(id: number): Promise<boolean> {
  const result = await execute(
    `UPDATE users SET last_login = NOW() WHERE id = ?`,
    [id]
  );

  return result.affectedRows > 0;
}

// Check if username exists
export async function usernameExists(username: string): Promise<boolean> {
  const user = await queryOne<User>(
    `SELECT id FROM users WHERE username = ? AND deleted_at IS NULL`,
    [username]
  );
  return user !== null;
}

// Check if email exists
export async function emailExists(email: string): Promise<boolean> {
  const user = await queryOne<User>(
    `SELECT id FROM users WHERE email = ? AND deleted_at IS NULL`,
    [email]
  );
  return user !== null;
}

// Check if nisn exists
export async function nisnExists(nisn: string): Promise<boolean> {
  const user = await queryOne<User>(
    `SELECT id FROM users WHERE nisn = ? AND deleted_at IS NULL`,
    [nisn]
  );
  return user !== null;
}

// Get user count by role
export async function getUserCountByRole(role: string): Promise<number> {
  const result = await queryOne<{ count: number }>(
    `SELECT COUNT(*) as count FROM users WHERE role = ? AND deleted_at IS NULL`,
    [role]
  );
  return result?.count || 0;
}

// Search users
export async function searchUsers(
  searchTerm: string,
  role?: string
): Promise<User[]> {
  let sql = `
    SELECT * FROM users 
    WHERE deleted_at IS NULL
      AND (
        username LIKE ? 
        OR nama_lengkap LIKE ? 
        OR email LIKE ? 
        OR nisn LIKE ?
      )
  `;
  const searchPattern = `%${searchTerm}%`;
  const params: any[] = [searchPattern, searchPattern, searchPattern, searchPattern];

  if (role) {
    sql += ` AND role = ?`;
    params.push(role);
  }

  sql += ` ORDER BY nama_lengkap ASC LIMIT 50`;

  return query<User>(sql, params);
}

