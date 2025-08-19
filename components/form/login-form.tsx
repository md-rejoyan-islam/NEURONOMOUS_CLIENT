'use client';
import { Button } from '@/components/ui/button';
import { socketManager } from '@/lib/socket';
import { LoginInput, loginSchema } from '@/lib/validations';
import { useLoginMutation } from '@/queries/auth';
import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import InputField from './input-field';
import PasswordField from './password-field';

const LoginForm = () => {
  const router = useRouter();
  const [login, { isLoading }] = useLoginMutation();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginInput) => {
    try {
      const result = await login(data).unwrap();

      if (result?.success) {
        const socket = socketManager.connect();

        console.log('Socket connection status:', socketManager.isConnected());

        if (socket && socketManager.isConnected()) {
          console.log('Socket connected successfully.');

          socket.emit('auth:login', { userId: result.data.user._id });
        }

        toast.success('Login Successful', {
          description: `Welcome back2, ${
            result.data.user.first_name + ' ' + result.data.user.last_name
          }!`,
        });
        router.push('/');
      }
      // eslint-disable-next-line
    } catch (error: any) {
      toast.error('Login Failed', {
        description: error?.data?.message || 'Internal server error.',
      });
    }
  };
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <InputField
        label="Enter your email"
        type="email"
        placeholder="Enter your email address"
        name="email"
        isOptional={false}
        error={errors.email?.message}
        props={register('email', {
          required: 'Email is required',
          pattern: {
            value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
            message: 'Invalid email address',
          },
        })}
        disabled={isLoading}
      />
      <PasswordField
        label="Enter your password"
        placeholder="Enter your password"
        error={errors.password?.message}
        props={register('password', {
          required: 'Password is required',
          minLength: {
            value: 6,
            message: 'Password must be at least 6 characters',
          },
        })}
      />

      <div className="flex items-center justify-between">
        <div />
        <Link
          href="/forgot-password"
          className="text-primary text-sm hover:underline"
        >
          Forgot password?
        </Link>
      </div>

      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? 'Signing in...' : 'Sign In'}
      </Button>
    </form>
  );
};

export default LoginForm;
