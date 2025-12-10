//---File ini adalah API endpoint untuk history konseling---\\

import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db/mysql';
import type { HistoryKonselingWithRelations } from '@/lib/types/database';

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
    const siswaId = searchParams.get('siswa_id');
    const limit = parseInt(searchParams.get('limit') || '20');

    if (!siswaId) {
      return jsonResponse(
        { success: false, message: 'Siswa ID harus diisi' },
        400
      );
    }

    const sql = `
      SELECT 
        hk.*,
        u.nama_lengkap as nama_siswa,
        u.nisn,
        gb.nama_lengkap as nama_guru,
        gb.foto_profil as foto_guru,
        lb.nama_layanan,
        lb.warna
      FROM history_konseling hk
      INNER JOIN users u ON hk.siswa_id = u.id
      INNER JOIN guru_bk gb ON hk.guru_id = gb.id
      INNER JOIN layanan_bk lb ON hk.layanan_id = lb.id
      WHERE hk.siswa_id = ?
      ORDER BY hk.tanggal_konseling DESC, hk.waktu_mulai DESC
      LIMIT ?
    `;

    const history = await query<HistoryKonselingWithRelations>(sql, [parseInt(siswaId), limit]);

    return jsonResponse({
      success: true,
      data: history,
      count: history.length,
    });
  } catch (error: any) {
    console.error('History API error:', error);
    return jsonResponse(
      {
        success: false,
        message: 'Terjadi kesalahan saat mengambil history',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined,
      },
      500
    );
  }
}

