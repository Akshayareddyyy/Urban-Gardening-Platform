'use client';

import { useState, useEffect, useTransition } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { PlantCard } from '@/components/plant/plant-card';
import type { PlantSummary } from '@/types/plant';
import { searchPlants } from '@/lib/perenual-api';
import { Loader2, SearchIcon } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent, CardFooter } from '@/components/ui/card'; // Added import

export function PlantSearch() {
  const [searchTerm, setSearchTerm] = useState('');
  const [results, setResults] = useState<PlantSummary[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [initialLoad, setInitialLoad] = useState(true);

  const handleSearch = async (query: string) => {
    setIsLoading(true);
    try {
      const data = await searchPlants(query);
      setResults(data);
    } catch (error) {
      console.error('Failed to search plants:', error);
      // Handle error display if needed
    } finally {
      setIsLoading(false);
      if (initialLoad) setInitialLoad(false);
    }
  };

  useEffect(() => {
    // Initial load of some plants or handle empty state
    handleSearch('');
  }, []);

  const onSearchInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    startTransition(() => {
      handleSearch(e.target.value);
    });
  };
  
  const onSearchSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    handleSearch(searchTerm);
  };

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

      {initialLoad || (isLoading && results.length === 0) ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {Array.from({ length: 8 }).map((_, index) => (
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
      ) : (
        <div className="text-center py-12">
          <h2 className="text-2xl font-semibold text-foreground mb-2">No Plants Found</h2>
          <p className="text-muted-foreground">
            Try adjusting your search terms or explore our suggestions.
          </p>
        </div>
      )}
    </div>
  );
}
