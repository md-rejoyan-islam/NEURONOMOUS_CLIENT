'use client';

import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, CheckCircle, KeyRound } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import ForgotEmailForm from '../form/forgot-email-form';
import ResetPasswordForm from '../form/reset-password-form';

type Step = 'email' | 'code' | 'success';

export default function ForgotPassword() {
  const [step, setStep] = useState<Step>('email');
  const [email, setEmail] = useState('');

  return (
    <Card className="border-border/60 my-10 w-full max-w-md shadow-none">
      <CardHeader className="pb-6 text-center">
        <div className="mb-4 flex justify-center">
          <div className="bg-primary rounded-full p-3">
            {step === 'success' ? (
              <CheckCircle className="text-primary-foreground h-8 w-8" />
            ) : (
              <KeyRound className="text-primary-foreground h-8 w-8" />
            )}
          </div>
        </div>
        <CardTitle className="text-2xl font-bold">
          {step === 'email' && 'Forgot Password'}
          {step === 'code' && 'Enter Reset Code'}
          {step === 'success' && 'Password Reset Complete'}
        </CardTitle>
        <p className="text-muted-foreground mt-2">
          {step === 'email' && 'Enter your email to receive a reset code'}
          {step === 'code' && 'Check your email for the 6-digit code'}
          {step === 'success' && 'Your password has been successfully reset'}
        </p>
      </CardHeader>

      <CardContent>
        {step === 'email' && (
          <ForgotEmailForm setStep={setStep} setEmail={setEmail} />
        )}

        {step === 'code' && (
          <ResetPasswordForm setStep={setStep} email={email} />
        )}

        {step === 'success' && (
          <div className="space-y-4">
            <Alert>
              <CheckCircle className="h-4 w-4" />
              <AlertDescription>
                Your password has been successfully reset. You can now sign in
                with your new password.
              </AlertDescription>
            </Alert>

            <Link href={'/login'}>
              <Button className="w-full" aria-label="Back to Sign In Button">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Sign In
              </Button>
            </Link>
          </div>
        )}

        {step !== 'success' && (
          <div className="mt-6 text-center">
            <Link
              href="/login"
              className="text-primary text-sm hover:underline"
            >
              Remember your password? Sign in
            </Link>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
