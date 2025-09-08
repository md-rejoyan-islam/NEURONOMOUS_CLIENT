import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Neuronomous | IoT Platform',
    short_name: 'Neuronomous',
    description:
      'Neuronomous is an advanced IoT platform that enables seamless device management, real-time monitoring, and automation for smart environments for both personal and industrial use cases.',
    start_url: '/',
    display: 'standalone',
    background_color: '#fff',
    theme_color: '#fff',
    icons: [
      {
        src: '/favicon.ico',
        sizes: 'any',
        type: 'image/x-icon',
      },
    ],
  };
}
