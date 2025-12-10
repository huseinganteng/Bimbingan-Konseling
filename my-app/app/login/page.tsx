//---File ini adalah halaman login universal untuk aplikasi web---\\
//---Form login yang bisa digunakan untuk siswa, admin, dan super admin---\\

'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';

export default function LoginPage() {
  const router = useRouter();
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!identifier || !password) {
      setError('Username/NISN/Email dan password harus diisi');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          identifier: identifier,
          password: password,
        }),
      });

      // Cek content type sebelum parse JSON
      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        const text = await response.text();
        console.error('Non-JSON response:', text.substring(0, 200));
        setError('Server mengembalikan response yang tidak valid. Pastikan API endpoint berjalan dengan benar.');
        return;
      }

      const data = await response.json();

      if (data.success && data.user) {
        // Simpan user data ke localStorage
        localStorage.setItem('user', JSON.stringify(data.user));
        
        // Redirect berdasarkan role
        if (data.user.role === 'siswa') {
          router.push('/home');
        } else if (data.user.role === 'guru') {
          router.push('/guru/dashboard');
        } else if (data.user.role === 'admin' || data.user.role === 'super_admin') {
          router.push('/admin');
        } else {
          router.push('/');
        }
      } else {
        setError(data.message || 'Login gagal. Periksa username/NISN/email dan password Anda.');
      }
    } catch (err: any) {
      console.error('Login error:', err);
      if (err instanceof SyntaxError && err.message.includes('JSON')) {
        setError('Server mengembalikan response yang tidak valid. Pastikan API endpoint berjalan dengan benar.');
      } else {
        setError('Terjadi kesalahan. Silakan coba lagi.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative flex items-center justify-center px-4 py-12">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <Image
          src="https://lh3.googleusercontent.com/gps-cs-s/AG0ilSwmtMlJl_cZDFJKXP6TlQ3BKtxaceL1YGDvr3vToK0vwFjRjYCm1vSBrwYU06ISxE9jOqVAgr0LCHYnA_WLUVSaySoG4y8DLNuLLZMLm2E_XF6vQgFJQtSD_zwTOpyXolHGmxsclQ=s1360-w1360-h1020-rw"
          alt="Background SMK Taruna Bhakti"
          fill
          className="object-cover"
          priority
          unoptimized
        />
        {/* Overlay untuk readability */}
        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm"></div>
      </div>

      <div className="w-full max-w-md relative z-10">
        {/* Logo/Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <Image
              src="https://smktarunabhakti.sch.id/wp-content/uploads/2020/07/logotbvector-copy.png"
              alt="Logo SMK Taruna Bhakti"
              width={80}
              height={80}
              className="object-contain"
              priority
              unoptimized
            />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2 drop-shadow-lg">
            Login Bimbingan Konseling
          </h1>
          <p className="text-gray-200 drop-shadow-md">Masuk dengan username/NISN/email dan password</p>
        </div>

        {/* Login Card */}
        <div className="bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl p-8 border border-white/20">
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                {error}
              </div>
            )}

            <div>
              <label htmlFor="identifier" className="block text-sm font-medium text-gray-700 mb-2">
                Username / NISN / Email
              </label>
              <input
                id="identifier"
                type="text"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                placeholder="Masukkan username, NISN, atau email"
                required
                disabled={loading}
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                placeholder="Masukkan password"
                required
                disabled={loading}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Memproses...
                </>
              ) : (
                'Masuk'
              )}
            </button>
          </form>
        </div>

        {/* Back Button */}
        <div className="mt-6 text-center">
          <Link
            href="/"
            className="inline-flex items-center text-sm text-white hover:text-blue-300 transition-colors drop-shadow-md"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Kembali ke beranda
          </Link>
        </div>
      </div>
    </div>
  );
}
