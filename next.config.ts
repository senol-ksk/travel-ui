import { NextConfig } from 'next'
const nextConfig: NextConfig = {
  typedRoutes: true,
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
        source: '/otel-arama/:path',
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
      {
        source: '/ucak-bileti/:slug',
        destination: '/landings/flight/:slug',
      },
      {
        source: '/otel',
        destination: '/landings/hotel',
      },
      {
        source: '/arac',
        destination: '/landings/car',
      },
      {
        source: '/otobus',
        destination: '/landings/bus',
      },
      {
        source: '/transfer',
        destination: '/landings/transfer',
      },
      {
        source: '/tur',
        destination: '/landings/tour',
      },
      {
        source: '/iletisim',
        destination: '/contact-us',
      },
      {
        source: '/yardim/:slug',
        destination: '/help-center/:slug',
      },
      {
        source: '/online-islemler-seyahatinizi-goruntuleyin',
        destination: '/online-operations',
      },
      {
        source: '/confirm-email',
        destination: '/auth/confirm-email',
      },
      {
        source: '/sifre-yenileme',
        destination: '/auth/password-renew',
      },
      {
        source: '/:slug',
        destination: '/contents/:slug',
      },
    ]
  },
}

export default nextConfig
