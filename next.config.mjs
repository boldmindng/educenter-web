// @ts-check
import withPWA from 'next-pwa';

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,

  images: {
    remotePatterns: [
      { protocol: 'https', hostname: '*.r2.cloudflarestorage.com' },
      { protocol: 'https', hostname: 'imagedelivery.net' },
      { protocol: 'https', hostname: '*.cloudflare.com' },
      { protocol: 'https', hostname: '**.boldmind.ng' },
      { protocol: 'https', hostname: '**.amebogist.ng' },
      { protocol: 'https', hostname: '**.educenter.com.ng' },
      { protocol: 'https', hostname: '**.villagecircle.ng'},
      { protocol: 'https', hostname: 'res.cloudinary.com' },
      { protocol: 'https', hostname: 'lh3.googleusercontent.com' },
      { protocol: 'https', hostname: 'avatars.githubusercontent.com' },
      { protocol: 'https', hostname: '**.vercel.app' },
     
    ],
    formats: ['image/avif', 'image/webp'],
  },

  // Ecosystem cross-domain links
  async rewrites() {
    return [];
  },

  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=()',
          },
        ],
      },
    ];
  },

  // Shared ecosystem package transpilation
  transpilePackages: [
    '@boldmindng/ui',
    '@boldmindng/auth',
    '@boldmindng/utils',
    '@boldmindng/api-client',
  ],

  experimental: {
    optimizePackageImports: ['lucide-react', 'framer-motion'],
  },
};

const pwaConfig = withPWA({
  dest: 'public',
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === 'development',
  runtimeCaching: [
    {
      // ALOC API question packs — 24h TTL
      urlPattern: /^https:\/\/questions\.aloc\.com\.ng\/.*/i,
      handler: 'CacheFirst',
      options: {
        cacheName: 'aloc-questions',
        expiration: { maxEntries: 200, maxAgeSeconds: 86400 },
        cacheableResponse: { statuses: [0, 200] },
      },
    },
    {
      // API calls — network first with 3s timeout fallback
      urlPattern: /^https:\/\/api\.boldmind\.ng\/api\/v1\/educenter\/.*/i,
      handler: 'NetworkFirst',
      options: {
        cacheName: 'educenter-api',
        networkTimeoutSeconds: 3,
        expiration: { maxEntries: 50, maxAgeSeconds: 3600 },
        cacheableResponse: { statuses: [0, 200] },
      },
    },
    {
      // Static assets
      urlPattern: /\.(?:png|jpg|jpeg|svg|gif|webp|avif|ico|woff2?)$/i,
      handler: 'CacheFirst',
      options: {
        cacheName: 'static-assets',
        expiration: { maxEntries: 100, maxAgeSeconds: 2592000 },
        cacheableResponse: { statuses: [0, 200] },
      },
    },
  ],
});

export default pwaConfig(nextConfig);
