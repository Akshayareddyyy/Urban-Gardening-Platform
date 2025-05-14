
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
import { signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { useRouter } from 'next/navigation';
import { Separator } from '@/components/ui/separator';

const loginFormSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address." }),
  password: z.string().min(1, { message: "Password is required." }),
});

type LoginFormValues = z.infer<typeof loginFormSchema>;

// Simple Google Icon component
const GoogleIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" width="20px" height="20px" {...props}>
    <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
    <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
    <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
    <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
    <path fill="none" d="M0 0h48v48H0z"/>
  </svg>
);

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
        description: "Welcome!", 
      });
      router.push('/');
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

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    if (!auth) {
      toast({ variant: "destructive", title: "Configuration Error", description: "Authentication service not available." });
      setIsLoading(false);
      return;
    }

    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
      toast({
        title: "Login Successful",
        description: "Welcome!",
      });
      router.push('/');
    } catch (error: any) {
      console.error("Error signing in with Google:", error);
      let errorMessage = "An unexpected error occurred during Google sign-in. Please try again.";
      switch (error.code) {
        case 'auth/popup-closed-by-user':
          errorMessage = "Sign-in popup was closed before completion. Please try again.";
          break;
        case 'auth/cancelled-popup-request':
           errorMessage = "Multiple sign-in popups were open. Please close them and try again.";
           break;
        case 'auth/popup-blocked':
          errorMessage = "Sign-in popup was blocked by the browser. Please enable popups for this site and try again.";
          break;
        case 'auth/account-exists-with-different-credential':
          errorMessage = "An account already exists with the same email address but different sign-in credentials. Try signing in with the original method used for that email.";
          break;
        case 'auth/operation-not-allowed':
            errorMessage = "Google Sign-In is not enabled for this project. Please contact support or enable it in the Firebase console.";
            break;
        default:
          errorMessage = error.message || errorMessage;
      }
      toast({
        variant: "destructive",
        title: "Google Sign-In Failed",
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
        
        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <Separator />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-card px-2 text-muted-foreground">
              Or continue with
            </span>
          </div>
        </div>

        <Button 
          variant="outline" 
          type="button"
          onClick={handleGoogleSignIn} 
          disabled={isLoading} 
          className="w-full text-base py-3 h-12"
        >
          {isLoading ? (
            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
          ) : (
            <GoogleIcon className="mr-2" />
          )}
          Sign In with Google
        </Button>

      </CardContent>
    </Card>
  );
}
