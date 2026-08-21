import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'alphalabs.mn',
        pathname: '/nextstore-html/estel/**',
      },
      {
        protocol: 'https',
        hostname: 'd2zu1tgnlo40u9.cloudfront.net',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'estel.nextstore.mn',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;
