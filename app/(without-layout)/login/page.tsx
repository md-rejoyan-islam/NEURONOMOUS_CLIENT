import LoginForm from '@/components/form/login-form';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';

const clientUrl =
  process.env.NEXT_PUBLIC_CLIENT_URL || 'https://neuronomous.net';

export const metadata: Metadata = {
  title: 'Login | Neuronomous IoT Platform',
  description:
    'Access your Neuronomous account securely and manage your IoT devices.',
  alternates: {
    canonical: clientUrl + '/login',
  },
  openGraph: {
    title: 'Login | Neuronomous IoT Platform',
    description:
      'Access your Neuronomous account securely and manage your IoT devices.',
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
};

export default function LoginPage() {
  return (
    <Card className="my-10 w-full max-w-md">
      <CardHeader className="pb-4 text-center">
        <div className="mb-2 flex justify-center">
          <Link href={'/'}>
            <Image
              src={'/logo.png'}
              alt="Logo"
              width={60}
              height={60}
              className="h-16 w-16"
            />
          </Link>
        </div>
        <Link href={'/'}>
          <CardTitle className="text-2xl font-bold md:text-3xl">
            Neuronomous
          </CardTitle>
        </Link>
        <p className="text-muted-foreground mt-1 text-base md:text-[17px]">
          Sign in to your account
        </p>
      </CardHeader>

      <CardContent>
        <LoginForm />
      </CardContent>
    </Card>
  );
}
