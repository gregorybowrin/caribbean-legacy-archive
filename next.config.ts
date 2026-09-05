import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'export',
  images: {
    unoptimized: true, // Required for static export
  },
  experimental: {
    cpus: 4, // Limit workers to avoid DDOSing Supabase during SSG
  },
};

export default nextConfig;
