//---File ini adalah halaman home untuk siswa---\\
//---Menampilkan daftar guru BK yang tersedia dan tombol untuk booking konseling---\\

'use client';

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import type { GuruBK } from "@/lib/types";

type Guru = {
  id: number;
  name: string;
  specialty: string;
  image: string;
  layanan?: string[];
};

export default function HomePage() {
  const [selectedGuru, setSelectedGuru] = useState<Guru | null>(null);
  const [guruBK, setGuruBK] = useState<Guru[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<{ role?: string; nama_lengkap?: string } | null>(null);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  //---Menutup dropdown menu user saat klik di luar area dropdown---\\
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setUserMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  //-----Fungsi untuk logout user (hapus data dari localStorage dan redirect ke halaman utama)----\\
  const handleLogout = () => {
    if (confirm('Apakah Anda yakin ingin logout?')) {
      localStorage.removeItem('user');
      router.push('/');
    }
  };

  //-----Cek apakah user sudah login dan redirect sesuai role, lalu fetch daftar guru BK----\\
  useEffect(() => {
    // Check if user is logged in and is a student
    if (typeof window !== 'undefined') {
      const userData = localStorage.getItem('user');
      if (userData) {
        const parsedUser = JSON.parse(userData);
        setUser(parsedUser);
        
        // Redirect jika bukan siswa
        if (parsedUser.role === 'guru') {
          window.location.href = '/guru/dashboard';
          return;
        }
        if (parsedUser.role === 'admin' || parsedUser.role === 'super_admin') {
          window.location.href = '/admin';
          return;
        }
      }
      
      // Selalu fetch guru BK (baik login maupun belum login)
      fetchGuruBK();
    }
  }, []);

  //-----Fungsi untuk mengambil daftar guru BK dari API----\\
  const fetchGuruBK = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/guru?is_active=true');
      
      // Cek content type
      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        throw new Error('Server mengembalikan response yang tidak valid');
      }
      
      const data = await response.json();
      
      if (data.success && data.data && data.data.length > 0) {
        const formattedGurus: Guru[] = data.data.map((guru: GuruBK) => ({
          id: guru.id,
          name: guru.nama_lengkap,
          specialty: guru.spesialisasi || 'Bimbingan Konseling',
          image: guru.foto_profil || `https://ui-avatars.com/api/?name=${encodeURIComponent(guru.nama_lengkap)}&size=200&background=3b82f6&color=fff`,
          layanan: [],
        }));
        setGuruBK(formattedGurus);
      } else {
        // Jika tidak ada data dari API, gunakan fallback
        console.warn('Tidak ada data guru dari API, menggunakan data default');
        setGuruBK(getDefaultGuruData());
      }
    } catch (error) {
      console.error('Error fetching guru:', error);
      // Fallback ke data default jika error
      setGuruBK(getDefaultGuruData());
    } finally {
      setLoading(false);
    }
  };

  // Data default guru (fallback)
  const getDefaultGuruData = (): Guru[] => [
    {
      id: 1,
      name: "Heni Siswati, S.Psi",
      specialty: "Konseling Akademik & Karir",
      image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTI1qoiySG8G0f3Aea7Q1MDzjOBbCsVmX83RQ&s"
    },
    {
      id: 2,
      name: "Kasandra Fitriani. N, S.Pd",
      specialty: "Bimbingan Pribadi & Sosial",
      image: "https://smktarunabhakti.sch.id/wp-content/uploads/2023/10/21-500x500.png"
    },
    {
      id: 3,
      name: "Nadya Afriliani Ariesta, S.Pd",
      specialty: "Psikologi & Kesehatan Mental",
      image: "https://smktarunabhakti.sch.id/wp-content/uploads/2023/10/39-500x500.png"
    },
    {
      id: 4,
      name: "Ika Rafika, S.Pd",
      specialty: "Konseling Keluarga",
      image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSIqRiWGynRSNvQOA4XAUEX1t_fdpuIdWuyFA&s"
    },
    {
      id: 5,
      name: "M. Ricky Sudrajat, S.Pd",
      specialty: "Pengembangan Diri & Motivasi",
      image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&h=200&fit=crop"
    }
  ];

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
                  className="px-5 py-2.5 rounded-xl text-blue-400 font-semibold bg-blue-900/30 relative group"
                >
                  Dashboard
                  <span className="absolute inset-0 rounded-xl bg-gradient-to-r from-blue-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                </Link>
                <Link
                  href="/profile"
                  className="px-5 py-2.5 rounded-xl text-gray-300 hover:text-blue-400 hover:bg-blue-900/20 transition-all duration-300 font-medium relative group"
                >
                  Profile
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-blue-400 group-hover:w-full transition-all duration-300"></span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section dengan Background Image */}
      <section className="pt-48 pb-40 px-6 relative overflow-hidden min-h-[600px]">
        {/* Background Image dengan Blur - Hanya di Hero Section */}
        <div className="absolute inset-0 z-0">
          <Image
            src="https://lh3.googleusercontent.com/gps-cs-s/AG0ilSwmtMlJl_cZDFJKXP6TlQ3BKtxaceL1YGDvr3vToK0vwFjRjYCm1vSBrwYU06ISxE9jOqVAgr0LCHYnA_WLUVSaySoG4y8DLNuLLZMLm2E_XF6vQgFJQtSD_zwTOpyXolHGmxsclQ=s1360-w1360-h1020-rw"
            alt="SMK Taruna Bhakti"
            fill
            className="object-cover"
            priority
            unoptimized
          />
          <div className="absolute inset-0 backdrop-blur-md bg-black/50  transition-all duration-300"></div>
        </div>
        
        <div className="max-w-7xl mx-auto relative z-10 mt-8">
          <div className="text-center mb-20">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 transition-colors duration-300">
              Selamat Datang di <br />
              <span className="text-blue-600  transition-colors duration-300">Bimbingan Konseling</span>
            </h1>
            <p className="text-lg md:text-xl text-gray-400 max-w-3xl mx-auto transition-colors duration-300">
              Pilih guru BK untuk konsultasi dan bimbingan sesuai kebutuhan Anda
            </p>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-20 px-6 bg-gray-900 transition-colors duration-300">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4 transition-colors duration-300">
              Tentang <span className="text-blue-600  transition-colors duration-300">BK SMK Taruna Bhakti</span>
            </h2>
            <p className="text-lg text-gray-400 max-w-3xl mx-auto transition-colors duration-300">
              Layanan Bimbingan dan Konseling SMK Taruna Bhakti hadir untuk membantu siswa dalam pengembangan akademik, pribadi, sosial, dan karir. Kami berkomitmen memberikan bimbingan terbaik untuk masa depan cerah Anda.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-gradient-to-br from-blue-900/50 to-blue-800/50 rounded-2xl p-8 text-center transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl border border-blue-700 ">
              <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-lg">
                <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="font-bold text-xl mb-3 text-white transition-colors duration-300">Tim Profesional</h3>
              <p className="text-gray-400 transition-colors duration-300">6 Guru BK bersertifikat dan berpengalaman</p>
            </div>

            <div className="bg-gradient-to-br from-green-900/50 to-green-800/50 rounded-2xl p-8 text-center transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl border border-green-700 ">
              <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center shadow-lg">
                <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </div>
              <h3 className="font-bold text-xl mb-3 text-white transition-colors duration-300">Layanan Ramah</h3>
              <p className="text-gray-400 transition-colors duration-300">Konsultasi personal dan konfidensial</p>
            </div>

            <div className="bg-gradient-to-br from-purple-900/50 to-purple-800/50 rounded-2xl p-8 text-center transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl border border-purple-700 ">
              <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center shadow-lg">
                <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="font-bold text-xl mb-3 text-white transition-colors duration-300">Bimbingan Karir</h3>
              <p className="text-gray-400 transition-colors duration-300">Panduan untuk masa depan cerah</p>
            </div>

            <div className="bg-gradient-to-br from-orange-900/50 to-orange-800/50 rounded-2xl p-8 text-center transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl border border-orange-700 ">
              <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center shadow-lg">
                <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                </svg>
              </div>
              <h3 className="font-bold text-xl mb-3 text-white transition-colors duration-300">Prestasi Siswa</h3>
              <p className="text-gray-400 transition-colors duration-300">Mendukung pengembangan potensi</p>
            </div>
          </div>
        </div>
      </section>

      {/* Guru BK Section */}
      <section id="pilih-guru" className="py-20 px-6 bg-gradient-to-br from-gray-900 to-gray-800 transition-colors duration-300">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4 transition-colors duration-300">
              Tim <span className="text-blue-600  transition-colors duration-300">Guru BK</span> Kami
            </h2>
            <p className="text-lg text-gray-400 transition-colors duration-300">
              Pilih guru BK yang sesuai dengan kebutuhan konseling Anda
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {loading ? (
              <div className="col-span-full text-center py-12">
                <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                <p className="mt-4 text-gray-400 ">Memuat data guru...</p>
              </div>
            ) : guruBK.length === 0 ? (
              <div className="col-span-full text-center py-12">
                <p className="text-gray-400 ">Belum ada data guru BK</p>
              </div>
            ) : (
              guruBK.map((guru) => (
              <div
                key={guru.id}
                onClick={() => setSelectedGuru(guru)}
                className="group bg-gray-900 rounded-2xl overflow-hidden cursor-pointer transform hover:scale-105 hover:shadow-2xl transition-all duration-300 shadow-lg border border-gray-700 "
              >
                <div className="p-6">
                  <div className="flex items-start space-x-4 mb-4">
                    <div className="relative w-24 h-24 rounded-2xl overflow-hidden border-4 border-blue-500  flex-shrink-0 group-hover:border-blue-600 transition-colors shadow-lg">
                      <Image
                        src={guru.image}
                        alt={guru.name}
                        width={96}
                        height={96}
                        className="w-full h-full object-cover"
                        unoptimized
                      />
                    </div>
                    <div className="flex-1 pt-2">
                      <h3 className="text-lg font-bold text-white mb-2 group-hover:text-blue-600 transition-colors">
                        {guru.name}
                      </h3>
                      <p className="text-sm text-gray-400 leading-relaxed">
                        {guru.specialty}
                      </p>
                    </div>
                  </div>
                  <button className="w-full py-3 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700   text-white rounded-xl font-semibold transition-all duration-300 shadow-md hover:shadow-lg transform hover:scale-105">
                    Pilih Guru
                  </button>
                </div>
              </div>
            ))
            )}
          </div>
        </div>
      </section>

      {/* Modal */}
      {selectedGuru && (
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in"
          onClick={() => setSelectedGuru(null)}
        >
          <div 
            className="max-w-md w-full rounded-2xl p-8 bg-gray-900 transform transition-all duration-300 shadow-2xl border border-gray-700 "
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-32 h-32 mx-auto mb-6 rounded-2xl overflow-hidden border-4 border-blue-500  shadow-xl">
              <Image
                src={selectedGuru.image}
                alt={selectedGuru.name}
                width={128}
                height={128}
                className="w-full h-full object-cover"
                unoptimized
              />
            </div>
            <h3 className="text-2xl font-bold text-center mb-2 text-white ">{selectedGuru.name}</h3>
            <p className="text-center mb-8 text-gray-400 ">{selectedGuru.specialty}</p>
            <Link
              href={`/pilih-guru?guru_id=${selectedGuru.id}`}
              className="block w-full py-3 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-xl font-semibold transition-all duration-300 mb-3 text-center shadow-md hover:shadow-lg"
            >
              Buat Janji Konsultasi
            </Link>
            <button 
              onClick={() => setSelectedGuru(null)}
              className="w-full py-3 bg-gray-200  hover:bg-gray-600 text-white rounded-xl font-semibold transition-colors duration-300"
            >
              Tutup
            </button>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="py-12 px-6 bg-gray-800 border-t border-gray-700 transition-colors duration-300">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center md:text-left">
            <div>
              <h4 className="font-bold text-lg mb-4 text-white transition-colors duration-300">Kontak</h4>
              <div className="space-y-2 text-gray-400 transition-colors duration-300">
                <div className="flex items-center justify-center md:justify-start space-x-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  <span>(021) 1234-5678</span>
                </div>
                <div className="flex items-center justify-center md:justify-start space-x-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  <span>bk@smktarunabhakti.sch.id</span>
                </div>
              </div>
            </div>
            
            <div>
              <h4 className="font-bold text-lg mb-4 text-white transition-colors duration-300">Alamat</h4>
              <div className="flex items-center justify-center md:justify-start space-x-2 text-gray-400 transition-colors duration-300">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span>Jl. Pendidikan No. 123, Jakarta</span>
              </div>
            </div>
            
            <div>
              <h4 className="font-bold text-lg mb-4 text-white transition-colors duration-300">Media Sosial</h4>
              <div className="flex justify-center md:justify-start space-x-4">
                <a href="#" className="text-gray-400 hover:text-blue-600  transition-colors duration-300">Instagram</a>
                <a href="#" className="text-gray-400 hover:text-blue-600  transition-colors duration-300">Facebook</a>
                <a href="#" className="text-gray-400 hover:text-blue-600  transition-colors duration-300">Twitter</a>
              </div>
            </div>
          </div>
          
          <div className="mt-8 pt-8 text-center border-t border-gray-600 ">
            <p className="text-gray-400 transition-colors duration-300">
              © 2024 SMK Taruna Bhakti. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
