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

        if (socket) {
          socket.emit('auth:login', { userId: result.data.user._id });
          // socket.auth = { userId: result.data.user._id };
          console.log('Socket connected successfully.', socket.id);
        }

        toast.success('Login Successful', {
          description: `Welcome back, ${
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
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
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
        disabled={isLoading}
      />

      <div className="flex items-center justify-between">
        <div />
        <Link
          href="/forgot-password"
          className="text-primary text-sm hover:underline"
          aria-disabled={isLoading}
        >
          Forgot password?
        </Link>
      </div>

      <Button
        type="submit"
        className="h-10 w-full uppercase"
        disabled={isLoading}
      >
        {isLoading ? 'Signing in...' : 'Sign In'}
      </Button>
    </form>
  );
};

export default LoginForm;
