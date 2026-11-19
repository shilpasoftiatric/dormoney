import type { NextConfig } from "next";

const nextConfig: NextConfig = {

  typescript: {
    // Dangerously allow production builds to successfully complete even if
    // your project has type errors in non-migrated legacy files.
    ignoreBuildErrors: true,
  },

  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'www.google.com',
      },
    ],
  },
  experimental: {
    serverActions: {
      bodySizeLimit: '50mb',
    },
  },
};

export default nextConfig;
