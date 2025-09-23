import ForgotPassword from '@/components/forgot-password/forgot-password';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Forgot Password',
  description: 'Reset your IoT Control Hub password',
  alternates: {
    canonical:
      (process.env.NEXT_PUBLIC_CLIENT_URL || 'https://neuronomous.net') +
      '/forgot-password',
  },
};

export default function ForgotPasswordPage() {
  return <ForgotPassword />;
}
