/** @type {import('next').NextConfig} */

import createNextIntlPlugin from 'next-intl/plugin';

const nextIntlPlugin = createNextIntlPlugin('./lib/i18n.ts');
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  async rewrites() {
    return [
      {
        source: '/images/:path*',
        destination: `${process.env.BACKEND_URL}/api/public/files?filePath=/:path*`,
      },
      {
        source: '/api/public/:path*',
        destination: `${process.env.BACKEND_URL}/api/public/:path*`,
      },
    ]
  },
}

export default nextIntlPlugin(nextConfig);
