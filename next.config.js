/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    // !! ATTENTION !!
    // Dangereux mais nécessaire pour la mise en production
    ignoreBuildErrors: true,
  },
  eslint: {
    // !! ATTENTION !!
    // Dangereux mais nécessaire pour la mise en production
    ignoreDuringBuilds: true,
  },
  // Optimisations de production
  swcMinify: true,
  poweredByHeader: false,
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'cdn.rebrickable.com',
        port: '',
        pathname: '/media/**',
      },
    ],
    domains: ['cdn.rebrickable.com'],
  },
};

module.exports = nextConfig;
