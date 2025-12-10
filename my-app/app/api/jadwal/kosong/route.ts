//---File ini adalah API endpoint untuk mendapatkan jadwal kosong guru---\\

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
    const guruId = searchParams.get('guru_id');
    const tanggal = searchParams.get('tanggal');

    if (!guruId || !tanggal) {
      return jsonResponse(
        { success: false, message: 'Guru ID dan tanggal harus diisi' },
        400
      );
    }

    // Get jadwal yang sudah ada pada tanggal tersebut
    const jadwalTerisi = await query<any>(
      `SELECT waktu_mulai, waktu_selesai 
       FROM jadwal_konseling 
       WHERE guru_id = ? AND tanggal = ? AND deleted_at IS NULL 
       AND status NOT IN ('dibatalkan', 'tidak_hadir')`,
      [parseInt(guruId), tanggal]
    );

    // Generate slot waktu (08:00 - 16:00, setiap 1 jam)
    const slots: any[] = [];
    const startHour = 8;
    const endHour = 16;

    for (let hour = startHour; hour < endHour; hour++) {
      const waktuMulai = `${hour.toString().padStart(2, '0')}:00:00`;
      const waktuSelesai = `${(hour + 1).toString().padStart(2, '0')}:00:00`;

      // Cek apakah slot sudah terisi
      const isTerisi = jadwalTerisi.some((j: any) => {
        const jMulai = j.waktu_mulai;
        const jSelesai = j.waktu_selesai;
        // Cek overlap
        return (waktuMulai < jSelesai && waktuSelesai > jMulai);
      });

      if (!isTerisi) {
        slots.push({
          waktu_mulai: waktuMulai.substring(0, 5), // HH:mm
          waktu_selesai: waktuSelesai.substring(0, 5),
        });
      }
    }

    return jsonResponse({
      success: true,
      data: {
        jadwal_kosong: slots,
      },
    });
  } catch (error: any) {
    console.error('Jadwal kosong API error:', error);
    return jsonResponse(
      {
        success: false,
        message: 'Terjadi kesalahan saat mengambil jadwal kosong',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined,
      },
      500
    );
  }
}

