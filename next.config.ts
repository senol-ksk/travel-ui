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
  async rewrites() {
    return [
      {
        source: '/otel-listesi/:path',
        destination: '/hotel/search-results',
      },
      {
        source: '/kampanyalar',
        destination: '/campaigns',
      },
      {
        source: '/kampanyalar/:slug/:target',
        destination: '/campaigns/detail',
      },
      {
        source: '/ucak-bileti',
        destination: '/flight/',
      },
    ]
  },
}

export default nextConfig
