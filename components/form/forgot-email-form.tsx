'use client';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ForgotPasswordInput, forgotPasswordSchema } from '@/lib/validations';
import { useForgotPasswordMutation } from '@/queries/auth';
import { zodResolver } from '@hookform/resolvers/zod';
import { Mail } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

const ForgotEmailForm = ({
  setStep,
  setEmail,
}: {
  setStep: (step: 'email' | 'code') => void;
  setEmail: (email: string) => void;
}) => {
  const emailForm = useForm<ForgotPasswordInput>({
    resolver: zodResolver(forgotPasswordSchema),
  });

  const [forgotPassword, { isLoading: isSendingCode }] =
    useForgotPasswordMutation();

  const handleSendCode = async (data: ForgotPasswordInput) => {
    try {
      await forgotPassword(data).unwrap();

      setEmail(data.email);
      toast.success('Reset Code Sent', {
        description:
          'A 6-digit reset code has been sent to your email address.',
      });

      setStep('code');
      // eslint-disable-next-line
    } catch (error: any) {
      toast.error('Failed to send reset code', {
        description: error?.data?.message || 'Internal server error.',
      });
    }
  };

  return (
    <form
      onSubmit={emailForm.handleSubmit(handleSendCode)}
      className="space-y-4"
    >
      <div className="space-y-2">
        <Label htmlFor="email">Email Address</Label>
        <Input
          id="email"
          type="email"
          placeholder="Enter your email address"
          {...emailForm.register('email')}
          disabled={isSendingCode}
        />
        {emailForm.formState.errors.email && (
          <p className="text-sm text-red-600">
            {emailForm.formState.errors.email.message}
          </p>
        )}
      </div>

      <Alert>
        <Mail className="h-4 w-4" />
        <AlertDescription>
          We{"'"}ll send a 7-digit reset code to your email address if it exists
          in our system.
        </AlertDescription>
      </Alert>

      <Button type="submit" className="w-full" disabled={isSendingCode}>
        {isSendingCode ? (
          <>
            <Mail className="mr-2 h-4 w-4 animate-pulse" />
            Sending Code...
          </>
        ) : (
          <>
            <Mail className="mr-2 h-4 w-4" />
            Send Reset Code
          </>
        )}
      </Button>
    </form>
  );
};

export default ForgotEmailForm;
