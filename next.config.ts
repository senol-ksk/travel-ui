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
        destination: '/landings/flight',
      },
      // {
      //   source: '/ucak-bileti/:slug',
      //   destination: '/flight/:slug',
      // },
      // {
      //   source: '/otel',
      //   destination: '/hotel/',
      // },
      // {
      //   source: '/arac',
      //   destination: '/car/',
      // },
      // {
      //   source: '/otobus',
      //   destination: '/bus/',
      // },
      // {
      //   source: '/transfer',
      //   destination: '/transfer/',
      // },
      // {
      //   source: '/tur',
      //   destination: '/tour/',
      // },
      // {
      //   source: '/iletisim',
      //   destination: '/contact-us/',
      // },
      // {
      //   source: '/yardim/:slug',
      //   destination: '/help-center/:slug',
      // },
      // {
      //   source: '/:slug',
      //   destination: '/contents/:slug',
      // },
    ]
  },
}

export default nextConfig
