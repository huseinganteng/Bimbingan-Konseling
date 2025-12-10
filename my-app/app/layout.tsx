//---File ini adalah root layout aplikasi web (Next.js)---\\
//---Mengatur font, metadata, dan wrap semua halaman dengan ToastProvider untuk notifikasi global---\\

import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ToastProvider } from "./contexts/ToastContext";

//---Setup font Geist Sans untuk teks biasa---\\
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
  fallback: ["system-ui", "arial"],
});

//---Setup font Geist Mono untuk teks monospace (kode)---\\
const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
  fallback: ["monospace"],
});

//---Metadata untuk SEO (judul dan deskripsi halaman)---\\
export const metadata: Metadata = {
  title: "EduPlatform - Belajar Lebih Mudah",
  description: "Platform pembelajaran online terdepan dengan ribuan guru berpengalaman",
};

//---Komponen root layout: membungkus semua halaman---\\
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-gray-900 text-white min-h-screen`}
      >
        {/*---ToastProvider: menyediakan fungsi untuk menampilkan notifikasi di semua halaman---\\*/}
        <ToastProvider>
          {children}
        </ToastProvider>
      </body>
    </html>
  );
}

