//---File ini adalah halaman landing page (halaman utama sebelum login) untuk aplikasi web---\\
//---Menampilkan informasi aplikasi, tim guru BK, layanan BK, dan dropdown untuk pilih role login---\\

'use client';

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";

export default function LandingPage() {
  //---State untuk mengontrol dropdown menu "Masuk" dan "Login" di navbar---\\
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [navbarDropdownOpen, setNavbarDropdownOpen] = useState(false);
  //---Ref untuk menangani click outside dan scroll ke section layanan BK---\\
  const dropdownRef = useRef<HTMLDivElement>(null);
  const navbarDropdownRef = useRef<HTMLDivElement>(null);
  const layananBKRef = useRef<HTMLDivElement>(null);

  //---Fungsi untuk scroll ke bagian layanan BK dengan animasi smooth---\\
  const scrollToLayananBK = () => {
    layananBKRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  //---Menutup dropdown saat klik di luar area dropdown---\\
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
      if (navbarDropdownRef.current && !navbarDropdownRef.current.contains(event.target as Node)) {
        setNavbarDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-gray-900 transition-colors duration-300">
      {/* Background Image dengan Blur */}
      <div className="relative flex-1 z-0">
        <div className="absolute inset-0">
        <Image
            src="https://lh3.googleusercontent.com/gps-cs-s/AG0ilSwmtMlJl_cZDFJKXP6TlQ3BKtxaceL1YGDvr3vToK0vwFjRjYCm1vSBrwYU06ISxE9jOqVAgr0LCHYnA_WLUVSaySoG4y8DLNuLLZMLm2E_XF6vQgFJQtSD_zwTOpyXolHGmxsclQ=s1360-w1360-h1020-rw"
            alt="SMK Taruna Bhakti"
            fill
            className="object-cover"
          priority
            unoptimized
          />
          <div className="absolute inset-0 backdrop-blur-md bg-black/50  transition-colors duration-300"></div>
        </div>

        {/* Content */}
        <div className="relative z-10 flex flex-col min-h-full">
          {/* Navbar */}
          <nav className="px-6 md:px-12 py-6 flex justify-between items-center">
            {/* Logo + teks */}
            <div className="flex items-center gap-4">
              <div className="relative w-16 h-16">
            <Image
                  src="https://smktarunabhakti.sch.id/wp-content/uploads/2020/07/logotbvector-copy.png"
                  alt="Logo SMK Taruna Bhakti"
                  width={64}
                  height={64}
                  className="object-contain"
                  priority
                  unoptimized
                />
              </div>
              <div className="text-shine-container">
                <div className="text-xs font-bold uppercase tracking-wider text-shine">
                  SMK TARUNA BHAKTI
                </div>
              </div>
            </div>

            {/* Right Side - Theme Toggle & Login */}
            <div className="flex items-center gap-3">
              {/* Theme Toggle */}
              <div className="bg-gray-900/90  backdrop-blur-sm rounded-lg shadow-md transition-colors duration-300">
                
              </div>
              
              {/* Login Dropdown */}
              <div className="relative" ref={navbarDropdownRef}>
                <button
                  onClick={() => setNavbarDropdownOpen(!navbarDropdownOpen)}
                  className="px-4 py-2 bg-gray-900 text-blue-700  rounded-lg font-semibold hover:bg-gray-800 transition-all duration-300 shadow-lg"
                >
                  Login
                </button>

              {navbarDropdownOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-gray-900 rounded-lg shadow-2xl border border-gray-700 z-50">
                  <Link
                    href="/login"
                    className="block px-6 py-3 text-gray-300 hover:bg-blue-50  hover:text-blue-700  transition-colors duration-200 rounded-t-lg"
                    onClick={() => setNavbarDropdownOpen(false)}
                  >
                    <div className="flex items-center gap-3">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                      <span>Login</span>
                    </div>
                  </Link>
                </div>
              )}
              </div>
            </div>
          </nav>

          {/* Hero Section */}
          <div className="flex-1 flex items-center justify-center px-6 md:px-12 py-12">
            <div className="max-w-4xl mx-auto text-center">
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-white  mb-6 leading-tight drop-shadow-lg transition-colors duration-300">
                Bimbingan Konseling SMK
                <br />
                Taruna Bhakti
              </h1>
              <p className="text-lg md:text-xl text-white  mb-10 max-w-3xl mx-auto leading-relaxed drop-shadow-md transition-colors duration-300">
                Layanan bimbingan dan konseling untuk mendukung perkembangan akademik, karir, dan pribadi siswa.
              </p>

              {/* Call to Action Buttons */}
              <div className="flex gap-4 justify-center flex-wrap mb-16 relative">
                <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="px-8 py-3 bg-gray-900 text-blue-700  rounded-lg font-semibold hover:bg-gray-800 transition-all duration-300 shadow-lg"
                >
                  Masuk
                </button>
                  
                  {/* Dropdown Menu untuk Button Masuk */}
                  {dropdownOpen && (
                    <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 w-56 bg-gray-900 rounded-lg shadow-2xl border border-gray-700 z-50">
                      <Link
                        href="/login"
                        className="block px-6 py-3 text-gray-300 hover:bg-blue-50  hover:text-blue-700  transition-colors duration-200 rounded-t-lg"
                        onClick={() => setDropdownOpen(false)}
                      >
                        <div className="flex items-center gap-3">
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                          </svg>
                          <span>Login</span>
                        </div>
                      </Link>
                    </div>
                  )}
                </div>
                <button
                  onClick={scrollToLayananBK}
                  className="px-8 py-3 bg-blue-700  text-white  rounded-lg font-semibold hover:bg-blue-600  transition-all duration-300 shadow-lg"
                >
                  Lihat Layanan BK
                </button>
              </div>

              {/* Feature Cards */}
              <div className="mt-12 grid gap-4 sm:grid-cols-3 max-w-3xl mx-auto">
                <div className="rounded-lg bg-gray-900/20  backdrop-blur border border-white/30  p-5 float fade-up-delay-1 shadow-md">
                  <p className="font-bold text-white ">Konseling Akademik</p>
                  <p className="text-sm text-gray-300 mt-1">Bimbingan belajar & prestasi</p>
                </div>
                <div className="rounded-lg bg-gray-900/20  backdrop-blur border border-white/30  p-5 float fade-up-delay-2 shadow-md">
                  <p className="font-bold text-white ">Konseling Karir</p>
                  <p className="text-sm text-gray-300 mt-1">Perencanaan masa depan</p>
                </div>
                <div className="rounded-lg bg-gray-900/20  backdrop-blur border border-white/30  p-5 float fade-up-delay-3 shadow-md">
                  <p className="font-bold text-white ">Konseling Pribadi</p>
                  <p className="text-sm text-gray-300 mt-1">Dukungan emosional & sosial</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Marquee Tim Guru BK Kami */}
      <section className="py-16 bg-gradient-to-br from-gray-900 to-gray-800 overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 mb-12">
          <div className="text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Tim <span className="text-blue-600">Guru BK</span> Kami
            </h2>
            <p className="text-lg md:text-xl text-gray-400 max-w-3xl mx-auto leading-relaxed transition-colors duration-300">
              Pilih guru BK yang sesuai dengan kebutuhan konseling Anda
            </p>
          </div>
        </div>
        
        {/* Marquee Container - Full Width sampai mentok */}
        <div className="marquee-container">
          <div className="animate-marquee flex">
            {/* Duplicate items untuk seamless infinite loop - 4x set untuk memastikan tidak ada gap sama sekali */}
            {[...Array(4)].map((_, loopIndex) => (
              <div key={`marquee-set-${loopIndex}`} className="flex space-x-8 flex-shrink-0">
                {/* Guru 1 */}
                <div className="flex flex-col items-center space-y-3 flex-shrink-0 w-48">
                  <div className="relative w-32 h-32 rounded-full overflow-hidden border-4 border-blue-500 shadow-lg hover:scale-110 transition-transform duration-300">
                    <Image
                      src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTI1qoiySG8G0f3Aea7Q1MDzjOBbCsVmX83RQ&s"
                      alt="Heni Siswati"
                      width={128}
                      height={128}
                      className="w-full h-full object-cover"
                      unoptimized
                    />
                  </div>
                  <p className="text-white font-semibold text-sm text-center">Heni Siswati, S.Psi</p>
                </div>
                
                {/* Guru 2 */}
                <div className="flex flex-col items-center space-y-3 flex-shrink-0 w-48">
                  <div className="relative w-32 h-32 rounded-full overflow-hidden border-4 border-blue-500 shadow-lg hover:scale-110 transition-transform duration-300">
                    <Image
                      src="https://smktarunabhakti.sch.id/wp-content/uploads/2023/10/21-500x500.png"
                      alt="Kasandra Fitriani"
                      width={128}
                      height={128}
                      className="w-full h-full object-cover"
                      unoptimized
                    />
                  </div>
                  <p className="text-white font-semibold text-sm text-center">Kasandra Fitriani. N, S.Pd</p>
                </div>
                
                {/* Guru 3 */}
                <div className="flex flex-col items-center space-y-3 flex-shrink-0 w-48">
                  <div className="relative w-32 h-32 rounded-full overflow-hidden border-4 border-blue-500 shadow-lg hover:scale-110 transition-transform duration-300">
                    <Image
                      src="https://smktarunabhakti.sch.id/wp-content/uploads/2023/10/39-500x500.png"
                      alt="Nadya Afriliani"
                      width={128}
                      height={128}
                      className="w-full h-full object-cover"
                      unoptimized
                    />
                  </div>
                  <p className="text-white font-semibold text-sm text-center">Nadya Afriliani Ariesta, S.Pd</p>
                </div>
                
                {/* Guru 4 */}
                <div className="flex flex-col items-center space-y-3 flex-shrink-0 w-48">
                  <div className="relative w-32 h-32 rounded-full overflow-hidden border-4 border-blue-500 shadow-lg hover:scale-110 transition-transform duration-300">
                    <Image
                      src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSIqRiWGynRSNvQOA4XAUEX1t_fdpuIdWuyFA&s"
                      alt="Ika Rafika"
                      width={128}
                      height={128}
                      className="w-full h-full object-cover"
                      unoptimized
                    />
                  </div>
                  <p className="text-white font-semibold text-sm text-center">Ika Rafika, S.Pd</p>
                </div>
                
                {/* Guru 5 */}
                <div className="flex flex-col items-center space-y-3 flex-shrink-0 w-48">
                  <div className="relative w-32 h-32 rounded-full overflow-hidden border-4 border-blue-500 shadow-lg hover:scale-110 transition-transform duration-300">
                    <Image
                      src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&h=200&fit=crop"
                      alt="M. Ricky Sudrajat"
                      width={128}
                      height={128}
                      className="w-full h-full object-cover"
                      unoptimized
                    />
                  </div>
                  <p className="text-white font-semibold text-sm text-center">M. Ricky Sudrajat, S.Pd</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Layanan BK Section */}
      <div ref={layananBKRef} className="bg-gray-900 py-20 px-6 transition-colors duration-300">
        <div className="max-w-7xl mx-auto">
          {/* Header Section */}
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight transition-colors duration-300">
              Layanan Bimbingan Konseling
            </h1>
            <p className="text-lg md:text-xl text-gray-400 max-w-3xl mx-auto leading-relaxed transition-colors duration-300">
              Berbagai layanan bimbingan dan konseling untuk mendukung perkembangan siswa.
            </p>
          </div>

          {/* Services Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Card 1 - Konseling Akademik */}
            <div className="group bg-gray-800 rounded-2xl shadow-lg hover:shadow-2xl p-8 border border-gray-700  transition-all duration-300 hover:-translate-y-2 hover:border-blue-600 ">
              <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-white mb-4 group-hover:text-blue-600 transition-colors">Konseling Akademik</h3>
              <p className="text-gray-400 leading-relaxed transition-colors">
                Bimbingan untuk meningkatkan prestasi belajar, mengatasi kesulitan belajar, dan merencanakan strategi belajar yang efektif.
              </p>
            </div>

            {/* Card 2 - Konseling Karir */}
            <div className="group bg-gray-800 rounded-2xl shadow-lg hover:shadow-2xl p-8 border border-gray-700  transition-all duration-300 hover:-translate-y-2 hover:border-green-600 ">
              <div className="w-14 h-14 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-white mb-4 group-hover:text-green-600 transition-colors">Konseling Karir</h3>
              <p className="text-gray-400 leading-relaxed transition-colors">
                Bimbingan untuk mengenali minat dan bakat, merencanakan karir, serta mempersiapkan diri memasuki dunia kerja atau perguruan tinggi.
              </p>
            </div>

            {/* Card 3 - Konseling Pribadi */}
            <div className="group bg-gray-800 rounded-2xl shadow-lg hover:shadow-2xl p-8 border border-gray-700  transition-all duration-300 hover:-translate-y-2 hover:border-purple-600 ">
              <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-white mb-4 group-hover:text-purple-600 transition-colors">Konseling Pribadi</h3>
              <p className="text-gray-400 leading-relaxed transition-colors">
                Bimbingan untuk mengembangkan kepribadian, mengatasi masalah pribadi, dan meningkatkan kemampuan sosial.
              </p>
            </div>

            {/* Card 4 - Konseling Sosial */}
            <div className="group bg-gray-800 rounded-2xl shadow-lg hover:shadow-2xl p-8 border border-gray-700  transition-all duration-300 hover:-translate-y-2 hover:border-orange-600 ">
              <div className="w-14 h-14 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-white mb-4 group-hover:text-orange-600 transition-colors">Konseling Sosial</h3>
              <p className="text-gray-400 leading-relaxed transition-colors">
                Bimbingan untuk mengembangkan kemampuan berinteraksi sosial, membangun hubungan positif, dan mengatasi konflik.
              </p>
            </div>

            {/* Card 5 - Konseling Keluarga */}
            <div className="group bg-gray-800 rounded-2xl shadow-lg hover:shadow-2xl p-8 border border-gray-700  transition-all duration-300 hover:-translate-y-2 hover:border-pink-600 ">
              <div className="w-14 h-14 bg-gradient-to-br from-pink-500 to-pink-600 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-white mb-4 group-hover:text-pink-600 transition-colors">Konseling Keluarga</h3>
              <p className="text-gray-400 leading-relaxed transition-colors">
                Bimbingan untuk mengatasi masalah keluarga yang mempengaruhi perkembangan dan prestasi siswa.
              </p>
            </div>

            {/* Card 6 - Konseling Kesehatan Mental */}
            <div className="group bg-gray-800 rounded-2xl shadow-lg hover:shadow-2xl p-8 border border-gray-700  transition-all duration-300 hover:-translate-y-2 hover:border-indigo-600 ">
              <div className="w-14 h-14 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-white mb-4 group-hover:text-indigo-600 transition-colors">Konseling Kesehatan Mental</h3>
              <p className="text-gray-400 leading-relaxed transition-colors">
                Bimbingan untuk menjaga kesehatan mental, mengatasi stress, anxiety, dan masalah emosional lainnya.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 border-t border-gray-700 transition-colors duration-300">
        <div className="mx-auto max-w-7xl px-6 py-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            {/* Kiri: Identitas Sekolah */}
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="relative w-10 h-10">
                  <Image
                    src="https://smktarunabhakti.sch.id/wp-content/uploads/2020/07/logotbvector-copy.png"
                    alt="Logo SMK Taruna Bhakti"
                    width={40}
                    height={40}
                    className="object-contain"
                    unoptimized
                  />
                </div>
                <h2 className="text-lg font-bold text-white transition-colors">Bimbingan Konseling</h2>
              </div>
              <p className="text-sm text-gray-400 leading-relaxed transition-colors">
                Layanan bimbingan dan konseling untuk mendukung perkembangan akademik, karir, dan pribadi siswa.
              </p>
            </div>

            {/* Tengah: Navigasi */}
            <div>
              <h3 className="text-sm font-semibold text-white mb-4 uppercase tracking-wider transition-colors">Navigasi</h3>
              <nav className="flex flex-col gap-3">
                <Link href="/login" className="text-sm text-gray-400 hover:text-blue-700  transition-colors">
                  Masuk
                </Link>
                <button
                  onClick={scrollToLayananBK}
                  className="text-sm text-gray-400 hover:text-blue-700  transition-colors text-left"
                >
                  Layanan BK
                </button>
                <a href="#kontak" className="text-sm text-gray-400 hover:text-blue-700  transition-colors">
                  Kontak
                </a>
              </nav>
            </div>

            {/* Kanan: Sosial Media & Kontak */}
            <div>
              <h3 className="text-sm font-semibold text-white mb-4 uppercase tracking-wider transition-colors">Ikuti Kami</h3>
              <div className="flex items-center gap-4 mb-4">
                <a
                  href="#"
                  className="w-10 h-10 bg-gray-900 rounded-lg flex items-center justify-center text-gray-400 hover:text-blue-600  hover:bg-blue-50  transition-all duration-300 shadow-sm hover:shadow-md"
                  title="Facebook"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                  </svg>
                </a>
                <a
                  href="#"
                  className="w-10 h-10 bg-gray-900 rounded-lg flex items-center justify-center text-gray-400 hover:text-pink-600  hover:bg-pink-50  transition-all duration-300 shadow-sm hover:shadow-md"
                  title="Instagram"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                  </svg>
                </a>
                <a
                  href="#"
                  className="w-10 h-10 bg-gray-900 rounded-lg flex items-center justify-center text-gray-400 hover:text-red-600  hover:bg-red-50  transition-all duration-300 shadow-sm hover:shadow-md"
                  title="YouTube"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                  </svg>
                </a>
              </div>
            </div>
          </div>

          {/* Copyright */}
          <div className="pt-8 border-t border-gray-700 ">
            <p className="text-center text-sm text-gray-500  transition-colors">
              © {new Date().getFullYear()} SMK Taruna Bhakti. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
