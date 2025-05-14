
import type {NextConfig} from 'next';

const nextConfig: NextConfig = {
  // output: 'export', // Removed for dynamic server-side rendering and to fix generateStaticParams build error

  /* config options here */
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    unoptimized: true, // Keep this if you still intend to deploy where Next.js image optimization isn't available or desired. Or set to false if deploying to a Node.js env that can handle it.
    remotePatterns: [
      // Data URIs don't need to be listed here.
      {
        protocol: 'https',
        hostname: 'perenual.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'picsum.photos',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'placehold.co',
        port: '',
        pathname: '/**',
      }
    ],
  },
};

export default nextConfig;
