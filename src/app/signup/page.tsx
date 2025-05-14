
import type { Metadata } from 'next';
import { SignupForm } from '@/components/auth/signup-form';
import { UserPlus } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button'; // Added import

export const metadata: Metadata = {
  title: 'Sign Up | Urban Gardening Platform',
  description: 'Create an account on the Urban Gardening Platform.',
};

export default function SignupPage() {
  return (
    <section className="w-full flex flex-col items-center justify-center py-12 md:py-20">
      <div className="text-center mb-10">
        <UserPlus className="mx-auto h-16 w-16 text-primary opacity-80 mb-4" />
        <h1 className="text-4xl font-bold tracking-tight text-primary sm:text-5xl">
          Join Our Community!
        </h1>
        <p className="mt-3 text-lg leading-8 text-muted-foreground max-w-md mx-auto">
          Create your account to start your urban gardening journey with us.
        </p>
      </div>
      <SignupForm />
      <p className="mt-8 text-center text-sm text-muted-foreground">
        Already have an account?{' '}
        <Button variant="link" asChild className="text-primary hover:underline">
          <Link href="/login">Log in here</Link>
        </Button>
      </p>
    </section>
  );
}
