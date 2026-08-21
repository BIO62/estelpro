import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'alphalabs.mn',
        pathname: '/nextstore-html/estel/**',
      },
    ],
  },
};

export default nextConfig;
