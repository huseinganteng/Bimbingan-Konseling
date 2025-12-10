//---File ini adalah API endpoint untuk dashboard data (admin, guru, siswa)---\\

import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db/mysql';

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
    const role = searchParams.get('role');

    if (!userId || !role) {
      return jsonResponse(
        { success: false, message: 'User ID dan role harus diisi' },
        400
      );
    }

    if (role === 'admin' || role === 'super_admin') {
      // Dashboard Admin
      const [
        totalSiswa,
        totalGuru,
        totalJadwal,
        jadwalMendatang,
      ] = await Promise.all([
        query<any>('SELECT COUNT(*) as count FROM users WHERE role = "siswa" AND is_active = 1 AND deleted_at IS NULL'),
        query<any>('SELECT COUNT(*) as count FROM guru_bk WHERE is_active = 1 AND deleted_at IS NULL'),
        query<any>('SELECT COUNT(*) as count FROM jadwal_konseling WHERE deleted_at IS NULL'),
        query<any>(`SELECT COUNT(*) as count FROM jadwal_konseling 
                     WHERE tanggal >= CURDATE() AND deleted_at IS NULL`),
      ]);

      return jsonResponse({
        success: true,
        data: {
          total_siswa: totalSiswa[0]?.count || 0,
          total_guru: totalGuru[0]?.count || 0,
          total_jadwal: totalJadwal[0]?.count || 0,
          jadwal_mendatang: jadwalMendatang[0]?.count || 0,
        },
      });
    } else if (role === 'guru') {
      // Dashboard Guru
      const guruId = parseInt(userId);
      const today = new Date().toISOString().split('T')[0];
      
      const [
        totalJadwal,
        jadwalMenunggu,
        jadwalBerlangsung,
        jadwalSelesai,
        jadwalHariIni,
        jadwalMendatang,
      ] = await Promise.all([
        query<any>('SELECT COUNT(*) as count FROM jadwal_konseling WHERE guru_id = ? AND deleted_at IS NULL', [guruId]),
        query<any>('SELECT COUNT(*) as count FROM jadwal_konseling WHERE guru_id = ? AND status = "menunggu" AND deleted_at IS NULL', [guruId]),
        query<any>('SELECT COUNT(*) as count FROM jadwal_konseling WHERE guru_id = ? AND status = "berlangsung" AND deleted_at IS NULL', [guruId]),
        query<any>('SELECT COUNT(*) as count FROM jadwal_konseling WHERE guru_id = ? AND status = "selesai" AND deleted_at IS NULL', [guruId]),
        query<any>(`SELECT COUNT(*) as count FROM jadwal_konseling 
                     WHERE guru_id = ? AND tanggal = ? AND deleted_at IS NULL 
                     AND status IN ('dijadwalkan', 'berlangsung')`, [guruId, today]),
        query<any>(`SELECT COUNT(*) as count FROM jadwal_konseling 
                     WHERE guru_id = ? AND tanggal > ? AND deleted_at IS NULL 
                     AND status IN ('dijadwalkan', 'berlangsung')`, [guruId, today]),
      ]);

      return jsonResponse({
        success: true,
        data: {
          total_jadwal: totalJadwal[0]?.count || 0,
          jadwal_menunggu: jadwalMenunggu[0]?.count || 0,
          jadwal_berlangsung: jadwalBerlangsung[0]?.count || 0,
          jadwal_selesai: jadwalSelesai[0]?.count || 0,
          jadwal_hari_ini: jadwalHariIni[0]?.count || 0,
          jadwal_mendatang: jadwalMendatang[0]?.count || 0,
        },
      });
    } else if (role === 'siswa') {
      // Dashboard Siswa
      const siswaId = parseInt(userId);
      
      const [
        totalJadwal,
        jadwalMendatang,
        jadwalSelesai,
        jadwalMenunggu,
      ] = await Promise.all([
        query<any>('SELECT COUNT(*) as count FROM jadwal_konseling WHERE siswa_id = ? AND deleted_at IS NULL', [siswaId]),
        query<any>(`SELECT COUNT(*) as count FROM jadwal_konseling 
                     WHERE siswa_id = ? AND tanggal >= CURDATE() AND deleted_at IS NULL 
                     AND status IN ('menunggu', 'dijadwalkan', 'berlangsung')`, [siswaId]),
        query<any>('SELECT COUNT(*) as count FROM jadwal_konseling WHERE siswa_id = ? AND status = "selesai" AND deleted_at IS NULL', [siswaId]),
        query<any>('SELECT COUNT(*) as count FROM jadwal_konseling WHERE siswa_id = ? AND status = "menunggu" AND deleted_at IS NULL', [siswaId]),
      ]);

      return jsonResponse({
        success: true,
        data: {
          total_jadwal: totalJadwal[0]?.count || 0,
          jadwal_mendatang: jadwalMendatang[0]?.count || 0,
          jadwal_selesai: jadwalSelesai[0]?.count || 0,
          jadwal_menunggu: jadwalMenunggu[0]?.count || 0,
        },
      });
    }

    return jsonResponse(
      { success: false, message: 'Role tidak valid' },
      400
    );
  } catch (error: any) {
    console.error('Dashboard API error:', error);
    return jsonResponse(
      {
        success: false,
        message: 'Terjadi kesalahan saat mengambil data dashboard',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined,
      },
      500
    );
  }
}

