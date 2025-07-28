/** @type {import('next').NextConfig} */
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

export default nextConfig
