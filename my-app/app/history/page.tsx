//----File ini untuk halaman history konseling siswa (menampilkan riwayat semua konseling yang sudah selesai/dibatalkan/tidak hadir)----\\
'use client';

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import type { JadwalKonselingWithRelations } from "@/lib/types";

export default function HistoryPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [jadwal, setJadwal] = useState<JadwalKonselingWithRelations[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      const parsedUser = JSON.parse(userData);
      setUser(parsedUser);
      if (parsedUser.role === 'siswa') {
        fetchHistory(parsedUser.id);
      } else {
        router.push('/home');
      }
    } else {
      router.push('/login/user');
    }

    // Real-time update setiap 30 detik
    const interval = setInterval(() => {
      const currentUserData = localStorage.getItem('user');
      if (currentUserData) {
        const currentUser = JSON.parse(currentUserData);
        if (currentUser.role === 'siswa') {
          fetchHistory(currentUser.id);
        }
      }
    }, 30000);

    return () => clearInterval(interval);
  }, [router]);

  const fetchHistory = async (siswaId: number) => {
    try {
      setLoading(true);
      const response = await fetch(`/api/jadwal?siswa_id=${siswaId}`);
      const data = await response.json();
      
      if (data.success && data.data) {
        // Sort by tanggal dan waktu (terbaru dulu)
        const sorted = data.data.sort((a: JadwalKonselingWithRelations, b: JadwalKonselingWithRelations) => {
          const dateA = new Date(`${a.tanggal} ${a.waktu_mulai}`).getTime();
          const dateB = new Date(`${b.tanggal} ${b.waktu_mulai}`).getTime();
          return dateB - dateA;
        });
        setJadwal(sorted);
      }
    } catch (error) {
      console.error('Error fetching history:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'selesai':
        return 'bg-green-900/50 text-green-400';
      case 'dijadwalkan':
        return 'bg-blue-900/50 text-blue-400';
      case 'berlangsung':
        return 'bg-purple-900/50 text-purple-400';
      case 'menunggu':
        return 'bg-yellow-900/50 text-yellow-400';
      case 'dibatalkan':
        return 'bg-red-900/50 text-red-400';
      default:
        return 'bg-gray-900/50 text-gray-400';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'selesai':
        return 'Selesai';
      case 'dijadwalkan':
        return 'Dijadwalkan';
      case 'berlangsung':
        return 'Berlangsung';
      case 'menunggu':
        return 'Menunggu Persetujuan';
      case 'dibatalkan':
        return 'Dibatalkan';
      default:
        return status;
    }
  };

  const filteredJadwal = jadwal.filter((j) => {
    const matchesSearch = 
      j.nama_guru?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      j.nama_layanan?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      j.tanggal.includes(searchTerm);
    
    const matchesStatus = filterStatus === 'all' || j.status === filterStatus;
    
    return matchesSearch && matchesStatus;
  });

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-400 mb-4">Anda belum login</p>
          <Link href="/login/user" className="text-blue-600 hover:underline">
            Login terlebih dahulu
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 transition-colors duration-300">
      {/* Navbar */}
      <nav className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 w-[95%] max-w-6xl">
        <div className="relative gooey-nav overflow-hidden">
          <div className="gooey-blob gooey-blob-1"></div>
          <div className="gooey-blob gooey-blob-2"></div>
          
          <div className="relative z-10 container mx-auto px-6 py-4">
            <div className="flex items-center justify-between">
              <Link href="/home/dasboard" className="flex items-center gap-3 group">
                <div className="relative w-12 h-12 transition-transform group-hover:scale-110">
                  <Image
                    src="https://smktarunabhakti.sch.id/wp-content/uploads/2020/07/logotbvector-copy.png"
                    alt="Logo SMK Taruna Bhakti"
                    width={48}
                    height={48}
                    className="object-contain"
                    priority
                    unoptimized
                  />
                </div>
                <div>
                  <div className="text-sm font-bold text-white">Bimbingan Konseling</div>
                  <div className="text-xs text-gray-400">SMK Taruna Bhakti</div>
                </div>
              </Link>
              <div className="flex items-center gap-2">
                <Link
                  href="/home/dasboard"
                  className="px-5 py-2.5 rounded-xl text-blue-600 font-semibold bg-blue-50 relative group"
                >
                  Dashboard
                </Link>
                <Link
                  href="/profile"
                  className="px-5 py-2.5 rounded-xl text-gray-300 hover:text-blue-600 hover:bg-blue-50 transition-all duration-300 font-medium"
                >
                  Profile
                </Link>
              </div>
            </div>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-6 py-12 pt-32">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
              History Jadwal Konseling
            </h1>
            <p className="text-gray-400">
              Riwayat semua jadwal konseling Anda
            </p>
          </div>

          {/* Search and Filter */}
          <div className="mb-6 flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <input
                type="text"
                placeholder="Cari berdasarkan guru, layanan, atau tanggal..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              />
            </div>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
            >
              <option value="all">Semua Status</option>
              <option value="menunggu">Menunggu</option>
              <option value="dijadwalkan">Dijadwalkan</option>
              <option value="berlangsung">Berlangsung</option>
              <option value="selesai">Selesai</option>
              <option value="dibatalkan">Dibatalkan</option>
            </select>
          </div>

          {/* Jadwal List */}
          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
              <p className="mt-4 text-gray-400">Memuat history...</p>
            </div>
          ) : filteredJadwal.length === 0 ? (
            <div className="text-center py-12 bg-gray-800 rounded-xl border border-gray-700">
              <svg className="w-16 h-16 mx-auto text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <p className="text-gray-400 mb-2">Belum ada jadwal konseling</p>
              <Link href="/home" className="text-blue-600 hover:underline">
                Buat jadwal konseling sekarang
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredJadwal.map((jadwalItem) => (
                <div
                  key={jadwalItem.id}
                  className="bg-gray-800 rounded-xl p-6 border border-gray-700 hover:border-blue-500 transition-all"
                >
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-start gap-4">
                        {jadwalItem.foto_guru && (
                          <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-blue-500 flex-shrink-0">
                            <Image
                              src={jadwalItem.foto_guru}
                              alt={jadwalItem.nama_guru || 'Guru BK'}
                              width={64}
                              height={64}
                              className="w-full h-full object-cover"
                              unoptimized
                            />
                          </div>
                        )}
                        <div className="flex-1">
                          <h3 className="text-xl font-bold text-white mb-1">
                            {jadwalItem.nama_guru}
                          </h3>
                          <p className="text-gray-400 mb-2">{jadwalItem.nama_layanan}</p>
                          <div className="flex flex-wrap gap-4 text-sm text-gray-500">
                            <span>
                              📅 {new Date(jadwalItem.tanggal).toLocaleDateString('id-ID', {
                                weekday: 'long',
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric'
                              })}
                            </span>
                            <span>
                              🕐 {jadwalItem.waktu_mulai} - {jadwalItem.waktu_selesai}
                            </span>
                          </div>
                          {jadwalItem.alasan_konseling && (
                            <p className="text-sm text-gray-400 mt-2">
                              <span className="font-semibold">Alasan:</span> {jadwalItem.alasan_konseling}
                            </p>
                          )}
                          {jadwalItem.catatan_guru && (
                            <p className="text-sm text-blue-400 mt-2">
                              <span className="font-semibold">Catatan Guru:</span> {jadwalItem.catatan_guru}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <span className={`px-4 py-2 rounded-full text-xs font-semibold ${getStatusColor(jadwalItem.status || 'menunggu')}`}>
                        {getStatusLabel(jadwalItem.status || 'menunggu')}
                      </span>
                      {jadwalItem.rating && (
                        <div className="flex items-center gap-1 text-yellow-400">
                          {'⭐'.repeat(jadwalItem.rating)}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

