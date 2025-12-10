//----File ini untuk halaman dashboard admin (menampilkan statistik sistem, total siswa, guru aktif, jadwal mendatang, dan pengaturan sistem)----\\
'use client';

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useToast } from "@/app/contexts/ToastContext";
import type { DashboardAdmin, PengaturanSistem } from "@/lib/types";

export default function AdminDashboard() {
  const [selectedDate, setSelectedDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [isActive, setIsActive] = useState(false);
  const [isScheduleOpen, setIsScheduleOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [dashboardData, setDashboardData] = useState<DashboardAdmin | null>(null);
  const [pengaturanSistem, setPengaturanSistem] = useState<PengaturanSistem[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  
  // Settings state
  const [notifications, setNotifications] = useState(true);
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [autoBackup, setAutoBackup] = useState(true);
  const [maintenanceMode, setMaintenanceMode] = useState(false);
  const [maxSessions, setMaxSessions] = useState('10');
  const [sessionDuration, setSessionDuration] = useState('60');
  const toast = useToast();

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      const parsedUser = JSON.parse(userData);
      setUser(parsedUser);
      if (parsedUser.role === 'admin' || parsedUser.role === 'super_admin') {
        fetchDashboardData(parsedUser.id, parsedUser.role);
        fetchPengaturanSistem();
      } else {
        setLoading(false);
      }
    } else {
      setLoading(false);
    }
  }, []);

  const fetchDashboardData = async (userId: number, role: string) => {
    try {
      const response = await fetch(`/api/dashboard?user_id=${userId}&role=${role}`);
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

  const fetchPengaturanSistem = async () => {
    try {
      const response = await fetch('/api/pengaturan-sistem');
      const data = await response.json();
      
      if (data.success && data.data) {
        setPengaturanSistem(data.data);
        // Set default values
        const notifAktif = data.data.find((p: PengaturanSistem) => p.key_setting === 'notifikasi_aktif');
        const notifEmail = data.data.find((p: PengaturanSistem) => p.key_setting === 'notifikasi_email');
        const backup = data.data.find((p: PengaturanSistem) => p.key_setting === 'backup_otomatis');
        const maintenance = data.data.find((p: PengaturanSistem) => p.key_setting === 'maintenance_mode');
        const maxSesi = data.data.find((p: PengaturanSistem) => p.key_setting === 'max_sesi_per_hari');
        const durasi = data.data.find((p: PengaturanSistem) => p.key_setting === 'durasi_sesi_menit');
        
        if (notifAktif) setNotifications(notifAktif.value_setting === 'true');
        if (notifEmail) setEmailNotifications(notifEmail.value_setting === 'true');
        if (backup) setAutoBackup(backup.value_setting === 'true');
        if (maintenance) setMaintenanceMode(maintenance.value_setting === 'true');
        if (maxSesi) setMaxSessions(maxSesi.value_setting || '10');
        if (durasi) setSessionDuration(durasi.value_setting || '60');
      }
    } catch (error) {
      console.error('Error fetching pengaturan sistem:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    try {
      const response = await fetch('/api/periode', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          nama_periode: `Periode ${selectedDate} - ${endDate}`,
          tanggal_mulai: selectedDate,
          tanggal_selesai: endDate,
          waktu_mulai: startTime,
          waktu_selesai: endTime,
          is_active: isActive,
          keterangan: `Periode pemilihan guru BK dari ${selectedDate} hingga ${endDate}`,
          created_by: user.id,
        }),
      });

      const data = await response.json();
      if (data.success) {
        toast.success('Pengaturan waktu berhasil disimpan!');
        setIsScheduleOpen(false);
        // Reset form
        setSelectedDate('');
        setEndDate('');
        setStartTime('');
        setEndTime('');
        setIsActive(false);
      } else {
        toast.error(data.message || 'Gagal menyimpan pengaturan');
      }
    } catch (error) {
      console.error('Error saving schedule:', error);
      toast.error('Terjadi kesalahan saat menyimpan pengaturan');
    }
  };

  const handleSettingsSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    try {
      const updates = [
        { key_setting: 'notifikasi_aktif', value_setting: notifications.toString() },
        { key_setting: 'notifikasi_email', value_setting: emailNotifications.toString() },
        { key_setting: 'backup_otomatis', value_setting: autoBackup.toString() },
        { key_setting: 'maintenance_mode', value_setting: maintenanceMode.toString() },
        { key_setting: 'max_sesi_per_hari', value_setting: maxSessions },
        { key_setting: 'durasi_sesi_menit', value_setting: sessionDuration },
      ];

      const promises = updates.map(update =>
        fetch('/api/pengaturan-sistem', {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            ...update,
            updated_by: user.id,
          }),
        })
      );

      const results = await Promise.all(promises);
      const allSuccess = results.every(async (res) => {
        const data = await res.json();
        return data.success;
      });

      if (allSuccess) {
        toast.success('Pengaturan sistem berhasil disimpan!');
        setIsSettingsOpen(false);
      } else {
        toast.warning('Beberapa pengaturan gagal disimpan');
      }
    } catch (error) {
      console.error('Error saving settings:', error);
      toast.error('Terjadi kesalahan saat menyimpan pengaturan');
    }
  };

  if (!user || (user.role !== 'admin' && user.role !== 'super_admin')) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-400 mb-4">Akses ditolak. Hanya admin yang dapat mengakses halaman ini.</p>
          <Link href="/login/admin" className="text-blue-600  hover:underline">
            Login sebagai Admin
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
            <Link href="/admin" className="flex items-center gap-3">
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
                <div className="text-sm font-bold text-white ">Admin Dashboard</div>
                <div className="text-xs text-gray-400 ">SMK Taruna Bhakti</div>
              </div>
            </Link>
            <div className="flex items-center gap-4">
              <Link
                href="/admin/siswa"
                className="px-4 py-2 text-gray-300 hover:text-green-600  transition-colors"
              >
                Siswa
              </Link>
              <Link
                href="/admin/guru"
                className="px-4 py-2 text-gray-300 hover:text-green-600  transition-colors"
              >
                Guru BK
              </Link>
              <Link
                href="/profile"
                className="px-4 py-2 text-gray-300 hover:text-green-600  transition-colors"
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
              Dashboard Admin
            </h1>
            <p className="text-gray-400 ">
              Kelola sistem bimbingan konseling dan atur jadwal untuk siswa
            </p>
          </div>

          {/* Stats Cards */}
          {dashboardData && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-lg p-6 text-white">
                <h3 className="text-sm font-medium opacity-90 mb-1">Total Siswa</h3>
                <p className="text-3xl font-bold">{dashboardData.total_siswa || 0}</p>
              </div>
              <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl shadow-lg p-6 text-white">
                <h3 className="text-sm font-medium opacity-90 mb-1">Guru Aktif</h3>
                <p className="text-3xl font-bold">{dashboardData.total_guru_aktif || 0}</p>
              </div>
              <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl shadow-lg p-6 text-white">
                <h3 className="text-sm font-medium opacity-90 mb-1">Jadwal Mendatang</h3>
                <p className="text-3xl font-bold">{dashboardData.jadwal_mendatang || 0}</p>
              </div>
              <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl shadow-lg p-6 text-white">
                <h3 className="text-sm font-medium opacity-90 mb-1">Konseling Hari Ini</h3>
                <p className="text-3xl font-bold">{dashboardData.konseling_hari_ini || 0}</p>
              </div>
            </div>
          )}

          {/* Tools Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {/* Tool 1: Atur Waktu Pemilihan */}
            <div className="bg-gray-900 rounded-xl shadow-lg p-6 border border-gray-700 hover:shadow-xl transition-all duration-300">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-white ">Atur Waktu Pemilihan</h3>
              </div>
              <p className="text-gray-400 mb-4 text-sm">
                Atur jadwal waktu untuk siswa memilih guru BK
              </p>
              <button
                onClick={() => setIsScheduleOpen(true)}
                className="w-full px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-semibold transition-colors duration-300"
              >
                Buka Pengaturan
              </button>
            </div>

            {/* Tool 2: Kelola Siswa */}
            <div className="bg-gray-900 rounded-xl shadow-lg p-6 border border-gray-700 hover:shadow-xl transition-all duration-300">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-white ">Kelola Siswa</h3>
              </div>
              <p className="text-gray-400 mb-4 text-sm">
                Lihat dan kelola data siswa
              </p>
              <Link
                href="/admin/siswa"
                className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-colors duration-300 text-center block"
              >
                Buka Daftar Siswa
              </Link>
            </div>

            {/* Tool 3: Kelola Jadwal */}
            <div className="bg-gray-900 rounded-xl shadow-lg p-6 border border-gray-700 hover:shadow-xl transition-all duration-300">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-purple-500 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-white ">Kelola Jadwal</h3>
              </div>
              <p className="text-gray-400 mb-4 text-sm">
                Kelola jadwal konseling siswa
              </p>
              <Link
                href="/admin/jadwal"
                className="w-full px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-semibold transition-colors duration-300 text-center block"
              >
                Buka Jadwal
              </Link>
            </div>

            {/* Tool 4: Laporan */}
            <div className="bg-gray-900 rounded-xl shadow-lg p-6 border border-gray-700 hover:shadow-xl transition-all duration-300">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-orange-500 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-white ">Laporan</h3>
              </div>
              <p className="text-gray-400 mb-4 text-sm">
                Lihat laporan dan statistik konseling
              </p>
              <Link
                href="/admin/laporan"
                className="w-full px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-lg font-semibold transition-colors duration-300 text-center block"
              >
                Buka Laporan
              </Link>
            </div>

            {/* Tool 5: Kelola Guru BK */}
            <div className="bg-gray-900 rounded-xl shadow-lg p-6 border border-gray-700 hover:shadow-xl transition-all duration-300">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-indigo-500 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-white ">Kelola Guru BK</h3>
              </div>
              <p className="text-gray-400 mb-4 text-sm">
                Kelola data dan jadwal guru BK
              </p>
              <Link
                href="/admin/guru"
                className="w-full px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-semibold transition-colors duration-300 text-center block"
              >
                Buka Daftar Guru
              </Link>
            </div>

            {/* Tool 6: Pengaturan Sistem */}
            <div className="bg-gray-900 rounded-xl shadow-lg p-6 border border-gray-700 hover:shadow-xl transition-all duration-300">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-gray-500 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-white ">Pengaturan Sistem</h3>
              </div>
              <p className="text-gray-400 mb-4 text-sm">
                Konfigurasi pengaturan sistem
              </p>
              <button 
                onClick={() => setIsSettingsOpen(true)}
                className="w-full px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg font-semibold transition-colors duration-300"
              >
                Buka Pengaturan
              </button>
            </div>
          </div>

          {/* Modal Atur Waktu Pemilihan */}
          {isScheduleOpen && (
            <div 
              className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
              onClick={() => setIsScheduleOpen(false)}
            >
              <div 
                className="bg-gray-900 rounded-2xl shadow-2xl p-8 max-w-2xl w-full border border-gray-700 "
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-white ">
                    Atur Waktu Pemilihan Guru BK
                  </h2>
                  <button
                    onClick={() => setIsScheduleOpen(false)}
                    className="text-gray-500  hover:text-gray-300 "
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-300 mb-2">
                      Tanggal Mulai
                    </label>
                    <input
                      type="date"
                      value={selectedDate}
                      onChange={(e) => setSelectedDate(e.target.value)}
                      required
                      className="w-full px-4 py-3 border-2 border-green-200  rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-all bg-gray-900 text-white "
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-300 mb-2">
                      Tanggal Selesai
                    </label>
                    <input
                      type="date"
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                      required
                      min={selectedDate}
                      className="w-full px-4 py-3 border-2 border-green-200  rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-all bg-gray-900 text-white "
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-300 mb-2">
                      Waktu Mulai (Harian)
                    </label>
                    <input
                      type="time"
                      value={startTime}
                      onChange={(e) => setStartTime(e.target.value)}
                      required
                      className="w-full px-4 py-3 border-2 border-green-200  rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-all bg-gray-900 text-white "
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-300 mb-2">
                      Waktu Selesai (Harian)
                    </label>
                    <input
                      type="time"
                      value={endTime}
                      onChange={(e) => setEndTime(e.target.value)}
                      required
                      min={startTime}
                      className="w-full px-4 py-3 border-2 border-green-200  rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-all bg-gray-900 text-white "
                    />
                  </div>

                  <div>
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={isActive}
                        onChange={(e) => setIsActive(e.target.checked)}
                        className="w-4 h-4 text-green-600 border-green-300  rounded focus:ring-green-500 bg-gray-900 "
                      />
                      <span className="ml-2 text-sm text-gray-400 ">
                        Aktifkan periode pemilihan ini
                      </span>
                    </label>
                  </div>

                  <div className="flex gap-4">
                    <button
                      type="button"
                      onClick={() => setIsScheduleOpen(false)}
                      className="flex-1 px-4 py-3 bg-gray-200  hover:bg-gray-600 text-white rounded-lg font-semibold transition-colors duration-300"
                    >
                      Batal
                    </button>
                    <button
                      type="submit"
                      className="flex-1 px-4 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-semibold transition-colors duration-300"
                    >
                      Simpan Pengaturan
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* Modal Pengaturan Sistem */}
          {isSettingsOpen && (
            <div 
              className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
              onClick={() => setIsSettingsOpen(false)}
            >
              <div 
                className="bg-gray-900 rounded-2xl shadow-2xl p-8 max-w-3xl w-full border border-gray-700 max-h-[90vh] overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-white ">
                    Pengaturan Sistem
                  </h2>
                  <button
                    onClick={() => setIsSettingsOpen(false)}
                    className="text-gray-500  hover:text-gray-300 "
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                <form onSubmit={handleSettingsSubmit} className="space-y-6">
                  {/* Notifikasi */}
                  <div className="bg-gray-800 rounded-lg p-5">
                    <h3 className="text-lg font-semibold text-white mb-4">Notifikasi</h3>
                    <div className="space-y-4">
                      <label className="flex items-center justify-between">
                        <div>
                          <span className="text-sm font-medium text-gray-300 ">Aktifkan Notifikasi</span>
                          <p className="text-xs text-gray-500 ">Terima notifikasi untuk aktivitas sistem</p>
                        </div>
                        <input
                          type="checkbox"
                          checked={notifications}
                          onChange={(e) => setNotifications(e.target.checked)}
                          className="w-5 h-5 text-gray-400 border-gray-600 rounded focus:ring-gray-500 bg-gray-900 "
                        />
                      </label>
                      <label className="flex items-center justify-between">
                        <div>
                          <span className="text-sm font-medium text-gray-300 ">Notifikasi Email</span>
                          <p className="text-xs text-gray-500 ">Kirim notifikasi melalui email</p>
                        </div>
                        <input
                          type="checkbox"
                          checked={emailNotifications}
                          onChange={(e) => setEmailNotifications(e.target.checked)}
                          className="w-5 h-5 text-gray-400 border-gray-600 rounded focus:ring-gray-500 bg-gray-900 "
                        />
                      </label>
                    </div>
                  </div>

                  {/* Backup & Keamanan */}
                  <div className="bg-gray-800 rounded-lg p-5">
                    <h3 className="text-lg font-semibold text-white mb-4">Backup & Keamanan</h3>
                    <div className="space-y-4">
                      <label className="flex items-center justify-between">
                        <div>
                          <span className="text-sm font-medium text-gray-300 ">Backup Otomatis</span>
                          <p className="text-xs text-gray-500 ">Backup data secara otomatis setiap hari</p>
                        </div>
                        <input
                          type="checkbox"
                          checked={autoBackup}
                          onChange={(e) => setAutoBackup(e.target.checked)}
                          className="w-5 h-5 text-gray-400 border-gray-600 rounded focus:ring-gray-500 bg-gray-900 "
                        />
                      </label>
                      <label className="flex items-center justify-between">
                        <div>
                          <span className="text-sm font-medium text-gray-300 ">Mode Maintenance</span>
                          <p className="text-xs text-gray-500 ">Nonaktifkan akses pengguna saat maintenance</p>
                        </div>
                        <input
                          type="checkbox"
                          checked={maintenanceMode}
                          onChange={(e) => setMaintenanceMode(e.target.checked)}
                          className="w-5 h-5 text-gray-400 border-gray-600 rounded focus:ring-gray-500 bg-gray-900 "
                        />
                      </label>
                    </div>
                  </div>

                  {/* Pengaturan Konseling */}
                  <div className="bg-gray-800 rounded-lg p-5">
                    <h3 className="text-lg font-semibold text-white mb-4">Pengaturan Konseling</h3>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          Maksimal Sesi per Hari
                        </label>
                        <input
                          type="number"
                          value={maxSessions}
                          onChange={(e) => setMaxSessions(e.target.value)}
                          min="1"
                          max="50"
                          className="w-full px-4 py-3 border-2 border-gray-700 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-gray-500 outline-none transition-all bg-gray-900 text-white "
                        />
                        <p className="text-xs text-gray-500  mt-1">Jumlah maksimal sesi konseling per hari</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          Durasi Sesi (menit)
                        </label>
                        <input
                          type="number"
                          value={sessionDuration}
                          onChange={(e) => setSessionDuration(e.target.value)}
                          min="15"
                          max="120"
                          step="15"
                          className="w-full px-4 py-3 border-2 border-gray-700 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-gray-500 outline-none transition-all bg-gray-900 text-white "
                        />
                        <p className="text-xs text-gray-500  mt-1">Durasi setiap sesi konseling dalam menit</p>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-4 pt-4">
                    <button
                      type="button"
                      onClick={() => setIsSettingsOpen(false)}
                      className="flex-1 px-4 py-3 bg-gray-200  hover:bg-gray-600 text-white rounded-lg font-semibold transition-colors duration-300"
                    >
                      Batal
                    </button>
                    <button
                      type="submit"
                      className="flex-1 px-4 py-3 bg-gray-600 hover:bg-gray-700 text-white rounded-lg font-semibold transition-colors duration-300"
                    >
                      Simpan Pengaturan
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

