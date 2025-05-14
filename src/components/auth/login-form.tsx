
'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { Loader2, KeyRound } from 'lucide-react';
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import Link from 'next/link';
import { auth } from '@/lib/firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { useRouter } from 'next/navigation';

const loginFormSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address." }),
  password: z.string().min(1, { message: "Password is required." }),
});

type LoginFormValues = z.infer<typeof loginFormSchema>;

export function LoginForm() {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const handleSubmit = async (values: LoginFormValues) => {
    setIsLoading(true);

    if (!process.env.NEXT_PUBLIC_FIREBASE_API_KEY) {
      console.error("Firebase API Key is missing. Please check your .env file and ensure NEXT_PUBLIC_FIREBASE_API_KEY is set.");
      toast({
        variant: "destructive",
        title: "Configuration Error",
        description: "Firebase API Key is not configured in the application environment. Please ensure it is set correctly and the server was restarted.",
      });
      setIsLoading(false);
      return;
    }

    if (!auth) {
        console.error("Firebase Auth is not initialized.");
        toast({
            variant: "destructive",
            title: "Configuration Error",
            description: "The authentication service is not configured. Please contact support.",
        });
        setIsLoading(false);
        return;
    }
    try {
      await signInWithEmailAndPassword(auth, values.email, values.password);
      toast({
        title: "Login Successful",
        description: "Welcome back!",
      });
      router.push('/'); 
      // router.refresh(); // To ensure layout updates reflecting auth state
    } catch (error: any) {
      console.error("Error signing in:", error);
      let errorMessage = "An unexpected error occurred during login. Please try again.";
      switch (error.code) {
        case 'auth/invalid-email':
          errorMessage = "The email address is not valid.";
          break;
        case 'auth/user-disabled':
          errorMessage = "This user account has been disabled.";
          break;
        case 'auth/user-not-found':
        case 'auth/wrong-password':
        case 'auth/invalid-credential':
          errorMessage = "Invalid email or password. Please try again.";
          break;
        case 'auth/api-key-not-valid':
          errorMessage = "Firebase API Key is not valid. Please ensure it's configured correctly in your project environment and the server was restarted.";
          break;
        default:
          errorMessage = error.message || errorMessage;
      }
      toast({
        variant: "destructive",
        title: "Login Failed",
        description: errorMessage,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md shadow-xl border">
      <CardHeader>
        <CardTitle className="text-2xl font-semibold text-primary">Login</CardTitle>
        <CardDescription>Enter your credentials to access your account.</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-md font-medium text-primary">Email Address</FormLabel>
                  <FormControl>
                    <Input type="email" placeholder="you@example.com" {...field} className="text-base" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-md font-medium text-primary">Password</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="••••••••" {...field} className="text-base" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex items-center justify-between">
                <Button variant="link" asChild className="px-0 text-sm">
                    <Link href="#">Forgot password?</Link>
                </Button>
            </div>
            <Button type="submit" disabled={isLoading} className="w-full text-base py-3 h-12">
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Signing In...
                </>
              ) : (
                <>
                  <KeyRound className="mr-2 h-5 w-5" />
                  Sign In
                </>
              )}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
