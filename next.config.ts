import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    unoptimized: true, 
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'francom.pythonanywhere.com',
        pathname: '/media/**',
      },
    ],
  },
};

export default nextConfig;