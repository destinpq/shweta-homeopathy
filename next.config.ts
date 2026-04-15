import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactCompiler: true,
  experimental: {
    cpus: 2, // limit parallel static-page workers to avoid Google Sheets quota exhaustion
  },
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'drshwetahomoeopathy.com' },
      { protocol: 'https', hostname: 'lh3.googleusercontent.com' },
    ],
  },
  async redirects() {
    return [
      // Legacy slug → canonical slug (permanent 308 so old links / SEO still resolve)
      {
        source: '/conditions/female-diseases',
        destination: '/conditions/womens-health',
        permanent: true,
      },
      {
        source: '/conditions/skin-disease',
        destination: '/conditions/skin-diseases',
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
