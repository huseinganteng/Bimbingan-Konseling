//----File ini untuk konfigurasi Next.js (setup image optimization, remote patterns untuk gambar dari Google dan domain sekolah)----\\
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  productionBrowserSourceMaps: false,
  // Turbopack configuration
  // Root is automatically detected, no need to set manually
  // Image optimization settings
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
      },
      {
        protocol: 'https',
        hostname: 'smktarunabhakti.sch.id',
      },
    ],
    unoptimized: false,
  },
};

export default nextConfig;
