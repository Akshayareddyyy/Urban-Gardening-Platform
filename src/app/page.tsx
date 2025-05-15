
'use client';

import { PlantSearch } from '@/components/plant/plant-search';
import { Sprout, Loader2 } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { PublicLandingPage } from '@/components/landing/public-landing-page';

export default function HomePage() {
  const { user, isLoading, isAuthenticated } = useAuth();

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-200px)]">
        <Loader2 className="h-16 w-16 animate-spin text-primary mb-4" />
        <p className="text-xl text-muted-foreground">Loading your gardening experience...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <PublicLandingPage />;
  }

  return (
    <section className="w-full">
      <div className="text-center mb-12">
        <Sprout className="mx-auto h-20 w-20 text-primary opacity-80 mb-6" />
        <h1 className="text-4xl font-bold tracking-tight text-primary sm:text-5xl lg:text-6xl">
          Discover Your Next Green Companion
        </h1>
        <p className="mt-6 text-lg leading-8 text-muted-foreground max-w-2xl mx-auto">
          Explore our vast plant database or get personalized AI suggestions. Find the perfect plants to transform your urban space into a green oasis.
        </p>
      </div>
      <PlantSearch />
    </section>
  );
}
