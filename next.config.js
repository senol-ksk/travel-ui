/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    optimizePackageImports: ['@mantine/core', '@mantine/hooks'],
    missingSuspenseWithCSRBailout: false,
  },
  images: {
    remotePatterns: [{ hostname: '*' }],
    unoptimized: true,
  },
  async rewrites() {
    return [
      {
        source: '/flight-search',
        destination: '/ucak-arama',
      },
    ]
  },
}

module.exports = nextConfig
