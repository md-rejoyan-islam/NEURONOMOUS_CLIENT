import { ThemeProvider } from '@/components/shared/theme-provider';
import { Toaster } from '@/components/ui/sonner';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Providers } from './providers';

const inter = Inter({ subsets: ['latin'] });

const clientUrl =
  process.env.NEXT_PUBLIC_CLIENT_URL || 'https://neuronomous.net';

export const metadata: Metadata = {
  title: 'IoT Control Hub',
  description: 'Advanced IoT device management and control system',
  metadataBase: new URL(clientUrl),
  openGraph: {
    title: 'IoT Control Hub',
    description: 'Advanced IoT device management and control system',
    siteName: 'IoT Control Hub',
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
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
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
