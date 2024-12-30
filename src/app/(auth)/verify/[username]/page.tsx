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
import { verifySchema } from '@/schemas/verifySchema';
import { useParams, useRouter } from 'next/navigation';
import { useState } from 'react';
import { Loader2 } from 'lucide-react';
import axios, { AxiosError } from 'axios';
import { ApiResponse } from '@/types/ApiResponse';

export default function VerifyAccount() {
  const router = useRouter();
  const params = useParams<{ username: string }>();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<z.infer<typeof verifySchema>>({
    resolver: zodResolver(verifySchema),
  });

  const onSubmit = async (data: z.infer<typeof verifySchema>) => {
    setIsSubmitting(true);
    try {
      const response = await axios.post<ApiResponse>(`/api/verify-code`, {
        username: params.username,
        code: data.code,
      });

      toast({
        title: 'Success',
        description: response.data.message,
      });

      router.replace('/sign-in');
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast({
        title: 'Verification Failed',
        description:
          axiosError.response?.data.message ?? 'An error occurred. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Navbar />
      <div className="flex justify-center items-center min-h-[89.5vh] bg-gradient-to-r from-green-400 via-teal-500 to-blue-500 dark:from-gray-800 dark:via-gray-700 dark:to-gray-800">
        <div className="w-full max-w-md p-8 space-y-8 bg-opacity-90 bg-gray-900 rounded-lg shadow-xl">
          <div className="text-center">
            <h1 className="text-4xl font-extrabold tracking-tight text-white lg:text-5xl mb-6 animate-pulse">
              Verify Your{" "}
              <span className="text-orange-500 dark:text-orange-300">Account</span>
            </h1>
            <p className="mb-4 text-teal-300">
              Enter the verification code sent to your email
            </p>
          </div>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                name="code"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-orange-400">Verification Code</FormLabel>
                    <Input
                      {...field}
                      className="bg-gray-800 text-white border-teal-300"
                      autoComplete="one-time-code"
                    />
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button
                type="submit"
                className="w-full bg-neonNostalgia-blue text-neonNostalgia-black hover:bg-neonNostalgia-green"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Verifying...
                  </>
                ) : (
                  "Verify"
                )}
              </Button>
            </form>
          </Form>
          {/* <div className="text-center mt-4">
            <p className="text-teal-300">
              Didn’t receive the code?{" "}
              <a
                href="/sign-up"
                className="text-orange-400 hover:text-teal-400 transition-all"
              >
                Resend Code
              </a>
            </p>
          </div> */}
        </div>
      </div>
    </>
  );
}
