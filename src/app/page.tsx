
'use client'; // Required for ProtectedRoute if it uses client features

import { PlantSearch } from '@/components/plant/plant-search';
import { Sprout } from 'lucide-react';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';

export default function HomePage() {
  return (
    <ProtectedRoute>
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
    </ProtectedRoute>
  );
}
