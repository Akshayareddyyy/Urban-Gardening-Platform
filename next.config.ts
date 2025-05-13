import type {NextConfig} from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      // Data URIs don't need to be listed here.
      {
        protocol: 'https',
        hostname: 'perenual.com',
        port: '',
        pathname: '/**',
      },
      // Remove picsum.photos if no longer used for placeholders.
      // Keeping it for safety if some placeholders might still use it.
      // If definitely not used, this block can be removed.
      // {
      //   protocol: 'https',
      //   hostname: 'picsum.photos',
      //   port: '',
      //   pathname: '/**',
      // },
    ],
  },
};

export default nextConfig;
