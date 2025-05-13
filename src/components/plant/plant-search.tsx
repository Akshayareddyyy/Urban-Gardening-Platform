
'use client';

import { useState, useTransition } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { PlantCard } from '@/components/plant/plant-card';
import type { PlantSummary } from '@/types/plant';
import { searchPlants } from '@/lib/plant-api-service';
import { Loader2, SearchIcon, HelpCircle } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent, CardFooter } from '@/components/ui/card';

export function PlantSearch() {
  const [searchTerm, setSearchTerm] = useState('');
  const [results, setResults] = useState<PlantSummary[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searched, setSearched] = useState(false); // True if a search has been attempted
  const [isPending, startTransition] = useTransition();

  const performSearch = async (query: string) => {
    setIsLoading(true);
    setSearched(true); 
    try {
      // searchPlants in the backend will return [] for an empty query.
      const data = await searchPlants(query.trim());
      setResults(data);
    } catch (error) {
      console.error('Failed to search plants:', error);
      setResults([]);
    } finally {
      setIsLoading(false);
    }
  };

  const onSearchInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newSearchTerm = e.target.value;
    setSearchTerm(newSearchTerm);
  };
  
  const onSearchSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    startTransition(() => {
      performSearch(searchTerm);
    });
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

      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {Array.from({ length: 4 }).map((_, index) => (
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
      ) : searched && results.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">
          <HelpCircle className="mx-auto h-12 w-12 mb-4 text-accent" />
          <h2 className="text-2xl font-semibold text-foreground mb-2">No Plants Found</h2>
          <p>
            {searchTerm.trim() === '' 
              ? "Please enter a search term to find plants."
              : `We couldn't find any plants matching your search "${searchTerm}". Please check your spelling or try a different term.`}
          </p>
          <p className="text-sm mt-4">
            Note: If this issue persists for all searches, please ensure the Perenual API key is correctly configured in your application's environment settings.
          </p>
        </div>
      ) : results.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-8">
          {results.map((plant) => (
            <PlantCard key={plant.id} plant={plant} />
          ))}
        </div>
      ) : !searched && !isLoading ? ( 
         <div className="text-center py-12 text-muted-foreground">
           <SearchIcon className="mx-auto h-12 w-12 mb-4 text-accent" />
           <h2 className="text-2xl font-semibold text-foreground mb-2">Discover Your Perfect Plant</h2>
           <p>Enter a plant name in the search bar above to find information and care tips.</p>
         </div>
      ) : null}
    </div>
  );
}
