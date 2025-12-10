//---File ini adalah API endpoint untuk pengaturan user (notifikasi, email, tema)---\\

import { NextRequest, NextResponse } from 'next/server';
import { query, queryOne, execute } from '@/lib/db/mysql';
import type { PengaturanUser } from '@/lib/types/database';

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
    const userId = searchParams.get('user_id');

    if (!userId) {
      return jsonResponse(
        { success: false, message: 'User ID harus diisi' },
        400
      );
    }

    // Get atau create pengaturan user
    let pengaturan = await queryOne<PengaturanUser>(
      'SELECT * FROM pengaturan_user WHERE user_id = ?',
      [parseInt(userId)]
    );

    // Jika belum ada, buat default
    if (!pengaturan) {
      await execute(
        'INSERT INTO pengaturan_user (user_id, notifikasi_aktif, notifikasi_email, tema_preferensi, bahasa) VALUES (?, 1, 0, ?, ?)',
        [parseInt(userId), 'auto', 'id']
      );
      pengaturan = await queryOne<PengaturanUser>(
        'SELECT * FROM pengaturan_user WHERE user_id = ?',
        [parseInt(userId)]
      );
    }

    return jsonResponse({
      success: true,
      data: pengaturan,
    });
  } catch (error: any) {
    console.error('Pengaturan API error:', error);
    return jsonResponse(
      {
        success: false,
        message: 'Terjadi kesalahan saat mengambil pengaturan',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined,
      },
      500
    );
  }
}

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
    const { user_id, notifikasi_aktif, notifikasi_email, tema_preferensi, bahasa } = body;

    if (!user_id) {
      return jsonResponse(
        { success: false, message: 'User ID harus diisi' },
        400
      );
    }

    // Update atau insert pengaturan
    const existing = await queryOne<PengaturanUser>(
      'SELECT * FROM pengaturan_user WHERE user_id = ?',
      [user_id]
    );

    if (existing) {
      const updates: string[] = [];
      const params: any[] = [];

      if (notifikasi_aktif !== undefined) {
        updates.push('notifikasi_aktif = ?');
        params.push(notifikasi_aktif ? 1 : 0);
      }
      if (notifikasi_email !== undefined) {
        updates.push('notifikasi_email = ?');
        params.push(notifikasi_email ? 1 : 0);
      }
      if (tema_preferensi !== undefined) {
        updates.push('tema_preferensi = ?');
        params.push(tema_preferensi);
      }
      if (bahasa !== undefined) {
        updates.push('bahasa = ?');
        params.push(bahasa);
      }

      if (updates.length > 0) {
        params.push(user_id);
        await execute(
          `UPDATE pengaturan_user SET ${updates.join(', ')}, updated_at = CURRENT_TIMESTAMP WHERE user_id = ?`,
          params
        );
      }
    } else {
      await execute(
        'INSERT INTO pengaturan_user (user_id, notifikasi_aktif, notifikasi_email, tema_preferensi, bahasa) VALUES (?, ?, ?, ?, ?)',
        [
          user_id,
          notifikasi_aktif !== undefined ? (notifikasi_aktif ? 1 : 0) : 1,
          notifikasi_email !== undefined ? (notifikasi_email ? 1 : 0) : 0,
          tema_preferensi || 'auto',
          bahasa || 'id',
        ]
      );
    }

    const updated = await queryOne<PengaturanUser>(
      'SELECT * FROM pengaturan_user WHERE user_id = ?',
      [user_id]
    );

    return jsonResponse({
      success: true,
      message: 'Pengaturan berhasil disimpan',
      data: updated,
    });
  } catch (error: any) {
    console.error('Pengaturan update API error:', error);
    return jsonResponse(
      {
        success: false,
        message: 'Terjadi kesalahan saat menyimpan pengaturan',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined,
      },
      500
    );
  }
}

