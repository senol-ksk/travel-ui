import { NextConfig } from 'next'
const nextConfig: NextConfig = {
  experimental: {
    optimizePackageImports: ['@mantine/core', '@mantine/hooks'],
  },
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'fulltripstatic.mncdn.com',
      },
    ],
  },
}

export default nextConfig
