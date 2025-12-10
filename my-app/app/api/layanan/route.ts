//---File ini adalah API endpoint untuk mendapatkan data layanan BK---\\

import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db/mysql';
import type { LayananBK } from '@/lib/types/database';

export async function GET(request: NextRequest) {
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
    const searchParams = request.nextUrl.searchParams;
    const isActive = searchParams.get('is_active');

    // Build query
    let sql = `SELECT * FROM layanan_bk WHERE 1=1`;
    const params: any[] = [];

    if (isActive === 'true') {
      sql += ` AND is_active = 1`;
    } else if (isActive === 'false') {
      sql += ` AND is_active = 0`;
    }

    sql += ` ORDER BY nama_layanan ASC`;

    const layanan = await query<LayananBK>(sql, params);

    return jsonResponse({
      success: true,
      data: layanan,
      count: layanan.length,
    });
  } catch (error: any) {
    console.error('Layanan API error:', error);
    return jsonResponse(
      {
        success: false,
        message: 'Terjadi kesalahan saat mengambil data layanan',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined,
      },
      500
    );
  }
}

