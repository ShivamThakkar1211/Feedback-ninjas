"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/ui/use-toast";
import { signInSchema } from "@/schemas/signInSchema";
import Navbar from "@/components/Navbar";
import { signIn } from "next-auth/react";
import { useState } from "react";
import { Loader2 } from "lucide-react";
export default function SignInForm() {
  const router = useRouter();
    const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<z.infer<typeof signInSchema>>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      identifier: "",
      password: "",
    },
  });

  const { toast } = useToast();
  const onSubmit = async (data: z.infer<typeof signInSchema>) => {
    const result = await signIn("credentials", {
      redirect: false,
      identifier: data.identifier,
      password: data.password,
    });

    if (result?.error) {
      if (result.error === "CredentialsSignin") {
        toast({
          title: "Login Failed",
          description: "Incorrect username or password",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Error",
          description: result.error,
          variant: "destructive",
        });
      }
    }

    if (result?.url) {
      router.replace("/dashboard");
    }
  };

  return (
    <>
      <Navbar />
      <div className="flex justify-center items-center min-h-[89.5vh] bg-gradient-to-r from-green-400 via-teal-500 to-blue-500 dark:from-gray-800 dark:via-gray-700 dark:to-gray-800">
        <div className="w-full max-w-md p-8 space-y-8 bg-opacity-90 bg-gray-900 rounded-lg shadow-xl">
          <div className="text-center">
            <h1 className="text-4xl font-extrabold tracking-tight text-white lg:text-5xl mb-6 animate-pulse">
              Welcome Back to{" "}
              <span className="text-orange-500 dark:text-orange-300">
                Feedback Ninjas!
              </span>
            </h1>
            <p className="mb-4 text-teal-300">
              Sign in to continue your secret conversations
            </p>
          </div>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {/* Identifier Field */}
              <FormField
                name="identifier"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-orange-400">Email/Username</FormLabel>
                    <Input
                      className="bg-gray-800 text-white border-teal-300"
                      {...field}
                      autoComplete="username"
                    />
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Password Field */}
              <FormField
                name="password"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-orange-400">Password</FormLabel>
                    <Input
                      type="password"
                      className="bg-gray-800 text-white border-teal-300"
                      {...field}
                      autoComplete="current-password"
                    />
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Submit Button */}
              <Button
                type="submit"
                className="w-full bg-neonNostalgia-blue text-neonNostalgia-black hover:bg-neonNostalgia-green"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Please wait
                  </>
                ) : (
                  "Sign Up"
                )}
              </Button>
            </form>
          </Form>
          <div className="text-center mt-4">
            <p className="text-teal-300">
              Not a member yet?{" "}
              <Link
                href="/sign-up"
                className="text-orange-400 hover:text-teal-400 transition-all"
              >
                Sign up
              </Link>
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
