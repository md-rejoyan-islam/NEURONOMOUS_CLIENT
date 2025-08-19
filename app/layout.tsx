import { ThemeProvider } from '@/components/theme-provider';
import { Toaster } from '@/components/ui/sonner';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Providers } from './providers';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'IoT Control Hub',
  description: 'Advanced IoT device management and control system',
  generator: 'v0.dev',
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
