import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'static.vecteezy.com',
        port: '',
        pathname: '/system/resources/previews/**',
        search: '',
      },
    ],
  },
  experimental: {
    serverActions: {
      bodySizeLimit: "10mb", // Adjust as needed (e.g., "50mb", "100mb")
    },
  },
};

export default nextConfig;
