//----File ini untuk halaman profile user (menampilkan dan edit profil user, ganti password, pengaturan notifikasi dan tema)----\\
'use client';

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useToast } from "@/app/contexts/ToastContext";
import type { HistoryKonselingWithRelations, User, PengaturanUser } from "@/lib/types";

export default function ProfilePage() {
  const router = useRouter();
  const toast = useToast();
  
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);
  const [isChangePasswordOpen, setIsChangePasswordOpen] = useState(false);
  const [notifications, setNotifications] = useState(true);
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [name, setName] = useState('John Doe');
  const [nisn, setNisn] = useState('1234567890');
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [history, setHistory] = useState<HistoryKonselingWithRelations[]>([]);
  const [loading, setLoading] = useState(true);
  const [pengaturan, setPengaturan] = useState<PengaturanUser | null>(null);
  const [passwordData, setPasswordData] = useState({
    password_lama: '',
    password_baru: '',
    password_baru_confirm: '',
  });
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  //-----Fungsi untuk mengambil history konseling dari database (hanya untuk siswa)----\\
  const fetchHistory = async (userId: number, userRole: string) => {
    try {
      // Hanya fetch history untuk siswa
      if (userRole === 'siswa') {
        const response = await fetch(`/api/history?siswa_id=${userId}&limit=20`);
        const data = await response.json();
        
        if (data.success && data.data) {
          setHistory(data.data);
        }
      } else {
        setHistory([]);
      }
    } catch (error) {
      console.error('Error fetching history:', error);
    } finally {
      setLoading(false);
    }
  };

  //-----Mengambil data user dari localStorage saat halaman dimuat, dan fetch foto profil guru jika belum ada----\\
  useEffect(() => {
    if (typeof window !== 'undefined') {
      // Load user data from localStorage
      const userData = localStorage.getItem('user');
      if (userData) {
        const parsedUser = JSON.parse(userData);
        setUser(parsedUser);
        setName(parsedUser.nama_lengkap || 'John Doe');
        setNisn(parsedUser.nisn || '1234567890');
        setProfileImage(parsedUser.foto_profil);
        fetchHistory(parsedUser.id, parsedUser.role);
        fetchPengaturan(parsedUser.id);
        
        // Jika role adalah guru dan foto_profil belum ada, fetch dari database
        if (parsedUser.role === 'guru' && !parsedUser.foto_profil) {
          fetchGuruFoto(parsedUser.id);
        }
      } else {
        setLoading(false);
      }
    }
  }, []);

  //-----Fungsi untuk mengambil foto profil guru dari database jika belum ada di localStorage----\\
  const fetchGuruFoto = async (userId: number) => {
    try {
      const response = await fetch('/api/guru');
      const data = await response.json();
      
      if (data.success && data.data) {
        // Find guru by user_id
        const guru = data.data.find((g: any) => g.user_id === userId);
        if (guru && guru.foto_profil) {
          setProfileImage(guru.foto_profil);
          // Update localStorage dengan foto_profil
          const userData = localStorage.getItem('user');
          if (userData) {
            const parsedUser = JSON.parse(userData);
            parsedUser.foto_profil = guru.foto_profil;
            localStorage.setItem('user', JSON.stringify(parsedUser));
            setUser(parsedUser);
          }
        }
      }
    } catch (error) {
      console.error('Error fetching guru foto:', error);
    }
  };

  //-----Fungsi untuk mengambil pengaturan user (notifikasi, email, tema) dari database----\\
  const fetchPengaturan = async (userId: number) => {
    try {
      const response = await fetch(`/api/pengaturan?user_id=${userId}`);
      const data = await response.json();
      
      if (data.success && data.data) {
        setPengaturan(data.data);
        setNotifications(data.data.notifikasi_aktif);
        setEmailNotifications(data.data.notifikasi_email);
      }
    } catch (error) {
      console.error('Error fetching pengaturan:', error);
    }
  };
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
              <Link href={user?.role === 'siswa' ? '/home/dasboard' : user?.role === 'guru' ? '/guru/dashboard' : '/admin'} className="flex items-center gap-3 group">
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
                  href={user?.role === 'siswa' ? '/home/dasboard' : user?.role === 'guru' ? '/guru/dashboard' : '/admin'}
                  className={`px-5 py-2.5 rounded-xl transition-all duration-300 font-medium relative group ${
                    user?.role === 'siswa' 
                      ? 'text-gray-300 hover:text-blue-600 hover:bg-blue-50' 
                      : 'text-gray-300 hover:text-green-600 hover:bg-green-50'
                  }`}
                >
                  Dashboard
                  <span className={`absolute bottom-0 left-0 w-0 h-0.5 group-hover:w-full transition-all duration-300 ${
                    user?.role === 'siswa' ? 'bg-blue-600' : 'bg-green-600'
                  }`}></span>
                </Link>
                <Link
                  href="/profile"
                  className={`px-5 py-2.5 rounded-xl font-semibold relative group ${
                    user?.role === 'siswa'
                      ? 'text-blue-600 bg-blue-50'
                      : 'text-green-600 bg-green-50'
                  }`}
                >
                  Profile
                  <span className={`absolute inset-0 rounded-xl bg-gradient-to-r opacity-0 group-hover:opacity-100 transition-opacity duration-300 ${
                    user?.role === 'siswa'
                      ? 'from-blue-500/10 to-purple-500/10'
                      : 'from-green-500/10 to-emerald-500/10'
                  }`}></span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-6 py-12 pt-32">
        <div className="max-w-4xl mx-auto">
          {/*-----Header profil user (foto, nama, email, tombol edit dan logout)----\\*/}
          <div className="bg-gray-900 rounded-2xl shadow-xl overflow-hidden mb-6 border border-gray-700 ">
            <div className="h-32 relative">
              <Image
                src="https://lh3.googleusercontent.com/gps-cs-s/AG0ilSwmtMlJl_cZDFJKXP6TlQ3BKtxaceL1YGDvr3vToK0vwFjRjYCm1vSBrwYU06ISxE9jOqVAgr0LCHYnA_WLUVSaySoG4y8DLNuLLZMLm2E_XF6vQgFJQtSD_zwTOpyXolHGmxsclQ=s1360-w1360-h1020-rw"
                alt="Background"
                fill
                className="object-cover"
                priority
                unoptimized
              />
              <div className="absolute inset-0 backdrop-blur-sm bg-gray-900/40 "></div>
            </div>
            <div className="px-8 pb-8 -mt-16 relative z-10">
              <div className="flex flex-col md:flex-row items-start md:items-end gap-6">
                <div className="w-32 h-32 rounded-full bg-gradient-to-br from-blue-600 to-blue-400 p-1">
                  {profileImage ? (
                    <div className="w-full h-full rounded-full overflow-hidden">
                      <Image
                        src={profileImage}
                        alt={name}
                        width={128}
                        height={128}
                        className="w-full h-full object-cover"
                        unoptimized
                      />
                    </div>
                  ) : (
                    <div className="w-full h-full rounded-full bg-gray-900 flex items-center justify-center text-4xl font-bold text-blue-600 ">
                      {name.split(' ').map(n => n[0]).join('').toUpperCase()}
                    </div>
                  )}
                </div>
                <div className="flex-1">
                  <h1 className="text-3xl font-bold text-white mb-2">{name}</h1>
                  {user && (
                    <>
                      {user.role === 'siswa' && user.nisn && (
                        <p className="text-gray-400 ">NISN: {user.nisn}</p>
                      )}
                      {user.role === 'guru' && (
                        <p className="text-gray-400 ">Guru Bimbingan Konseling</p>
                      )}
                      {(user.role === 'admin' || user.role === 'super_admin') && (
                        <p className="text-gray-400 ">{user.role === 'super_admin' ? 'Super Administrator' : 'Administrator'}</p>
                      )}
                      <div className="mt-2 text-sm text-gray-500 ">
                        {user.kelas && <span>Kelas: {user.kelas}</span>}
                        {user.jurusan && <span className="ml-4">Jurusan: {user.jurusan}</span>}
                        {user.email && <span className="ml-4">Email: {user.email}</span>}
                      </div>
                    </>
                  )}
                </div>
                <div className="flex gap-3">
                  <button 
                    onClick={() => setIsEditProfileOpen(true)}
                    className="px-6 py-2 bg-gradient-to-r from-blue-700 to-blue-500 text-white rounded-lg font-semibold hover:shadow-lg transition-all"
                  >
                    Edit Profile
                  </button>
                  <button 
                    onClick={() => {
                      if (confirm('Apakah Anda yakin ingin logout?')) {
                        localStorage.removeItem('user');
                        router.push('/');
                      }
                    }}
                    className="px-6 py-2 bg-gradient-to-r from-red-700 to-red-500 text-white rounded-lg font-semibold hover:shadow-lg transition-all"
                  >
                    Logout
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/*-----Kartu statistik (jumlah sesi konseling dan konseling selesai)----\\*/}
          <div className="grid md:grid-cols-2 gap-6 mb-6">
            <div className="bg-gray-900 rounded-xl shadow-lg p-6 border border-gray-700 ">
              <div className="text-3xl font-bold text-blue-600  mb-2">
                {loading ? '...' : history.length}
              </div>
              <div className="text-gray-400 ">Sesi Konseling</div>
            </div>
            <div className="bg-gray-900 rounded-xl shadow-lg p-6 border border-gray-700 ">
              <div className="text-3xl font-bold text-blue-600  mb-2">
                {loading ? '...' : history.filter(h => h.status === 'selesai').length}
              </div>
              <div className="text-gray-400 ">Konseling Selesai</div>
            </div>
          </div>

          {/*-----Section history konseling (hanya ditampilkan untuk siswa)----\\*/}
          {user && user.role === 'siswa' && (
          <div className="bg-gray-900 rounded-xl shadow-lg p-6 border border-gray-700 mb-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-white ">History Konseling</h2>
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-blue-600 " fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="text-sm text-gray-400 ">Total: {history.length} sesi</span>
              </div>
            </div>
            
            {loading ? (
              <div className="text-center py-12">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                <p className="mt-4 text-gray-500 ">Memuat history...</p>
              </div>
            ) : (
              <div className="space-y-4">
                {history.map((item) => (
                  <div
                    key={item.id}
                    className="border-l-4 border-blue-500  bg-gray-800 rounded-r-lg p-5 hover:shadow-md transition-all duration-300"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                            {item.nama_guru?.split(' ').map((n: string) => n[0]).join('') || 'GK'}
                          </div>
                          <div>
                            <h3 className="font-bold text-white text-lg">
                              {item.nama_guru || 'Guru BK'}
                            </h3>
                            <p className="text-sm text-blue-600  font-medium">
                              {item.nama_layanan || 'Konseling'}
                            </p>
                          </div>
                        </div>
                      </div>
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          (item.status as string) === 'selesai'
                            ? 'bg-green-900/50 text-green-400'
                            : (item.status as string) === 'dibatalkan'
                            ? 'bg-red-900/50 text-red-400'
                            : (item.status as string) === 'berlangsung'
                            ? 'bg-blue-900/50 text-blue-400'
                            : (item.status as string) === 'dijadwalkan'
                            ? 'bg-purple-900/50 text-purple-400'
                            : (item.status as string) === 'menunggu'
                            ? 'bg-yellow-900/50 text-yellow-400'
                            : 'bg-gray-900/50 text-gray-400'
                        }`}
                      >
                        {(item.status as string) === 'selesai' 
                          ? 'Selesai' 
                          : (item.status as string) === 'dibatalkan' 
                          ? 'Dibatalkan' 
                          : (item.status as string) === 'berlangsung'
                          ? 'Berlangsung'
                          : (item.status as string) === 'dijadwalkan'
                          ? 'Dijadwalkan'
                          : (item.status as string) === 'menunggu'
                          ? 'Menunggu'
                          : 'Tidak Diketahui'}
                      </span>
                    </div>
                    
                    <div className="grid md:grid-cols-2 gap-4 mb-3">
                      <div className="flex items-center gap-2 text-gray-400 ">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <span className="text-sm font-medium">
                          {new Date(item.tanggal_konseling).toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-400 ">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span className="text-sm font-medium">{item.waktu_mulai} - {item.waktu_selesai}</span>
                      </div>
                    </div>
                    
                    {item.alasan_konseling && (
                      <div className="bg-gray-900 rounded-lg p-4 border border-gray-700 ">
                        <div className="flex items-start gap-2">
                          <svg className="w-5 h-5 text-blue-600  mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                          </svg>
                          <div>
                            <p className="text-xs font-semibold text-gray-500  uppercase tracking-wide mb-1">
                              Alasan Konseling
                            </p>
                            <p className="text-sm text-gray-300 leading-relaxed">
                              {item.alasan_konseling}
                            </p>
                          </div>
                        </div>
                      </div>
                    )}

                    {item.catatan_guru && (
                      <div className="bg-blue-50  rounded-lg p-4 border border-blue-200  mt-3">
                        <p className="text-xs font-semibold text-blue-700  uppercase tracking-wide mb-1">
                          Catatan Guru
                        </p>
                        <p className="text-sm text-blue-900  leading-relaxed">
                          {item.catatan_guru}
                        </p>
                      </div>
                    )}

                    {item.rating && (
                      <div className="mt-3 flex items-center gap-2">
                        <span className="text-sm text-gray-400 ">Rating:</span>
                        <div className="flex">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <svg
                              key={star}
                              className={`w-5 h-5 ${star <= item.rating! ? 'text-yellow-400' : 'text-gray-300'}`}
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
            
            {!loading && history.length === 0 && (
              <div className="text-center py-12">
                <svg className="w-16 h-16 mx-auto text-gray-400  mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <p className="text-gray-500 ">Belum ada history konseling</p>
              </div>
            )}
          </div>
          )}

          {/*-----Section pengaturan (notifikasi, email, tema)----\\*/}
          <div className="bg-gray-900 rounded-xl shadow-lg p-6 border border-gray-700 mb-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-white ">Pengaturan</h2>
              <div className="flex gap-2">
                <button
                  onClick={() => setIsChangePasswordOpen(true)}
                  className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-semibold transition-colors duration-300 text-sm"
                >
                  Ubah Password
                </button>
                <button
                  onClick={() => setIsSettingsOpen(true)}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-colors duration-300 text-sm"
                >
                  Buka Pengaturan
                </button>
              </div>
            </div>
            
            <div className="grid md:grid-cols-2 gap-4">
              <div className="flex items-center justify-between p-4 bg-gray-800 rounded-lg">
                <div>
                  <p className="font-medium text-white ">Notifikasi</p>
                  <p className="text-sm text-gray-400 ">{notifications ? 'Aktif' : 'Nonaktif'}</p>
                </div>
                <div className={`w-3 h-3 rounded-full ${notifications ? 'bg-green-500' : 'bg-gray-400'}`}></div>
              </div>
              <div className="flex items-center justify-between p-4 bg-gray-800 rounded-lg">
                <div>
                  <p className="font-medium text-white ">Notifikasi Email</p>
                  <p className="text-sm text-gray-400 ">{emailNotifications ? 'Aktif' : 'Nonaktif'}</p>
                </div>
                <div className={`w-3 h-3 rounded-full ${emailNotifications ? 'bg-green-500' : 'bg-gray-400'}`}></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/*-----Modal untuk mengatur notifikasi dan pengaturan user lainnya----\\*/}
      {isSettingsOpen && (
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          onClick={() => setIsSettingsOpen(false)}
        >
          <div 
            className="bg-gray-900 rounded-2xl shadow-2xl p-8 max-w-2xl w-full border border-gray-700 "
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-white ">
                Pengaturan Profil
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

            {/*-----Form untuk menyimpan pengaturan notifikasi dan email----\\*/}
            <form onSubmit={async (e) => {
              e.preventDefault();
              if (!user) return;
              
              try {
                const response = await fetch('/api/pengaturan', {
                  method: 'PATCH',
                  headers: {
                    'Content-Type': 'application/json',
                  },
                  body: JSON.stringify({
                    user_id: user.id,
                    notifikasi_aktif: notifications,
                    notifikasi_email: emailNotifications,
                    tema_preferensi: 'light',
                  }),
                });

                const data = await response.json();
                if (data.success) {
                  toast.success('Pengaturan berhasil disimpan!');
                  setIsSettingsOpen(false);
                  fetchPengaturan(user.id);
                } else {
                  toast.error('Gagal menyimpan pengaturan');
                }
              } catch (error) {
                console.error('Error saving settings:', error);
                toast.error('Terjadi kesalahan saat menyimpan pengaturan');
              }
            }} className="space-y-6">
              {/*-----Section untuk pengaturan notifikasi (aktif/nonaktif notifikasi dan email)----\\*/}
              <div className="bg-gray-800 rounded-lg p-5">
                <h3 className="text-lg font-semibold text-white mb-4">Notifikasi</h3>
                <div className="space-y-4">
                  <label className="flex items-center justify-between">
                    <div>
                      <span className="text-sm font-medium text-gray-300 ">Aktifkan Notifikasi</span>
                      <p className="text-xs text-gray-500 ">Terima notifikasi untuk jadwal dan aktivitas</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={notifications}
                      onChange={(e) => setNotifications(e.target.checked)}
                      className="w-5 h-5 text-blue-600 border-gray-600 rounded focus:ring-blue-500 bg-gray-900 "
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
                      className="w-5 h-5 text-blue-600 border-gray-600 rounded focus:ring-blue-500 bg-gray-900 "
                    />
                  </label>
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
                  className="flex-1 px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-colors duration-300"
                >
                  Simpan Pengaturan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/*-----Modal untuk mengedit profil user (nama, foto profil, NISN)----\\*/}
      {isEditProfileOpen && (
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          onClick={() => setIsEditProfileOpen(false)}
        >
          <div 
            className="bg-gray-900 rounded-2xl shadow-2xl p-8 max-w-2xl w-full border border-gray-700 "
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-white ">
                Edit Profil
              </h2>
              <button
                onClick={() => setIsEditProfileOpen(false)}
                className="text-gray-500  hover:text-gray-300 "
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/*-----Form untuk mengedit profil user (nama, foto, NISN)----\\*/}
            <form onSubmit={async (e) => {
              e.preventDefault();
              if (!user) return;

              try {
                // Upload foto jika ada perubahan
                let fotoUrl = profileImage;
                
                // Jika foto adalah base64 (dari FileReader), kita simpan sebagai URL
                // Untuk production, sebaiknya upload ke cloud storage (S3, Cloudinary, dll)
                if (profileImage && profileImage.startsWith('data:image')) {
                  // Untuk sekarang, simpan base64 langsung ke database
                  // Di production, upload ke cloud storage dan dapatkan URL
                  fotoUrl = profileImage;
                }

                const response = await fetch('/api/users/profile', {
                  method: 'PATCH',
                  headers: {
                    'Content-Type': 'application/json',
                  },
                  body: JSON.stringify({
                    user_id: user.id,
                    nama_lengkap: name,
                    nisn: user.role === 'siswa' ? nisn : undefined,
                    foto_profil: fotoUrl,
                  }),
                });

                // Cek content type
                const contentType = response.headers.get('content-type');
                if (!contentType || !contentType.includes('application/json')) {
                  const text = await response.text();
                  console.error('Non-JSON response:', text.substring(0, 200));
                  toast.error('Server mengembalikan response yang tidak valid');
                  return;
                }

                const data = await response.json();

                if (data.success && data.user) {
                  // Update localStorage dengan data user yang baru
                  localStorage.setItem('user', JSON.stringify(data.user));
                  setUser(data.user);
                  toast.success('Profil berhasil diperbarui!');
                  setIsEditProfileOpen(false);
                } else {
                  toast.error(data.message || 'Gagal mengupdate profile');
                }
              } catch (error: any) {
                console.error('Error updating profile:', error);
                if (error instanceof SyntaxError && error.message.includes('JSON')) {
                  toast.error('Server mengembalikan response yang tidak valid');
                } else {
                  toast.error('Terjadi kesalahan saat mengupdate profile');
                }
              }
            }} className="space-y-6">
              {/*-----Input untuk mengubah foto profil----\\*/}
              <div className="flex flex-col items-center">
                <div className="relative w-32 h-32 rounded-full bg-gradient-to-br from-blue-600 to-blue-400 p-1 mb-4">
                  {profileImage ? (
                    <div className="w-full h-full rounded-full overflow-hidden">
                      <Image
                        src={profileImage}
                        alt={name}
                        width={128}
                        height={128}
                        className="w-full h-full object-cover"
                        unoptimized
                      />
                    </div>
                  ) : (
                    <div className="w-full h-full rounded-full bg-gray-900 flex items-center justify-center text-4xl font-bold text-blue-600 ">
                      {name.split(' ').map(n => n[0]).join('').toUpperCase()}
                    </div>
                  )}
                </div>
                <label className="cursor-pointer">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        const reader = new FileReader();
                        reader.onloadend = () => {
                          setProfileImage(reader.result as string);
                        };
                        reader.readAsDataURL(file);
                      }
                    }}
                    className="hidden"
                  />
                  <span className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold text-sm transition-colors duration-300 inline-block">
                    Ubah Foto Profil
                  </span>
                </label>
                <p className="text-xs text-gray-500  mt-2">Format: JPG, PNG (Max 2MB)</p>
              </div>

              {/*-----Input untuk mengubah nama lengkap----\\*/}
              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-2">
                  Nama Lengkap
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="w-full px-4 py-3 border-2 border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all bg-gray-900 text-white "
                  placeholder="Masukkan nama lengkap"
                />
              </div>

              {/*-----Input untuk mengubah NISN (hanya ditampilkan untuk siswa)----\\*/}
              {user && user.role === 'siswa' && (
              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-2">
                  NISN
                </label>
                <input
                  type="text"
                  value={nisn}
                  onChange={(e) => setNisn(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all bg-gray-900 text-white "
                  placeholder="Masukkan NISN"
                />
              </div>
              )}

              <div className="flex gap-4 pt-4">
                <button
                  type="button"
                  onClick={() => setIsEditProfileOpen(false)}
                  className="flex-1 px-4 py-3 bg-gray-200  hover:bg-gray-600 text-white rounded-lg font-semibold transition-colors duration-300"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-colors duration-300"
                >
                  Simpan Perubahan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/*-----Modal untuk mengubah password user----\\*/}
      {isChangePasswordOpen && (
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          onClick={() => setIsChangePasswordOpen(false)}
        >
          <div 
            className="bg-gray-900 rounded-2xl shadow-2xl p-8 max-w-2xl w-full border border-gray-700 "
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-white ">
                Ubah Password
              </h2>
              <button
                onClick={() => setIsChangePasswordOpen(false)}
                className="text-gray-500  hover:text-gray-300 "
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/*-----Form untuk mengubah password dengan validasi (password lama, password baru, konfirmasi)----\\*/}
            <form onSubmit={async (e) => {
              e.preventDefault();
              if (!user) return;

              //-----Validasi password baru harus sama dengan konfirmasi password----\\
              if (passwordData.password_baru !== passwordData.password_baru_confirm) {
                toast.warning('Password baru dan konfirmasi password tidak sama');
                return;
              }

              //-----Validasi panjang password minimal 6 karakter----\\
              if (passwordData.password_baru.length < 6) {
                toast.warning('Password baru minimal 6 karakter');
                return;
              }

              setIsChangingPassword(true);
              try {
                const response = await fetch('/api/users/password', {
                  method: 'PATCH',
                  headers: {
                    'Content-Type': 'application/json',
                  },
                  body: JSON.stringify({
                    user_id: user.id,
                    password_lama: passwordData.password_lama,
                    password_baru: passwordData.password_baru,
                    current_user_id: user.id,
                    current_user_role: user.role,
                  }),
                });

                const data = await response.json();
                if (data.success) {
                  toast.success('Password berhasil diubah!');
                  setIsChangePasswordOpen(false);
                  setPasswordData({
                    password_lama: '',
                    password_baru: '',
                    password_baru_confirm: '',
                  });
                } else {
                  toast.error(data.message || 'Gagal mengubah password');
                }
              } catch (error) {
                console.error('Error changing password:', error);
                toast.error('Terjadi kesalahan saat mengubah password');
              } finally {
                setIsChangingPassword(false);
              }
            }} className="space-y-6">
              {/*-----Input untuk password lama----\\*/}
              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-2">
                  Password Lama
                </label>
                <input
                  type="password"
                  value={passwordData.password_lama}
                  onChange={(e) => setPasswordData({ ...passwordData, password_lama: e.target.value })}
                  className="w-full px-4 py-3 border-2 border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all bg-gray-800 text-white "
                  placeholder="Masukkan password lama"
                />
                <p className="text-xs text-gray-500 mt-1">Kosongkan jika lupa password (hanya untuk admin)</p>
              </div>

              {/*-----Input untuk password baru (minimal 6 karakter)----\\*/}
              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-2">
                  Password Baru <span className="text-red-500">*</span>
                </label>
                <input
                  type="password"
                  value={passwordData.password_baru}
                  onChange={(e) => setPasswordData({ ...passwordData, password_baru: e.target.value })}
                  required
                  minLength={6}
                  className="w-full px-4 py-3 border-2 border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all bg-gray-800 text-white "
                  placeholder="Masukkan password baru (min. 6 karakter)"
                />
              </div>

              {/*-----Input untuk konfirmasi password baru----\\*/}
              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-2">
                  Konfirmasi Password Baru <span className="text-red-500">*</span>
                </label>
                <input
                  type="password"
                  value={passwordData.password_baru_confirm}
                  onChange={(e) => setPasswordData({ ...passwordData, password_baru_confirm: e.target.value })}
                  required
                  minLength={6}
                  className="w-full px-4 py-3 border-2 border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all bg-gray-800 text-white "
                  placeholder="Konfirmasi password baru"
                />
              </div>

              <div className="flex gap-4 pt-4">
                <button
                  type="button"
                  onClick={() => setIsChangePasswordOpen(false)}
                  className="flex-1 px-4 py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-lg font-semibold transition-colors duration-300"
                  disabled={isChangingPassword}
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-semibold transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={isChangingPassword}
                >
                  {isChangingPassword ? 'Mengubah...' : 'Ubah Password'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

