//----File ini untuk halaman dashboard siswa (menampilkan statistik konseling, jadwal mendatang, dan riwayat konseling)----\\
'use client';

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import type { DashboardSiswa, JadwalKonselingWithRelations } from "@/lib/types";

export default function Dashboard() {
  const [dashboardData, setDashboardData] = useState<DashboardSiswa | null>(null);
  const [jadwalMendatang, setJadwalMendatang] = useState<JadwalKonselingWithRelations[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    // Get user from localStorage
    const userData = localStorage.getItem('user');
    if (userData) {
      const parsedUser = JSON.parse(userData);
      setUser(parsedUser);
      fetchDashboardData(parsedUser.id);
      fetchJadwalMendatang(parsedUser.id);
    } else {
      setLoading(false);
    }
    
    // Refresh jadwal setiap 30 detik untuk update status
    const interval = setInterval(() => {
      const currentUserData = localStorage.getItem('user');
      if (currentUserData) {
        const currentUser = JSON.parse(currentUserData);
        fetchJadwalMendatang(currentUser.id);
      }
    }, 30000);
    
    return () => clearInterval(interval);
  }, []);

  const fetchDashboardData = async (userId: number) => {
    try {
      const response = await fetch(`/api/dashboard?user_id=${userId}&role=siswa`);
      const data = await response.json();
      
      if (data.success && data.data) {
        setDashboardData(data.data);
      }
    } catch (error) {
      console.error('Error fetching dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchJadwalMendatang = async (userId: number) => {
    try {
      console.log('Fetching jadwal mendatang for user:', userId);
      // Ambil semua jadwal siswa (tidak hanya dijadwalkan, termasuk menunggu)
      const response = await fetch(`/api/jadwal?siswa_id=${userId}`);
      const data = await response.json();
      
      console.log('Jadwal response:', data);
      
      if (data.success && data.data) {
        // Filter hanya jadwal yang akan datang dan statusnya menunggu, dijadwalkan, atau berlangsung
        const upcoming = data.data
          .filter((jadwal: JadwalKonselingWithRelations) => {
            const status = jadwal.status || 'menunggu';
            const validStatuses = ['menunggu', 'dijadwalkan', 'berlangsung'];
            if (!validStatuses.includes(status)) return false;
            
            const jadwalDate = new Date(`${jadwal.tanggal} ${jadwal.waktu_mulai}`);
            return jadwalDate >= new Date();
          })
          .sort((a: JadwalKonselingWithRelations, b: JadwalKonselingWithRelations) => {
            const dateA = new Date(`${a.tanggal} ${a.waktu_mulai}`).getTime();
            const dateB = new Date(`${b.tanggal} ${b.waktu_mulai}`).getTime();
            return dateA - dateB;
          })
          .slice(0, 5);
        
        console.log('Upcoming jadwal:', upcoming);
        setJadwalMendatang(upcoming);
      } else {
        console.error('Failed to fetch jadwal:', data);
      }
    } catch (error) {
      console.error('Error fetching jadwal:', error);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-400 mb-4">Anda belum login</p>
          <Link href="/login/user" className="text-blue-600  hover:underline">
            Login terlebih dahulu
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 transition-colors duration-300">
      {/* Gooey Navigation */}
      <nav className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 w-[95%] max-w-6xl">
        <div className="relative gooey-nav overflow-hidden">
          {/* Animated Blobs */}
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
                  <div className="text-sm font-bold text-white ">Bimbingan Konseling</div>
                  <div className="text-xs text-gray-400 ">SMK Taruna Bhakti</div>
                </div>
              </Link>
              <div className="flex items-center gap-2">
                <Link
                  href="/home/dasboard"
                  className="px-5 py-2.5 rounded-xl text-blue-600  font-semibold bg-blue-50  relative group"
                >
                  Dashboard
                  <span className="absolute inset-0 rounded-xl bg-gradient-to-r from-blue-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                </Link>
                <Link
                  href="/profile"
                  className="px-5 py-2.5 rounded-xl text-gray-300 hover:text-blue-600  hover:bg-blue-50  transition-all duration-300 font-medium relative group"
                >
                  Profile
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-blue-600 group-hover:w-full transition-all duration-300"></span>
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
              Dashboard
            </h1>
            <p className="text-gray-400 ">
              Ringkasan aktivitas dan informasi bimbingan konseling Anda
            </p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-lg p-6 text-white">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-gray-900/20 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
              </div>
              <h3 className="text-sm font-medium opacity-90 mb-1">Total Konseling</h3>
              <p className="text-3xl font-bold">{loading ? '...' : dashboardData?.total_jadwal || 0}</p>
              <p className="text-xs opacity-75 mt-1">Total sesi</p>
            </div>

            <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl shadow-lg p-6 text-white">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-gray-900/20 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
              </div>
              <h3 className="text-sm font-medium opacity-90 mb-1">Jadwal Mendatang</h3>
              <p className="text-3xl font-bold">{loading ? '...' : dashboardData?.jadwal_mendatang || 0}</p>
              <p className="text-xs opacity-75 mt-1">Konseling terjadwal</p>
            </div>

            <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl shadow-lg p-6 text-white">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-gray-900/20 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                </div>
              </div>
              <h3 className="text-sm font-medium opacity-90 mb-1">Konseling Selesai</h3>
              <p className="text-3xl font-bold">{loading ? '...' : dashboardData?.jadwal_selesai || 0}</p>
              <p className="text-xs opacity-75 mt-1">Sesi selesai</p>
            </div>

            <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl shadow-lg p-6 text-white">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-gray-900/20 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
              <h3 className="text-sm font-medium opacity-90 mb-1">Menunggu</h3>
              <p className="text-3xl font-bold">{loading ? '...' : jadwalMendatang.filter(j => j.status === 'menunggu').length || 0}</p>
              <p className="text-xs opacity-75 mt-1">Menunggu persetujuan</p>
            </div>
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Jadwal Mendatang */}
            <div className="lg:col-span-2 bg-gray-900 rounded-xl shadow-lg p-6 border border-gray-700 ">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-white ">Jadwal Mendatang</h2>
                <Link href="/home" className="text-sm text-blue-600  hover:underline">
                  Lihat semua
                </Link>
              </div>
              {loading ? (
                <div className="text-center py-12">
                  <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                  <p className="mt-4 text-gray-500 ">Memuat jadwal...</p>
                </div>
              ) : jadwalMendatang.length === 0 ? (
                <div className="text-center py-12">
                  <svg className="w-16 h-16 mx-auto text-gray-400  mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <p className="text-gray-500  mb-2">Belum ada jadwal konseling</p>
                  <p className="text-sm text-gray-400 ">Jadwal akan diatur oleh guru atau admin</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {jadwalMendatang.map((jadwal) => (
                    <div key={jadwal.id} className="border border-gray-700 rounded-lg p-4 hover:bg-gray-800 transition-colors">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h4 className="font-semibold text-white mb-1">{jadwal.nama_guru}</h4>
                          <p className="text-sm text-gray-400 mb-2">{jadwal.nama_layanan}</p>
                          <div className="flex items-center gap-4 text-sm text-gray-500 ">
                            <span>{new Date(jadwal.tanggal).toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
                            <span>{jadwal.waktu_mulai} - {jadwal.waktu_selesai}</span>
                          </div>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          (jadwal.status || 'menunggu') === 'dijadwalkan' 
                            ? 'bg-blue-900/50 text-blue-400' :
                          (jadwal.status || 'menunggu') === 'berlangsung' 
                            ? 'bg-green-900/50 text-green-400' :
                          (jadwal.status || 'menunggu') === 'menunggu'
                            ? 'bg-yellow-900/50 text-yellow-400' :
                          'bg-gray-900/50 text-gray-400'
                        }`}>
                          {(jadwal.status || 'menunggu') === 'dijadwalkan' 
                            ? 'Dijadwalkan' :
                          (jadwal.status || 'menunggu') === 'berlangsung' 
                            ? 'Berlangsung' :
                          (jadwal.status || 'menunggu') === 'menunggu'
                            ? 'Menunggu Persetujuan' :
                          'Tidak Diketahui'}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Quick Actions */}
            <div className="bg-gray-900 rounded-xl shadow-lg p-6 border border-gray-700 ">
              <h2 className="text-xl font-bold text-white mb-6">Aksi Cepat</h2>
              <div className="space-y-3">
                <Link
                  href="/home#pilih-guru"
                  className="block w-full px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold text-center transition-colors duration-300"
                >
                  Pilih Guru BK
                </Link>
                <Link
                  href="/history"
                  className="block w-full px-4 py-3 bg-gray-800 hover:bg-gray-600 text-white rounded-lg font-semibold text-center transition-colors duration-300"
                >
                  Lihat History
                </Link>
                <button className="block w-full px-4 py-3 bg-gray-800 hover:bg-gray-600 text-white rounded-lg font-semibold text-center transition-colors duration-300">
                  Download Laporan
                </button>
              </div>
          </div>
          </div>
          </div>
        </div>
      </div>
    );
  }