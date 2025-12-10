//----File ini untuk halaman jadwal guru BK (menampilkan semua jadwal konseling guru, update status jadwal, tambah catatan konseling)----\\
'use client';

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { useToast } from "@/app/contexts/ToastContext";

interface JadwalKonseling {
  id: number;
  siswa_id: number;
  guru_id: number;
  layanan_id: number;
  tanggal: string;
  waktu_mulai: string;
  waktu_selesai: string;
  alasan_konseling: string;
  status: string;
  nama_siswa: string;
  nisn: string;
  nama_layanan: string;
  created_at: string;
}

export default function GuruJadwalPage() {
  const [jadwal, setJadwal] = useState<JadwalKonseling[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('');
  const [user, setUser] = useState<any>(null);
  const [guruId, setGuruId] = useState<number | null>(null);
  const toast = useToast();

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      const parsedUser = JSON.parse(userData);
      setUser(parsedUser);
      
      if (parsedUser.role !== 'guru') {
        setLoading(false);
        return;
      }

      fetchGuruId(parsedUser.id);
    } else {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (guruId) {
      fetchJadwal();
    }
  }, [guruId, filterStatus]);

  const fetchGuruId = async (userId: number) => {
    try {
      const response = await fetch('/api/guru');
      const data = await response.json();
      
      if (data.success && data.data) {
        const guru = data.data.find((g: any) => g.user_id === userId);
        if (guru) {
          setGuruId(guru.id);
        }
      }
    } catch (error) {
      console.error('Error fetching guru ID:', error);
      setLoading(false);
    }
  };

  const fetchJadwal = async () => {
    if (!guruId) return;
    
    try {
      setLoading(true);
      let url = `/api/jadwal?guru_id=${guruId}`;
      if (filterStatus) {
        url += `&status=${encodeURIComponent(filterStatus)}`;
      }

      const response = await fetch(url);
      const data = await response.json();
      
      if (data.success && data.data) {
        console.log('Jadwal data:', data.data);
        setJadwal(data.data);
      } else {
        console.error('Failed to fetch jadwal:', data);
      }
    } catch (error) {
      console.error('Error fetching jadwal:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (jadwalId: number, newStatus: string) => {
    try {
      console.log('Updating status:', { jadwalId, newStatus });
      const response = await fetch(`/api/jadwal/${jadwalId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      });

      // Check if response is ok before parsing JSON
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Update failed - HTTP error:', response.status, errorText);
        let errorMessage = 'Gagal mengupdate status';
        try {
          const errorData = JSON.parse(errorText);
          errorMessage = errorData.message || errorMessage;
        } catch {
          errorMessage = errorText || `HTTP ${response.status}: ${response.statusText}`;
        }
        toast.error(errorMessage);
        return;
      }

      const data = await response.json();
      console.log('Update response:', data);
      
      if (data.success) {
        // Update local state immediately
        setJadwal(prevJadwal => 
          prevJadwal.map(j => 
            j.id === jadwalId ? { ...j, status: newStatus } : j
          )
        );
        
        // Refresh jadwal to get latest data
        await fetchJadwal();
        
        // Show success message
        toast.success('Status jadwal berhasil diupdate');
      } else {
        console.error('Update failed:', data);
        toast.error(data.message || 'Gagal mengupdate status');
      }
    } catch (error) {
      console.error('Error updating status:', error);
      toast.error('Terjadi kesalahan saat mengupdate status');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'selesai':
        return 'bg-green-900/50 text-green-400';
      case 'berlangsung':
        return 'bg-blue-900/50 text-blue-400';
      case 'dijadwalkan':
        return 'bg-purple-900/50 text-purple-400';
      case 'menunggu':
        return 'bg-yellow-900/50 text-yellow-400';
      case 'dibatalkan':
        return 'bg-red-900/50 text-red-400';
      default:
        return 'bg-gray-900/50 text-gray-400';
    }
  };

  if (!user || user.role !== 'guru') {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-400 mb-4">Akses ditolak. Hanya guru BK yang dapat mengakses halaman ini.</p>
          <Link href="/login/guru" className="text-green-400 hover:underline">
            Login sebagai Guru BK
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 transition-colors duration-300">
      {/* Navbar */}
      <nav className="bg-gray-900 shadow-sm border-b border-gray-700 sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Link href="/guru/dashboard" className="flex items-center gap-3">
              <div className="relative w-12 h-12">
                <Image
                  src="https://smktarunabhakti.sch.id/wp-content/uploads/2020/07/logotbvector-copy.png"
                  alt="Logo SMK Taruna Bhakti"
                  width={48}
                  height={48}
                  className="object-contain"
                  unoptimized
                />
              </div>
              <div>
                <div className="text-sm font-bold text-white">Jadwal Konseling</div>
                <div className="text-xs text-gray-400">SMK Taruna Bhakti</div>
              </div>
            </Link>
            <div className="flex items-center gap-4">
              <Link
                href="/guru/dashboard"
                className="px-4 py-2 text-gray-300 hover:text-green-400 transition-colors"
              >
                Dashboard
              </Link>
              <Link
                href="/profile"
                className="px-4 py-2 text-gray-300 hover:text-green-400 transition-colors"
              >
                Profile
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="container mx-auto px-6 py-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
              Jadwal Konseling Saya
            </h1>
            <p className="text-gray-400">
              Kelola semua jadwal konseling Anda
            </p>
          </div>

          {/* Filter */}
          <div className="bg-gray-800 rounded-xl shadow-lg p-6 mb-6 border border-gray-700">
            <div className="flex items-center gap-4">
              <label className="block text-sm font-semibold text-gray-300">
                Filter Status:
              </label>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-4 py-3 border-2 border-gray-700 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-all bg-gray-900 text-white"
              >
                <option value="">Semua Status</option>
                <option value="menunggu">Menunggu</option>
                <option value="dijadwalkan">Dijadwalkan</option>
                <option value="berlangsung">Berlangsung</option>
                <option value="selesai">Selesai</option>
                <option value="dibatalkan">Dibatalkan</option>
              </select>
            </div>
          </div>

          {/* Table */}
          <div className="bg-gray-800 rounded-xl shadow-lg border border-gray-700 overflow-hidden">
            {loading ? (
              <div className="p-12 text-center">
                <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
                <p className="mt-4 text-gray-400">Memuat data...</p>
              </div>
            ) : jadwal.length === 0 ? (
              <div className="p-12 text-center">
                <p className="text-gray-400">Tidak ada jadwal konseling</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-900 border-b border-gray-700">
                    <tr>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Tanggal</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Waktu</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Siswa</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Layanan</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Status</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-700">
                    {jadwal.map((j) => {
                      console.log('Rendering jadwal:', j.id, 'status:', j.status);
                      return (
                      <tr key={j.id} className="hover:bg-gray-700/50 transition-colors">
                        <td className="px-6 py-4 text-gray-300">
                          {new Date(j.tanggal).toLocaleDateString('id-ID', { 
                            weekday: 'long', 
                            year: 'numeric', 
                            month: 'long', 
                            day: 'numeric' 
                          })}
                        </td>
                        <td className="px-6 py-4 text-gray-300">
                          {j.waktu_mulai} - {j.waktu_selesai}
                        </td>
                        <td className="px-6 py-4">
                          <div>
                            <div className="text-white font-medium">{j.nama_siswa}</div>
                            <div className="text-sm text-gray-400">NISN: {j.nisn}</div>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-gray-300">{j.nama_layanan}</td>
                        <td className="px-6 py-4">
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(j.status || 'menunggu')}`}>
                            {j.status ? (j.status.charAt(0).toUpperCase() + j.status.slice(1)) : 'Menunggu'}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex gap-2">
                            {(j.status === 'menunggu' || !j.status) && (
                              <>
                                <button
                                  onClick={() => updateStatus(j.id, 'dijadwalkan')}
                                  className="px-3 py-1 bg-green-600 hover:bg-green-700 text-white rounded text-sm transition-colors"
                                >
                                  Setujui
                                </button>
                                <button
                                  onClick={() => updateStatus(j.id, 'dibatalkan')}
                                  className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white rounded text-sm transition-colors"
                                >
                                  Tolak
                                </button>
                              </>
                            )}
                            {j.status === 'dijadwalkan' && (
                              <>
                                <button
                                  onClick={() => updateStatus(j.id, 'berlangsung')}
                                  className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded text-sm transition-colors"
                                >
                                  Mulai
                                </button>
                                <button
                                  onClick={() => updateStatus(j.id, 'dibatalkan')}
                                  className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white rounded text-sm transition-colors"
                                >
                                  Batal
                                </button>
                              </>
                            )}
                            {j.status === 'berlangsung' && (
                              <button
                                onClick={() => updateStatus(j.id, 'selesai')}
                                className="px-3 py-1 bg-green-600 hover:bg-green-700 text-white rounded text-sm transition-colors"
                              >
                                Selesai
                              </button>
                            )}
                            {(j.status === 'selesai' || j.status === 'dibatalkan') && (
                              <span className="text-xs text-gray-500 italic">
                                {j.status === 'selesai' ? 'Selesai' : 'Dibatalkan'}
                              </span>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Stats */}
          <div className="mt-6 text-center text-gray-400 text-sm">
            Total: {jadwal.length} jadwal
          </div>
        </div>
      </div>
    </div>
  );
}

