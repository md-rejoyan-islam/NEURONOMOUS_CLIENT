import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  async rewrites() {
    return [
      {
        source: '/api/v1/firmwares/:firmwareId/download',
        destination: `${process.env.API_URL}/api/v1/firmwares/:firmwareId/download`,
      },
    ];
  },
};

export default nextConfig;
