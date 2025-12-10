//---File ini adalah API endpoint untuk update jadwal konseling (PATCH)---\\

import { NextRequest, NextResponse } from 'next/server';
import { updateJadwalStatus, getJadwalById } from '@/lib/db/jadwal';

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> | { id: string } }
) {
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
    // Handle both Promise and direct params (for Next.js 15+ compatibility)
    const resolvedParams = params instanceof Promise ? await params : params;
    const jadwalId = parseInt(resolvedParams.id);
    
    if (isNaN(jadwalId)) {
      return jsonResponse(
        { success: false, message: 'ID jadwal tidak valid' },
        400
      );
    }

    const body = await request.json();
    const { status, catatan_guru } = body;

    if (!status) {
      return jsonResponse(
        { success: false, message: 'Status harus diisi' },
        400
      );
    }

    // Validasi status yang diizinkan
    const validStatuses = ['menunggu', 'dijadwalkan', 'berlangsung', 'selesai', 'dibatalkan', 'tidak_hadir'];
    if (!validStatuses.includes(status)) {
      return jsonResponse(
        { success: false, message: 'Status tidak valid' },
        400
      );
    }

    // Cek apakah jadwal ada
    const existingJadwal = await getJadwalById(jadwalId);
    if (!existingJadwal) {
      return jsonResponse(
        { success: false, message: 'Jadwal tidak ditemukan' },
        404
      );
    }

    // Update status jadwal
    const success = await updateJadwalStatus(jadwalId, status, catatan_guru);

    if (success) {
      // Get updated jadwal
      const updatedJadwal = await getJadwalById(jadwalId);
      
      return jsonResponse({
        success: true,
        message: 'Status jadwal berhasil diupdate',
        data: updatedJadwal,
      });
    }

    return jsonResponse(
      { success: false, message: 'Gagal mengupdate status jadwal' },
      500
    );
  } catch (error: any) {
    console.error('Jadwal update API error:', error);
    return jsonResponse(
      {
        success: false,
        message: 'Terjadi kesalahan saat mengupdate jadwal',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined,
      },
      500
    );
  }
}

