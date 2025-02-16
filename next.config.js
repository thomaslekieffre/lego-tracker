/** @type {import('next').NextConfig} */
const nextConfig = {
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
  },
};

module.exports = nextConfig;
