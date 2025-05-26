
import type { Metadata } from 'next';
import { LoginForm } from '@/components/auth/login-form';
import { LogIn } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export const metadata: Metadata = {
  title: 'Login | Urban Gardening Platform',
  description: 'Login to your Urban Gardening Platform account.',
};

export default function LoginPage() {
  return (
    <section className="w-full flex flex-col items-center justify-center py-12 md:py-20">
      <div className="text-center mb-10">
        <LogIn className="mx-auto h-16 w-16 text-primary opacity-80 mb-4" />
        <h1 className="text-4xl font-bold tracking-tight text-primary sm:text-5xl">
          Welcome!
        </h1>
        <p className="mt-3 text-lg leading-8 text-muted-foreground max-w-md mx-auto">
          Sign in to access your personalized urban garden, community showcase, and helpful tools.
        </p>
      </div>
      <LoginForm />
      <p className="mt-8 text-center text-sm text-muted-foreground">
        Don&apos;t have an account?{' '}
        <Button variant="link" asChild className="text-primary hover:underline">
          <Link href="/signup">Sign up here</Link>
        </Button>
      </p>
    </section>
  );
}
