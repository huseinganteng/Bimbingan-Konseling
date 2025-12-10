//---File ini adalah API endpoint untuk login authentication---\\
//---Menerima identifier (username/email/nisn) dan password, lalu mengembalikan user data jika valid---\\

import { NextRequest, NextResponse } from 'next/server';

// Dynamic import untuk handle error dengan lebih baik
async function getUserByIdentifierSafe(identifier: string) {
  try {
    const { getUserByIdentifier } = await import('@/lib/db/users');
    return await getUserByIdentifier(identifier);
  } catch (error: any) {
    console.error('Import or DB error:', error);
    throw new Error(`Database error: ${error.message}`);
  }
}

export async function POST(request: NextRequest) {
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
    // Parse request body
    let body;
    try {
      body = await request.json();
    } catch (parseError: any) {
      return jsonResponse(
        { success: false, message: 'Invalid request body. Pastikan data dikirim dalam format JSON.' },
        400
      );
    }

    const { identifier, password } = body;

    // Validasi input
    if (!identifier || !password) {
      return jsonResponse(
        { success: false, message: 'Username/NISN/Email dan password harus diisi' },
        400
      );
    }

    // Import bcrypt
    let bcrypt;
    try {
      bcrypt = await import('bcryptjs');
    } catch (bcryptError: any) {
      console.error('Bcrypt import error:', bcryptError);
      return jsonResponse(
        { success: false, message: 'Server configuration error' },
        500
      );
    }

    // Cari user berdasarkan identifier
    let user;
    try {
      user = await getUserByIdentifierSafe(identifier);
    } catch (dbError: any) {
      console.error('Database error:', dbError);
      return jsonResponse(
        { 
          success: false, 
          message: 'Terjadi kesalahan pada database. Pastikan database sudah di-setup dan koneksi berjalan.',
          error: process.env.NODE_ENV === 'development' ? dbError.message : undefined
        },
        500
      );
    }

    if (!user) {
      return jsonResponse(
        { success: false, message: 'Username/NISN/Email atau password salah' },
        401
      );
    }

    // Verifikasi password
    let isPasswordValid = false;
    try {
      isPasswordValid = await bcrypt.default.compare(password, user.password_hash);
    } catch (bcryptError: any) {
      console.error('Bcrypt compare error:', bcryptError);
      return jsonResponse(
        { success: false, message: 'Terjadi kesalahan saat memverifikasi password' },
        500
      );
    }

    if (!isPasswordValid) {
      return jsonResponse(
        { success: false, message: 'Username/NISN/Email atau password salah' },
        401
      );
    }

    // Cek apakah user aktif
    if (!user.is_active) {
      return jsonResponse(
        { success: false, message: 'Akun Anda tidak aktif. Silakan hubungi administrator.' },
        403
      );
    }

    // Return user data tanpa password_hash
    const { password_hash, ...userWithoutPassword } = user;

    return jsonResponse({
      success: true,
      message: 'Login berhasil',
      user: userWithoutPassword,
    });
  } catch (error: any) {
    console.error('Login API error:', error);
    // Pastikan selalu return JSON
    return jsonResponse(
      { 
        success: false, 
        message: 'Terjadi kesalahan pada server',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      },
      500
    );
  }
}
