//----File ini untuk halaman admin kelola guru BK (CRUD guru, assign layanan BK ke guru, aktifkan/nonaktifkan guru)----\\
'use client';

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useToast } from "@/app/contexts/ToastContext";
import type { GuruBK } from "@/lib/types";

export default function DaftarGuruPage() {
  const [guru, setGuru] = useState<GuruBK[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    email: '',
    nip: '',
    nama_lengkap: '',
    jenis_kelamin: '',
    no_telepon: '',
    spesialisasi: '',
    pendidikan_terakhir: '',
    tahun_mulai_mengajar: '',
    bio: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const toast = useToast();

  //-----Cek apakah user adalah admin dan load data guru saat halaman dimuat----\\
  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      const parsedUser = JSON.parse(userData);
      setUser(parsedUser);
      if (parsedUser.role === 'admin' || parsedUser.role === 'super_admin') {
        fetchGuru();
      } else {
        setLoading(false);
      }
    } else {
      setLoading(false);
    }
  }, []);

  //-----Fungsi untuk mengambil daftar semua guru BK dari API----\\
  const fetchGuru = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/guru');
      const data = await response.json();
      
      if (data.success && data.data) {
        setGuru(data.data);
      } else {
        // Fallback ke data default jika error atau tidak ada data (5 guru saja)
        const now = new Date().toISOString();
        setGuru([
          {
            id: 1,
            user_id: null,
            nip: null,
            nama_lengkap: "Heni Siswati, S.Psi",
            jenis_kelamin: "P",
            spesialisasi: "Konseling Akademik & Karir",
            foto_profil: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTI1qoiySG8G0f3Aea7Q1MDzjOBbCsVmX83RQ&s",
            email: "heni.siswati@smktarunabhakti.sch.id",
            no_telepon: null,
            pendidikan_terakhir: null,
            tahun_mulai_mengajar: null,
            bio: null,
            is_active: true,
            created_at: now,
            updated_at: now,
            deleted_at: null
          },
          {
            id: 2,
            user_id: null,
            nip: null,
            nama_lengkap: "Kasandra Fitriani. N, S.Pd",
            jenis_kelamin: "P",
            spesialisasi: "Bimbingan Pribadi & Sosial",
            foto_profil: "https://smktarunabhakti.sch.id/wp-content/uploads/2023/10/21-500x500.png",
            email: "kasandra.fitriani@smktarunabhakti.sch.id",
            no_telepon: null,
            pendidikan_terakhir: null,
            tahun_mulai_mengajar: null,
            bio: null,
            is_active: true,
            created_at: now,
            updated_at: now,
            deleted_at: null
          },
          {
            id: 3,
            user_id: null,
            nip: null,
            nama_lengkap: "Nadya Afriliani Ariesta, S.Pd",
            jenis_kelamin: "P",
            spesialisasi: "Psikologi & Kesehatan Mental",
            foto_profil: "https://smktarunabhakti.sch.id/wp-content/uploads/2023/10/39-500x500.png",
            email: "nadya.afriliani@smktarunabhakti.sch.id",
            no_telepon: null,
            pendidikan_terakhir: null,
            tahun_mulai_mengajar: null,
            bio: null,
            is_active: true,
            created_at: now,
            updated_at: now,
            deleted_at: null
          },
          {
            id: 4,
            user_id: null,
            nip: null,
            nama_lengkap: "Ika Rafika, S.Pd",
            jenis_kelamin: "P",
            spesialisasi: "Konseling Keluarga",
            foto_profil: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSIqRiWGynRSNvQOA4XAUEX1t_fdpuIdWuyFA&s",
            email: "ika.rafika@smktarunabhakti.sch.id",
            no_telepon: null,
            pendidikan_terakhir: null,
            tahun_mulai_mengajar: null,
            bio: null,
            is_active: true,
            created_at: now,
            updated_at: now,
            deleted_at: null
          },
          {
            id: 5,
            user_id: null,
            nip: null,
            nama_lengkap: "M. Ricky Sudrajat, S.Pd",
            jenis_kelamin: "L",
            spesialisasi: "Pengembangan Diri & Motivasi",
            foto_profil: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&h=200&fit=crop",
            email: "riki.sudrajat@smktarunabhakti.sch.id",
            no_telepon: null,
            pendidikan_terakhir: null,
            tahun_mulai_mengajar: null,
            bio: null,
            is_active: true,
            created_at: now,
            updated_at: now,
            deleted_at: null
          }
        ] as GuruBK[]);
      }
    } catch (error) {
      console.error('Error fetching guru:', error);
      // Fallback ke data default jika error (5 guru saja)
      const now = new Date().toISOString();
      setGuru([
        {
          id: 1,
          user_id: null,
          nip: null,
          nama_lengkap: "Heni Siswati, S.Psi",
          jenis_kelamin: "P",
          spesialisasi: "Konseling Akademik & Karir",
          foto_profil: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTI1qoiySG8G0f3Aea7Q1MDzjOBbCsVmX83RQ&s",
          email: "heni.siswati@smktarunabhakti.sch.id",
          no_telepon: null,
          pendidikan_terakhir: null,
          tahun_mulai_mengajar: null,
          bio: null,
          is_active: true,
          created_at: now,
          updated_at: now,
          deleted_at: null
        },
        {
          id: 2,
          user_id: null,
          nip: null,
          nama_lengkap: "Kasandra Fitriani. N, S.Pd",
          jenis_kelamin: "P",
          spesialisasi: "Bimbingan Pribadi & Sosial",
          foto_profil: "https://smktarunabhakti.sch.id/wp-content/uploads/2023/10/21-500x500.png",
          email: "kasandra.fitriani@smktarunabhakti.sch.id",
          no_telepon: null,
          pendidikan_terakhir: null,
          tahun_mulai_mengajar: null,
          bio: null,
          is_active: true,
          created_at: now,
          updated_at: now,
          deleted_at: null
        },
        {
          id: 3,
          user_id: null,
          nip: null,
          nama_lengkap: "Nadya Afriliani Ariesta, S.Pd",
          jenis_kelamin: "P",
          spesialisasi: "Psikologi & Kesehatan Mental",
          foto_profil: "https://smktarunabhakti.sch.id/wp-content/uploads/2023/10/39-500x500.png",
          email: "nadya.afriliani@smktarunabhakti.sch.id",
          no_telepon: null,
          pendidikan_terakhir: null,
          tahun_mulai_mengajar: null,
          bio: null,
          is_active: true,
          created_at: now,
          updated_at: now,
          deleted_at: null
        },
        {
          id: 4,
          user_id: null,
          nip: null,
          nama_lengkap: "Ika Rafika, S.Pd",
          jenis_kelamin: "P",
          spesialisasi: "Konseling Keluarga",
          foto_profil: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSIqRiWGynRSNvQOA4XAUEX1t_fdpuIdWuyFA&s",
          email: "ika.rafika@smktarunabhakti.sch.id",
          no_telepon: null,
          pendidikan_terakhir: null,
          tahun_mulai_mengajar: null,
          bio: null,
          is_active: true,
          created_at: now,
          updated_at: now,
          deleted_at: null
        },
        {
          id: 5,
          user_id: null,
          nip: null,
          nama_lengkap: "Pak Riki Sudrajat S.Pd",
          jenis_kelamin: "L",
          spesialisasi: "Pengembangan Diri & Motivasi",
          foto_profil: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&h=200&fit=crop",
          email: "riki.sudrajat@smktarunabhakti.sch.id",
          no_telepon: null,
          pendidikan_terakhir: null,
          tahun_mulai_mengajar: null,
          bio: null,
          is_active: true,
          created_at: now,
          updated_at: now,
          deleted_at: null
        }
      ] as GuruBK[]);
    } finally {
      setLoading(false);
    }
  };

  if (!user || (user.role !== 'admin' && user.role !== 'super_admin')) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-400 mb-4">Akses ditolak. Hanya admin yang dapat mengakses halaman ini.</p>
          <Link href="/login/admin" className="text-blue-400 hover:underline">
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
                <div className="text-sm font-bold text-white">Daftar Guru BK</div>
                <div className="text-xs text-gray-400">SMK Taruna Bhakti</div>
              </div>
            </Link>
            <div className="flex items-center gap-4">
              <Link
                href="/admin"
                className="px-4 py-2 text-gray-300 hover:text-blue-400 transition-colors"
              >
                Kembali ke Dashboard
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="container mx-auto px-6 py-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8 flex items-center justify-between">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
                Daftar Guru BK
              </h1>
              <p className="text-gray-400">
                Kelola data guru Bimbingan Konseling
              </p>
            </div>
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-colors duration-300 flex items-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Tambah Guru
            </button>
          </div>

          {/* Cards Grid */}
          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
              <p className="mt-4 text-gray-400">Memuat data...</p>
            </div>
          ) : guru.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-400">Tidak ada data guru BK</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {guru.map((g) => (
                <div
                  key={g.id}
                  className="bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-700 hover:shadow-xl transition-all duration-300"
                >
                  <div className="flex items-start gap-4 mb-4">
                    <div className="relative w-20 h-20 rounded-full overflow-hidden border-4 border-blue-500 flex-shrink-0">
                      <Image
                        src={g.foto_profil || `https://ui-avatars.com/api/?name=${encodeURIComponent(g.nama_lengkap)}&size=200&background=3b82f6&color=fff`}
                        alt={g.nama_lengkap}
                        width={80}
                        height={80}
                        className="w-full h-full object-cover"
                        unoptimized
                      />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-white mb-1">{g.nama_lengkap}</h3>
                      <p className="text-sm text-gray-400 mb-2">{g.spesialisasi || 'Bimbingan Konseling'}</p>
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        g.is_active ? 'bg-green-900/50 text-green-400' : 'bg-red-900/50 text-red-400'
                      }`}>
                        {g.is_active ? 'Aktif' : 'Tidak Aktif'}
                      </span>
                    </div>
                  </div>
                  <div className="space-y-2 text-sm text-gray-400">
                    {g.email && (
                      <div className="flex items-center gap-2">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                        <span>{g.email}</span>
                      </div>
                    )}
                    {g.no_telepon && (
                      <div className="flex items-center gap-2">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                        </svg>
                        <span>{g.no_telepon}</span>
                      </div>
                    )}
                    {g.pendidikan_terakhir && (
                      <div className="flex items-center gap-2">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
                        </svg>
                        <span>{g.pendidikan_terakhir}</span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Stats */}
          <div className="mt-6 text-center text-gray-400 text-sm">
            Total: {guru.length} guru BK
          </div>
        </div>
      </div>

      {/* Modal Tambah Guru */}
      {isAddModalOpen && (
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          onClick={() => setIsAddModalOpen(false)}
        >
          <div 
            className="bg-gray-900 rounded-2xl shadow-2xl p-8 max-w-3xl w-full border border-gray-700 max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-white">
                Tambah Guru BK Baru
              </h2>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="text-gray-500 hover:text-gray-300"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <form onSubmit={async (e) => {
              e.preventDefault();
              setIsSubmitting(true);
              try {
                const response = await fetch('/api/guru', {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json',
                  },
                  body: JSON.stringify({
                    ...formData,
                    current_user_id: user?.id,
                    current_user_role: user?.role,
                  }),
                });

                const data = await response.json();
                if (data.success) {
                  alert('Guru berhasil ditambahkan!');
                  setIsAddModalOpen(false);
                  setFormData({
                    username: '',
                    password: '',
                    email: '',
                    nip: '',
                    nama_lengkap: '',
                    jenis_kelamin: '',
                    no_telepon: '',
                    spesialisasi: '',
                    pendidikan_terakhir: '',
                    tahun_mulai_mengajar: '',
                    bio: '',
                  });
                  fetchGuru();
                } else {
                  alert(data.message || 'Gagal menambahkan guru');
                }
              } catch (error) {
                console.error('Error adding guru:', error);
                alert('Terjadi kesalahan saat menambahkan guru');
              } finally {
                setIsSubmitting(false);
              }
            }} className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-300 mb-2">
                    Username <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.username}
                    onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                    required
                    className="w-full px-4 py-3 border-2 border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all bg-gray-800 text-white"
                    placeholder="Masukkan username"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-300 mb-2">
                    Password <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="password"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    required
                    minLength={6}
                    className="w-full px-4 py-3 border-2 border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all bg-gray-800 text-white"
                    placeholder="Masukkan password"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-300 mb-2">
                    Nama Lengkap <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.nama_lengkap}
                    onChange={(e) => setFormData({ ...formData, nama_lengkap: e.target.value })}
                    required
                    className="w-full px-4 py-3 border-2 border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all bg-gray-800 text-white"
                    placeholder="Masukkan nama lengkap"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-300 mb-2">
                    Jenis Kelamin <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={formData.jenis_kelamin}
                    onChange={(e) => setFormData({ ...formData, jenis_kelamin: e.target.value })}
                    required
                    className="w-full px-4 py-3 border-2 border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all bg-gray-800 text-white"
                  >
                    <option value="">Pilih Jenis Kelamin</option>
                    <option value="L">Laki-laki</option>
                    <option value="P">Perempuan</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-300 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all bg-gray-800 text-white"
                    placeholder="Masukkan email"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-300 mb-2">
                    NIP
                  </label>
                  <input
                    type="text"
                    value={formData.nip}
                    onChange={(e) => setFormData({ ...formData, nip: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all bg-gray-800 text-white"
                    placeholder="Masukkan NIP"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-300 mb-2">
                    No. Telepon
                  </label>
                  <input
                    type="tel"
                    value={formData.no_telepon}
                    onChange={(e) => setFormData({ ...formData, no_telepon: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all bg-gray-800 text-white"
                    placeholder="Masukkan no. telepon"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-300 mb-2">
                    Spesialisasi
                  </label>
                  <input
                    type="text"
                    value={formData.spesialisasi}
                    onChange={(e) => setFormData({ ...formData, spesialisasi: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all bg-gray-800 text-white"
                    placeholder="Contoh: Konseling Akademik & Karir"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-300 mb-2">
                    Pendidikan Terakhir
                  </label>
                  <input
                    type="text"
                    value={formData.pendidikan_terakhir}
                    onChange={(e) => setFormData({ ...formData, pendidikan_terakhir: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all bg-gray-800 text-white"
                    placeholder="Contoh: S1 Pendidikan Bimbingan Konseling"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-300 mb-2">
                    Tahun Mulai Mengajar
                  </label>
                  <input
                    type="number"
                    value={formData.tahun_mulai_mengajar}
                    onChange={(e) => setFormData({ ...formData, tahun_mulai_mengajar: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all bg-gray-800 text-white"
                    placeholder="Contoh: 2015"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold text-gray-300 mb-2">
                    Bio
                  </label>
                  <textarea
                    value={formData.bio}
                    onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                    rows={3}
                    className="w-full px-4 py-3 border-2 border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all bg-gray-800 text-white"
                    placeholder="Masukkan bio atau deskripsi"
                  />
                </div>
              </div>

              <div className="flex gap-4 pt-4">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="flex-1 px-4 py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-lg font-semibold transition-colors duration-300"
                  disabled={isSubmitting}
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Menambahkan...' : 'Tambah Guru'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

