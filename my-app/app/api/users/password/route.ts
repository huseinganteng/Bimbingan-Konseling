//---File ini adalah API endpoint untuk mengubah password user---\\

import { NextRequest, NextResponse } from 'next/server';
import { queryOne, execute } from '@/lib/db/mysql';
import bcrypt from 'bcryptjs';
import type { User } from '@/lib/types/database';

export async function PATCH(request: NextRequest) {
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
    const { user_id, password_lama, password_baru, current_user_id, current_user_role } = body;

    if (!user_id || !password_baru) {
      return jsonResponse(
        { success: false, message: 'User ID dan password baru harus diisi' },
        400
      );
    }

    // Validasi panjang password
    if (password_baru.length < 6) {
      return jsonResponse(
        { success: false, message: 'Password baru minimal 6 karakter' },
        400
      );
    }

    // Get user
    const user = await queryOne<User>(
      'SELECT * FROM users WHERE id = ? AND deleted_at IS NULL',
      [user_id]
    );

    if (!user) {
      return jsonResponse(
        { success: false, message: 'User tidak ditemukan' },
        404
      );
    }

    // Cek apakah user yang request adalah admin/super_admin atau user sendiri
    const isAdmin = current_user_role === 'admin' || current_user_role === 'super_admin';
    const isSelf = current_user_id === user_id;

    if (!isAdmin && !isSelf) {
      return jsonResponse(
        { success: false, message: 'Anda tidak memiliki izin untuk mengubah password user ini' },
        403
      );
    }

    // Jika bukan admin, wajib verifikasi password lama
    if (!isAdmin) {
      if (!password_lama) {
        return jsonResponse(
          { success: false, message: 'Password lama harus diisi' },
          400
        );
      }

      const isPasswordValid = await bcrypt.compare(password_lama, user.password_hash);
      if (!isPasswordValid) {
        return jsonResponse(
          { success: false, message: 'Password lama salah' },
          401
        );
      }
    }

    // Hash password baru
    const hashedPassword = await bcrypt.hash(password_baru, 10);

    // Update password
    const result = await execute(
      'UPDATE users SET password_hash = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ? AND deleted_at IS NULL',
      [hashedPassword, user_id]
    );

    if (result.affectedRows === 0) {
      return jsonResponse(
        { success: false, message: 'Gagal mengubah password' },
        500
      );
    }

    return jsonResponse({
      success: true,
      message: 'Password berhasil diubah',
    });
  } catch (error: any) {
    console.error('Password update API error:', error);
    return jsonResponse(
      {
        success: false,
        message: 'Terjadi kesalahan saat mengubah password',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined,
      },
      500
    );
  }
}

