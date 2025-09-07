import { ThemeProvider } from '@/components/shared/theme-provider';
import { Toaster } from '@/components/ui/sonner';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import Script from 'next/script';
import './globals.css';
import { Providers } from './providers';

const inter = Inter({ subsets: ['latin'] });

const clientUrl =
  process.env.NEXT_PUBLIC_CLIENT_URL || 'https://neuronomous.net';

export const metadata: Metadata = {
  title: 'Neuronomous - IoT Device Solutions',
  description:
    'Neuronomous offers IoT devices including smart clocks and attendance systems. Manage devices, schedule notices, and track data seamlessly.',
  metadataBase: new URL(clientUrl),
  openGraph: {
    title: 'Neuronomous - IoT Device Solutions',
    description:
      'Neuronomous offers IoT devices including smart clocks and attendance systems. Manage devices, schedule notices, and track data seamlessly.',
    siteName: 'Neuronomous',
    url: 'https://neuronomous.net',
    images: [
      {
        url: '/warning.png',
        width: 1200,
        height: 630,
        alt: 'IoT Control Hub',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'IoT Control Hub',
    description: 'Advanced IoT device management and control system',
    images: ['/warning.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  alternates: {
    canonical: 'https://neuronomous.net',
  },
  authors: [
    {
      name: 'Md Rejoyan Islam',
      url: 'https://md-rejoyan-islam.github.io',
    },
    { name: 'Neuronomous', url: 'https://neuronomous.net' },
  ],
  creator: 'Md Rejoyan Islam',
  keywords: [
    'IoT',
    'Smart Clock',
    'Attendance system',
    'Notice Board',
    'Internet of Things',
    'Device Management',
    'Smart Home',
    'Automation',
    'Real-time Monitoring',
    'Neuronomous',
    'IoT Platform',
    'Industrial IoT',
    'IoT Control Hub',
    'Smart Environment',
    'Connected Devices',
    'Embedded Systems',
    'IoT Solutions',
    'IoT Applications',
    'Educational IoT',
    'IoT Security',
    'IoT Analytics',
    'IoT Development',
    'IoT Integration',
    'IoT Dashboard',
    'IoT Gateway',
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <Script
          id="ld-json"
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'Organization',
              name: 'Neuronomous',
              url: 'https://neuronomous.net',
              logo: 'https://neuronomous.net/logo.png',
              // sameAs: [
              //   'https://www.facebook.com/neuronomous',
              //   'https://www.linkedin.com/company/neuronomous',
              // ],
            }),
          }}
        />
      </head>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <Providers>
            {children}
            <Toaster
              closeButton
              toastOptions={{
                classNames: {
                  error: 'bg-red-500/80! text-white! border-red-600!',
                  success: 'bg-green-500! text-white! border-green-600!',
                },
              }}
            />
          </Providers>
        </ThemeProvider>
      </body>
    </html>
  );
}
