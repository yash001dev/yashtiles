/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: ['localhost', 'yashtiles-frames.s3.amazonaws.com'],
  },
  experimental: {
    serverComponentsExternalPackages: ['payload'],
  },
}

module.exports = nextConfig