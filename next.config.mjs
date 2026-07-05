/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdn.wonder.so',
        pathname: '/images/**',
      },
    ],
  },
  transpilePackages: ['three'],
  async redirects() {
    return [
      {
        source: '/atlas',
        destination: '/globe',
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
