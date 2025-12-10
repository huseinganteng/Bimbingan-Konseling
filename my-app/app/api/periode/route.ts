//---File ini adalah API endpoint untuk periode pemilihan---\\

import { NextRequest, NextResponse } from 'next/server';
import { query, execute } from '@/lib/db/mysql';
import type { PeriodePemilihan } from '@/lib/types/database';

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
    const isActive = searchParams.get('is_active');

    let sql = 'SELECT * FROM periode_pemilihan WHERE 1=1';
    const params: any[] = [];

    if (isActive === 'true') {
      sql += ' AND is_active = 1';
    }

    sql += ' ORDER BY tanggal_mulai DESC';

    const periode = await query<PeriodePemilihan>(sql, params);

    return jsonResponse({
      success: true,
      data: periode,
    });
  } catch (error: any) {
    console.error('Periode API error:', error);
    return jsonResponse(
      {
        success: false,
        message: 'Terjadi kesalahan saat mengambil periode',
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
    const { nama_periode, tanggal_mulai, tanggal_selesai, waktu_mulai, waktu_selesai, is_active, keterangan, created_by } = body;

    if (!nama_periode || !tanggal_mulai || !tanggal_selesai || !waktu_mulai || !waktu_selesai) {
      return jsonResponse(
        { success: false, message: 'Semua field wajib harus diisi' },
        400
      );
    }

    const result = await execute(
      `INSERT INTO periode_pemilihan 
       (nama_periode, tanggal_mulai, tanggal_selesai, waktu_mulai, waktu_selesai, is_active, keterangan, created_by) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [nama_periode, tanggal_mulai, tanggal_selesai, waktu_mulai, waktu_selesai, is_active ? 1 : 0, keterangan || null, created_by || null]
    );

    if (result.insertId) {
      const periode = await query<PeriodePemilihan>(
        'SELECT * FROM periode_pemilihan WHERE id = ?',
        [result.insertId]
      );

      return jsonResponse({
        success: true,
        message: 'Periode berhasil dibuat',
        data: periode[0],
      });
    }

    return jsonResponse(
      { success: false, message: 'Gagal membuat periode' },
      500
    );
  } catch (error: any) {
    console.error('Periode create API error:', error);
    return jsonResponse(
      {
        success: false,
        message: 'Terjadi kesalahan saat membuat periode',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined,
      },
      500
    );
  }
}

