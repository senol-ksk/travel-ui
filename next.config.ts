import { NextConfig } from 'next'
const nextConfig: NextConfig = {
  experimental: {
    optimizePackageImports: [
      '@mantine/core',
      '@mantine/hooks',
      '@mantine/dates',
    ],
  },
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'fulltripstatic.mncdn.com',
      },
      {
        protocol: 'https',
        hostname: 'ykmturizm.mncdn.com',
      },
    ],
  },
}

export default nextConfig
