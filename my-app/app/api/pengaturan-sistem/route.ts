//---File ini adalah API endpoint untuk pengaturan sistem---\\

import { NextRequest, NextResponse } from 'next/server';
import { query, queryOne, execute } from '@/lib/db/mysql';
import type { PengaturanSistem } from '@/lib/types/database';

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
    const pengaturan = await query<PengaturanSistem>(
      'SELECT * FROM pengaturan_sistem ORDER BY kategori, key_setting'
    );

    return jsonResponse({
      success: true,
      data: pengaturan,
    });
  } catch (error: any) {
    console.error('Pengaturan sistem API error:', error);
    return jsonResponse(
      {
        success: false,
        message: 'Terjadi kesalahan saat mengambil pengaturan sistem',
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
    const { key_setting, value_setting, updated_by } = body;

    if (!key_setting) {
      return jsonResponse(
        { success: false, message: 'Key setting harus diisi' },
        400
      );
    }

    // Update atau insert
    const existing = await queryOne<PengaturanSistem>(
      'SELECT * FROM pengaturan_sistem WHERE key_setting = ?',
      [key_setting]
    );

    if (existing) {
      await execute(
        'UPDATE pengaturan_sistem SET value_setting = ?, updated_by = ?, updated_at = CURRENT_TIMESTAMP WHERE key_setting = ?',
        [value_setting, updated_by, key_setting]
      );
    } else {
      await execute(
        'INSERT INTO pengaturan_sistem (key_setting, value_setting, tipe_data, updated_by) VALUES (?, ?, ?, ?)',
        [key_setting, value_setting, 'string', updated_by]
      );
    }

    const updated = await queryOne<PengaturanSistem>(
      'SELECT * FROM pengaturan_sistem WHERE key_setting = ?',
      [key_setting]
    );

    return jsonResponse({
      success: true,
      message: 'Pengaturan sistem berhasil disimpan',
      data: updated,
    });
  } catch (error: any) {
    console.error('Pengaturan sistem update API error:', error);
    return jsonResponse(
      {
        success: false,
        message: 'Terjadi kesalahan saat menyimpan pengaturan sistem',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined,
      },
      500
    );
  }
}

