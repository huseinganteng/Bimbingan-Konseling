//---File ini adalah API endpoint untuk data siswa---\\

import { NextRequest, NextResponse } from 'next/server';
import { query, execute } from '@/lib/db/mysql';
import type { User } from '@/lib/types/database';

export async function GET(request: NextRequest) {
  const jsonResponse = (data: any, status: number = 200) => {
    return new NextResponse(JSON.stringify(data), {
      status,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-store',
      },
    });
  };

  try {
    const searchParams = request.nextUrl.searchParams;
    const kelas = searchParams.get('kelas');
    const jurusan = searchParams.get('jurusan');
    const isActive = searchParams.get('is_active');

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

    if (isActive === 'true') {
      sql += ` AND is_active = 1`;
    } else if (isActive === 'false') {
      sql += ` AND is_active = 0`;
    }

    sql += ` ORDER BY nama_lengkap ASC`;

    const siswa = await query<User>(sql, params);

    return jsonResponse({
      success: true,
      data: siswa,
      count: siswa.length,
    });
  } catch (error: any) {
    console.error('Siswa API error:', error);
    return jsonResponse(
      {
        success: false,
        message: 'Terjadi kesalahan saat mengambil data siswa',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined,
      },
      500
    );
  }
}

export async function POST(request: NextRequest) {
  const jsonResponse = (data: any, status: number = 200) => {
    return new NextResponse(JSON.stringify(data), {
      status,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-store',
      },
    });
  };

  try {
    const body = await request.json();
    const { username, nisn, email, password_hash, nama_lengkap, kelas, jurusan, tahun_masuk } = body;

    if (!username || !password_hash || !nama_lengkap) {
      return jsonResponse(
        { success: false, message: 'Username, password, dan nama lengkap harus diisi' },
        400
      );
    }

    // Cek apakah username sudah ada
    const existing = await query<User>(
      'SELECT id FROM users WHERE username = ? AND deleted_at IS NULL',
      [username]
    );

    if (existing && existing.length > 0) {
      return jsonResponse(
        { success: false, message: 'Username sudah digunakan' },
        400
      );
    }

    const result = await execute(
      `INSERT INTO users 
       (username, nisn, email, password_hash, role, nama_lengkap, kelas, jurusan, tahun_masuk, is_active) 
       VALUES (?, ?, ?, ?, 'siswa', ?, ?, ?, ?, 1)`,
      [username, nisn || null, email || null, password_hash, nama_lengkap, kelas || null, jurusan || null, tahun_masuk || null]
    );

    if (result.insertId) {
      const siswa = await query<User>(
        'SELECT * FROM users WHERE id = ?',
        [result.insertId]
      );

      return jsonResponse({
        success: true,
        message: 'Siswa berhasil ditambahkan',
        data: siswa[0],
      });
    }

    return jsonResponse(
      { success: false, message: 'Gagal menambahkan siswa' },
      500
    );
  } catch (error: any) {
    console.error('Siswa create API error:', error);
    return jsonResponse(
      {
        success: false,
        message: 'Terjadi kesalahan saat menambahkan siswa',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined,
      },
      500
    );
  }
}

