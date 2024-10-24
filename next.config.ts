import { NextConfig } from 'next'
const nextConfig: NextConfig = {
  experimental: {
    optimizePackageImports: ['@mantine/core', '@mantine/hooks'],
  },
  reactStrictMode: true,
}

export default nextConfig
