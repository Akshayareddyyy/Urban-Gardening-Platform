
'use client';

import { useState, useTransition } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { PlantCard } from '@/components/plant/plant-card';
import type { PlantSummary } from '@/types/plant';
import { searchPlants } from '@/lib/plant-api-service';
import { MissingApiKeyError } from '@/lib/errors';
import { Loader2, SearchIcon, HelpCircle, Leaf, AlertTriangle, KeyRound } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

export function PlantSearch() {
  const [searchTerm, setSearchTerm] = useState('');
  const [results, setResults] = useState<PlantSummary[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const performSearch = async (query: string) => {
    setIsLoading(true);
    setSearched(true);
    setSearchError(null);
    setResults([]);

    try {
      // This function call uses the Perenual API via src/lib/plant-api-service.ts
      const data = await searchPlants(query.trim());
      setResults(data);
    } catch (error: any) {
      console.error('PlantSearch: Client-side caught error during searchPlants call:', error); // Log the full error object
      let displayErrorMessage = 'An unexpected error occurred while searching. Please try again. IMPORTANT: Check your Next.js server terminal logs for more specific error details from the backend.';
      
      if (error instanceof MissingApiKeyError) {
        // This specific error should now be caught by the specific check below
        displayErrorMessage = `Critical Configuration Error: The Perenual API key (NEXT_PUBLIC_PERENUAL_API_KEY) is missing or not accessible by the server.\n
        Please ensure ALL of the following are true:\n
        1. You have a file named exactly '.env' in the ROOT of your 'my-plant-app' project folder.\n
        2. This '.env' file contains the line: NEXT_PUBLIC_PERENUAL_API_KEY=your_actual_api_key\n
        3. You have completely STOPPED and RESTARTED your Next.js development server (e.g., npm run dev) after creating or modifying the .env file.\n
        Your Next.js server terminal logs should indicate if the key was loaded at startup. Current error message: ${error.message}`;
      } else if (error instanceof Error) {
        // This will catch the instructive error message re-thrown by plant-api-service.ts
        displayErrorMessage = error.message; // This message should already prompt to check server logs.
      }
      console.log('PlantSearch: Setting searchError state to:', displayErrorMessage); // Log what message is being set
      setSearchError(displayErrorMessage);
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
      <form onSubmit={onSearchSubmit} className="flex w-full max-w-2xl mx-auto items-center space-x-3 bg-card p-3 rounded-lg shadow-md border">
        <SearchIcon className="h-6 w-6 text-muted-foreground ml-2 flex-shrink-0" />
        <Input
          type="text"
          placeholder="E.g., Ficus, Rose, Indoor Fern..."
          value={searchTerm}
          onChange={onSearchInputChange}
          className="text-base flex-grow border-0 focus-visible:ring-0 focus-visible:ring-offset-0 shadow-none"
          aria-label="Search for plants"
        />
        <Button type="submit" disabled={isLoading || isPending} className="text-base px-6">
          {isLoading || isPending ? <Loader2 className="h-5 w-5 animate-spin" /> : <span className="hidden sm:inline">Search</span>}
          {isLoading || isPending ? null : <SearchIcon className="h-5 w-5 sm:hidden" />}
        </Button>
      </form>

      {isLoading ? (
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
      ) : searchError ? (
         <Alert variant="destructive" className="max-w-2xl mx-auto whitespace-pre-line">
           {/* Updated condition to check for more specific error messages related to API key issues */}
           {searchError.includes("NEXT_PUBLIC_PERENUAL_API_KEY") || searchError.includes("Perenual API key") ? <KeyRound className="h-5 w-5" /> : <AlertTriangle className="h-5 w-5" />}
           <AlertTitle>{searchError.includes("NEXT_PUBLIC_PERENUAL_API_KEY") || searchError.includes("Perenual API key") ? "API Key Configuration Issue" : "Search Error"}</AlertTitle>
           <AlertDescription>{searchError}</AlertDescription>
         </Alert>
      ) : searched && results.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">
          <HelpCircle className="mx-auto h-16 w-16 mb-4 text-accent opacity-70" />
          <h2 className="text-2xl font-semibold text-foreground mb-2">No Green Matches Found</h2>
          <p className="max-w-md mx-auto">
            {searchTerm.trim() === '' 
              ? "Please enter a search term to find plants."
              : `We couldn't find any plants matching "${searchTerm}". Try checking your spelling or using more general terms.`}
          </p>
          <p className="text-sm mt-4">
            Tip: Broaden your search (e.g., "flowering plant" instead of a very specific variety).
          </p>
        </div>
      ) : results.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-8">
          {results.map((plant) => (
            <PlantCard key={plant.id} plant={plant} />
          ))}
        </div>
      ) : !searched && !isLoading ? ( 
         <div className="text-center py-16 text-muted-foreground bg-gradient-to-b from-background to-secondary/30 rounded-xl border border-dashed">
           <Leaf className="mx-auto h-16 w-16 mb-6 text-primary opacity-60" />
           <h2 className="text-3xl font-semibold text-foreground mb-3">Ready to Find Your Plant?</h2>
           <p className="max-w-lg mx-auto text-lg">
             Type a plant name, characteristic, or type into the search bar above. 
             Let's unearth the perfect plant for your urban garden!
           </p>
         </div>
      ) : null}
    </div>
  );
}

    