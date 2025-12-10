//---File ini adalah API endpoint untuk jadwal konseling (GET dan POST)---\\

import { NextRequest, NextResponse } from 'next/server';
import { query, execute } from '@/lib/db/mysql';
import type { JadwalKonselingWithRelations } from '@/lib/types/database';

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
    const guruId = searchParams.get('guru_id');
    const status = searchParams.get('status');

    let sql = `
      SELECT 
        jk.*,
        u.nama_lengkap as nama_siswa,
        u.nisn,
        gb.nama_lengkap as nama_guru,
        gb.foto_profil as foto_guru,
        lb.nama_layanan,
        lb.warna
      FROM jadwal_konseling jk
      INNER JOIN users u ON jk.siswa_id = u.id
      INNER JOIN guru_bk gb ON jk.guru_id = gb.id
      INNER JOIN layanan_bk lb ON jk.layanan_id = lb.id
      WHERE jk.deleted_at IS NULL
    `;
    const params: any[] = [];

    if (siswaId) {
      sql += ` AND jk.siswa_id = ?`;
      params.push(parseInt(siswaId));
    }

    if (guruId) {
      sql += ` AND jk.guru_id = ?`;
      params.push(parseInt(guruId));
    }

    if (status) {
      sql += ` AND jk.status = ?`;
      params.push(status);
    }

    sql += ` ORDER BY jk.tanggal DESC, jk.waktu_mulai DESC`;

    const jadwal = await query<JadwalKonselingWithRelations>(sql, params);

    return jsonResponse({
      success: true,
      data: jadwal,
      count: jadwal.length,
    });
  } catch (error: any) {
    console.error('Jadwal API error:', error);
    return jsonResponse(
      {
        success: false,
        message: 'Terjadi kesalahan saat mengambil jadwal',
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
    const { siswa_id, guru_id, layanan_id, tanggal, waktu_mulai, waktu_selesai, alasan_konseling } = body;

    // Validasi
    if (!siswa_id || !guru_id || !layanan_id || !tanggal || !waktu_mulai || !waktu_selesai || !alasan_konseling) {
      return jsonResponse(
        { success: false, message: 'Semua field harus diisi' },
        400
      );
    }

    // Insert jadwal
    const result = await execute(
      `INSERT INTO jadwal_konseling 
       (siswa_id, guru_id, layanan_id, tanggal, waktu_mulai, waktu_selesai, alasan_konseling, status) 
       VALUES (?, ?, ?, ?, ?, ?, ?, 'menunggu')`,
      [siswa_id, guru_id, layanan_id, tanggal, waktu_mulai, waktu_selesai, alasan_konseling]
    );

    if (result.insertId) {
      // Get created jadwal
      const jadwal = await query<JadwalKonselingWithRelations>(
        `SELECT 
          jk.*,
          u.nama_lengkap as nama_siswa,
          u.nisn,
          gb.nama_lengkap as nama_guru,
          gb.foto_profil as foto_guru,
          lb.nama_layanan,
          lb.warna
        FROM jadwal_konseling jk
        INNER JOIN users u ON jk.siswa_id = u.id
        INNER JOIN guru_bk gb ON jk.guru_id = gb.id
        INNER JOIN layanan_bk lb ON jk.layanan_id = lb.id
        WHERE jk.id = ?`,
        [result.insertId]
      );

      return jsonResponse({
        success: true,
        message: 'Jadwal konseling berhasil dibuat',
        data: jadwal[0],
      });
    }

    return jsonResponse(
      { success: false, message: 'Gagal membuat jadwal konseling' },
      500
    );
  } catch (error: any) {
    console.error('Jadwal create API error:', error);
    return jsonResponse(
      {
        success: false,
        message: 'Terjadi kesalahan saat membuat jadwal',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined,
      },
      500
    );
  }
}

