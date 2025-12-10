//----File ini untuk koneksi database MySQL, membuat connection pool, dan fungsi helper untuk query/execute SQL----\\
// ============================================
// MYSQL DATABASE CONNECTION
// Koneksi dan konfigurasi database MySQL
// ============================================

import mysql from 'mysql2/promise';

// Konfigurasi database dari environment variables
const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '3306'),
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'halo_project',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  enableKeepAlive: true,
  keepAliveInitialDelay: 0,
};

// Create connection pool
let pool: mysql.Pool | null = null;

export function getPool(): mysql.Pool {
  if (!pool) {
    // Log config untuk debugging (tanpa password)
    console.log('[DB Config]', {
      host: dbConfig.host,
      port: dbConfig.port,
      user: dbConfig.user,
      database: dbConfig.database,
      password: dbConfig.password ? '***' : '(empty)'
    });
    pool = mysql.createPool(dbConfig);
  }
  return pool;
}

// Test connection
export async function testConnection(): Promise<boolean> {
  try {
    const connection = await getPool().getConnection();
    await connection.ping();
    connection.release();
    return true;
  } catch (error) {
    console.error('Database connection error:', error);
    return false;
  }
}

// Close pool (for cleanup)
export async function closePool(): Promise<void> {
  if (pool) {
    await pool.end();
    pool = null;
  }
}

// Query helper
export async function query<T = any>(sql: string, params?: any[]): Promise<T[]> {
  const connection = await getPool().getConnection();
  try {
    // Debug: log query untuk troubleshooting
    if (process.env.NODE_ENV === 'development') {
      console.log('[DB Query]', sql.substring(0, 100), params);
    }
    const [rows] = await connection.execute(sql, params);
    return rows as T[];
  } catch (error) {
    console.error('Query error:', error);
    console.error('SQL:', sql);
    console.error('Params:', params);
    throw error;
  } finally {
    connection.release();
  }
}

// Query one helper
export async function queryOne<T = any>(sql: string, params?: any[]): Promise<T | null> {
  const results = await query<T>(sql, params);
  return results.length > 0 ? results[0] : null;
}

// Execute helper (for INSERT, UPDATE, DELETE)
export async function execute(sql: string, params?: any[]): Promise<any> {
  const connection = await getPool().getConnection();
  try {
    const [result] = await connection.execute(sql, params) as any;
    // Format result untuk kompatibilitas dengan kode yang ada
    if (result.insertId !== undefined) {
      return {
        insertId: result.insertId,
        affectedRows: result.affectedRows || 0,
      };
    }
    return {
      affectedRows: result.affectedRows || 0,
    };
  } catch (error) {
    console.error('Execute error:', error);
    throw error;
  } finally {
    connection.release();
  }
}

