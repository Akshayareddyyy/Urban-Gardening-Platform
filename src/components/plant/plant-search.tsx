'use client';

import { useState, useEffect, useTransition } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { PlantCard } from '@/components/plant/plant-card';
import type { PlantSummary } from '@/types/plant';
import { searchPlants } from '@/lib/plant-api-service'; // Updated import
import { Loader2, SearchIcon } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent, CardFooter } from '@/components/ui/card';

export function PlantSearch() {
  const [searchTerm, setSearchTerm] = useState('');
  const [results, setResults] = useState<PlantSummary[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [initialLoad, setInitialLoad] = useState(true);
  const [searched, setSearched] = useState(false); // To track if a search has been performed

  const performSearch = async (query: string) => {
    if (!query.trim() && !initialLoad) { // Don't search if query is empty unless it's initial load
      setResults([]);
      setSearched(true); // Mark as searched to show "No plants found" if appropriate
      setIsLoading(false);
      return;
    }
    setIsLoading(true);
    setSearched(true); // A search attempt is made
    try {
      // For initial load, we might fetch some default plants or leave it empty
      // For now, an empty initial query will also go through searchPlants which might return nothing or defaults based on its logic.
      const data = await searchPlants(query);
      setResults(data);
    } catch (error) {
      console.error('Failed to search plants:', error);
      setResults([]); // Clear results on error
    } finally {
      setIsLoading(false);
      if (initialLoad) setInitialLoad(false);
    }
  };

  useEffect(() => {
    // For initial load, we can fetch some popular plants or featured items.
    // Let's fetch with an empty query, which might be handled by searchPlants to return featured items or nothing.
    // Or, specify a default search like "popular houseplants"
    performSearch(''); // Or a default query like "rose"
  }, []); // Runs once on mount

  const onSearchInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newSearchTerm = e.target.value;
    setSearchTerm(newSearchTerm);
    // Debounced search or search on submit is usually better for APIs
    // For now, let's keep it simple: search on submit or when input is cleared
    if (!newSearchTerm.trim()) {
        startTransition(() => {
            performSearch(''); // Or clear results: setResults([]); setSearched(false);
        });
    }
  };
  
  const onSearchSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (searchTerm.trim()) {
        startTransition(() => {
            performSearch(searchTerm);
        });
    } else {
        // Handle empty search submission if needed, e.g., show all or clear
        performSearch('');
    }
  };
  
  const showSkeletons = initialLoad || (isLoading && results.length === 0);

  return (
    <div className="space-y-8">
      <form onSubmit={onSearchSubmit} className="flex w-full max-w-xl mx-auto items-center space-x-2">
        <Input
          type="text"
          placeholder="Search for plants (e.g., Basil, Rose)"
          value={searchTerm}
          onChange={onSearchInputChange}
          className="text-base"
          aria-label="Search for plants"
        />
        <Button type="submit" disabled={isLoading || isPending} className="text-base">
          {isLoading || isPending ? <Loader2 className="h-5 w-5 animate-spin" /> : <SearchIcon className="h-5 w-5" />}
          <span className="ml-2 hidden sm:inline">Search</span>
        </Button>
      </form>

      {showSkeletons ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {Array.from({ length: 4 }).map((_, index) => ( // Reduced skeleton count
            <Card key={index} className="flex flex-col">
              <Skeleton className="h-48 w-full rounded-t-lg" />
              <CardContent className="p-4 flex-grow space-y-2">
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
              </CardContent>
              <CardFooter className="p-4 flex justify-between items-center">
                <Skeleton className="h-6 w-1/4" />
                <Skeleton className="h-8 w-1/3" />
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : results.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-8">
          {results.map((plant) => (
            <PlantCard key={plant.id} plant={plant} />
          ))}
        </div>
      ) : searched && !isLoading ? ( // Only show "No Plants Found" if a search has been attempted
        <div className="text-center py-12">
          <h2 className="text-2xl font-semibold text-foreground mb-2">No Plants Found</h2>
          <p className="text-muted-foreground">
            Try adjusting your search terms or explore our suggestions.
          </p>
        </div>
      ) : null }
    </div>
  );
}
