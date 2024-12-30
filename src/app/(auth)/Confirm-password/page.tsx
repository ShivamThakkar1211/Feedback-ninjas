'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Navbar from '@/components/Navbar';
import { useToast } from '@/components/ui/use-toast';
import { useRouter } from 'next/navigation';

// Zod schema for new password validation with email
const resetPasswordSchema = z
  .object({
    email: z.string().email('Please enter a valid email address'),
    newPassword: z
      .string()
      .min(8, 'Password must be at least 8 characters long')
      .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
      .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
      .regex(/[0-9]/, 'Password must contain at least one number'),
    confirmPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    path: ['confirmPassword'],
    message: 'Passwords must match',
  });

export default function ResetPasswordForm() {
  const router = useRouter();
  const form = useForm<z.infer<typeof resetPasswordSchema>>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      email: '',
      newPassword: '',
      confirmPassword: '',
    },
  });

  const { toast } = useToast();

  const onSubmit = async (data: z.infer<typeof resetPasswordSchema>) => {
    try {
      const response = await fetch('/api/reset-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to reset password');
      }

      toast({
        title: 'Success',
        description: 'Your password has been reset. Please log in.',
        variant: 'default',
      });

      router.replace('/sign-in');
    } catch (error: any) {
      toast({
        title: 'Error',
        description:  'Something went wrong',
        variant: 'destructive',
      });
    }
  };

  return (
    <>
      <Navbar />
      <div className="flex justify-center items-center min-h-[89.5vh] bg-neonNostalgia-black">
        <div className="w-full max-w-md p-8 space-y-8 bg-neonNostalgia-purple rounded-lg shadow-lg">
          <div className="text-center">
            <h1 className="text-4xl font-extrabold tracking-tight text-neonNostalgia-blue lg:text-5xl mb-6">
              Reset Your Password
            </h1>
            <p className="mb-4 text-neonNostalgia-green">
              Enter your email and new password to reset your account
            </p>
          </div>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                name="email"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-neonNostalgia-pink">
                      Email Address
                    </FormLabel>
                    <Input
                      type="email"
                      className="bg-neonNostalgia-black text-white"
                      {...field}
                      autoComplete="email"
                    />
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                name="newPassword"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-neonNostalgia-pink">
                      New Password
                    </FormLabel>
                    <Input
                      type="password"
                      className="bg-neonNostalgia-black text-white"
                      {...field}
                      autoComplete="new-password"
                    />
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                name="confirmPassword"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-neonNostalgia-pink">
                      Confirm Password
                    </FormLabel>
                    <Input
                      type="password"
                      className="bg-neonNostalgia-black text-white"
                      {...field}
                      autoComplete="new-password"
                    />
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button
                className="w-full bg-neonNostalgia-blue text-neonNostalgia-black hover:bg-neonNostalgia-green"
                type="submit"
              >
                Reset Password
              </Button>
            </form>
          </Form>
        </div>
      </div>
    </>
  );
}
