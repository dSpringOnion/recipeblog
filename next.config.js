/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    // Performance optimizations
    optimizePackageImports: [
      '@radix-ui/react-icons',
      'lucide-react',
      '@radix-ui/react-dropdown-menu',
      '@radix-ui/react-select',
      '@radix-ui/react-slider',
      '@radix-ui/react-slot',
      '@radix-ui/react-toast',
    ],
    webpackMemoryOptimizations: true,
    preloadEntriesOnStart: false, // Reduce initial memory usage
  },
  images: {
    domains: [
      'images.unsplash.com', // Unsplash images
      'videodelivery.net', // Cloudflare Stream
      'imagedelivery.net', // Cloudflare Images
    ],
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
        ],
      },
    ];
  },
};

module.exports = nextConfig;