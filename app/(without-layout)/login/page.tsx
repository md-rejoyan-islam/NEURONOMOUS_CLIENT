import LoginForm from '@/components/form/login-form';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Shield } from 'lucide-react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Login',
  description: 'Login to your IoT Control Hub account',
};

export default function LoginPage() {
  return (
    <Card className="my-10 w-full max-w-md">
      <CardHeader className="pb-6 text-center">
        <div className="mb-4 flex justify-center">
          <div className="bg-primary rounded-full p-3">
            <Shield className="text-primary-foreground h-8 w-8" />
          </div>
        </div>
        <CardTitle className="text-2xl font-bold">IoT Control Hub</CardTitle>
        <p className="text-muted-foreground mt-2">Sign in to your account</p>
      </CardHeader>

      <CardContent>
        <LoginForm />
      </CardContent>
    </Card>
  );
}
