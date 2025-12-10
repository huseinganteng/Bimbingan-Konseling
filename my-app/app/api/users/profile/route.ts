//---File ini adalah API endpoint untuk update profile user (nama, foto profil, NISN)---\\

import { NextRequest, NextResponse } from 'next/server';
import { query, execute } from '@/lib/db/mysql';
import type { User } from '@/lib/types/database';

export async function PATCH(request: NextRequest) {
  // Helper untuk selalu return JSON
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
    const { user_id, nama_lengkap, nisn, foto_profil } = body;

    // Validasi input
    if (!user_id) {
      return jsonResponse(
        { success: false, message: 'User ID harus diisi' },
        400
      );
    }

    // Cek apakah user ada
    const user = await query<User>(
      'SELECT * FROM users WHERE id = ? AND deleted_at IS NULL',
      [user_id]
    );

    if (!user || user.length === 0) {
      return jsonResponse(
        { success: false, message: 'User tidak ditemukan' },
        404
      );
    }

    // Build update query
    const updates: string[] = [];
    const params: any[] = [];

    if (nama_lengkap !== undefined) {
      updates.push('nama_lengkap = ?');
      params.push(nama_lengkap);
    }

    if (nisn !== undefined) {
      // Cek apakah NISN sudah digunakan oleh user lain
      if (nisn) {
        const existingUser = await query<User>(
          'SELECT id FROM users WHERE nisn = ? AND id != ? AND deleted_at IS NULL',
          [nisn, user_id]
        );
        if (existingUser && existingUser.length > 0) {
          return jsonResponse(
            { success: false, message: 'NISN sudah digunakan oleh user lain' },
            400
          );
        }
      }
      updates.push('nisn = ?');
      params.push(nisn || null);
    }

    if (foto_profil !== undefined) {
      updates.push('foto_profil = ?');
      params.push(foto_profil || null);
    }

    if (updates.length === 0) {
      return jsonResponse(
        { success: false, message: 'Tidak ada data yang diupdate' },
        400
      );
    }

    // Update user
    params.push(user_id);
    const sql = `UPDATE users SET ${updates.join(', ')}, updated_at = CURRENT_TIMESTAMP WHERE id = ? AND deleted_at IS NULL`;

    const result = await execute(sql, params);

    if (result.affectedRows === 0) {
      return jsonResponse(
        { success: false, message: 'Gagal mengupdate profile' },
        500
      );
    }

    // Get updated user data
    const updatedUser = await query<User>(
      'SELECT id, username, email, role, nisn, nama_lengkap, jenis_kelamin, tanggal_lahir, alamat, no_telepon, foto_profil, kelas, jurusan, tahun_masuk, is_active, created_at, updated_at FROM users WHERE id = ? AND deleted_at IS NULL',
      [user_id]
    );

    return jsonResponse({
      success: true,
      message: 'Profile berhasil diupdate',
      user: updatedUser[0],
    });
  } catch (error: any) {
    console.error('Profile update API error:', error);
    return jsonResponse(
      {
        success: false,
        message: 'Terjadi kesalahan saat mengupdate profile',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined,
      },
      500
    );
  }
}

