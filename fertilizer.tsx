
'use client';

import { useState } from 'react';
import { FertilizerForm } from '@/components/fertilizer-guide/fertilizer-form';
import { FertilizerList } from '@/components/fertilizer-guide/fertilizer-list';
import { suggestFertilizers } from '@/ai/flows/suggest-fertilizers';
import type { SuggestFertilizersInput, SuggestFertilizersOutput } from '@/types/fertilizer';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Loader2, RefreshCw, FlaskConical } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
// Metadata can't be dynamic in 'use client' components directly.
// If dynamic metadata is needed, it must be exported from a server component or layout.
// For a static title/description for this page:
// export const metadata: Metadata = {
//   title: 'Fertilizer Guide | Urban Gardening Platform',
//   description: 'Get AI-powered fertilizer recommendations for your plants. Learn what to use and how to apply it for optimal growth.',
// };


export default function FertilizerGuidePage() {
  const [suggestions, setSuggestions] = useState<SuggestFertilizersOutput['suggestions']>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastInput, setLastInput] = useState<SuggestFertilizersInput | null>(null);
  const { toast } = useToast();

  const handleGetFertilizerSuggestions = async (data: SuggestFertilizersInput) => {
    setIsLoading(true);
    setError(null);
    setLastInput(data);
    setSuggestions([]); 

    try {
      const result = await suggestFertilizers(data);
      if (result && result.suggestions && result.suggestions.length > 0) {
        setSuggestions(result.suggestions);
        toast({
          title: "Fertilizer Advice Ready!",
          description: `We found ${result.suggestions.length} fertilizer ideas for your ${data.plantType}.`,
        });
      } else {
         setError('No specific fertilizer suggestions found for your criteria. Try adjusting your input.');
        toast({
          variant: "default",
          title: "No Specific Matches",
          description: "Try rephrasing your plant type or growth focus.",
        });
      }
    } catch (err) {
      console.error('Failed to get fertilizer suggestions:', err);
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred.';
      setError(`Sorry, we couldn't fetch fertilizer suggestions: ${errorMessage}`);
       toast({
        variant: "destructive",
        title: "Suggestion Error",
        description: "Failed to get fertilizer suggestions. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleRequestMore = () => {
    if (lastInput) {
      handleGetFertilizerSuggestions(lastInput);
    }
  };

  return (
    <ProtectedRoute>
      <section className="w-full space-y-12">
        <div className="text-center">
          <FlaskConical className="mx-auto h-16 w-16 text-primary opacity-80 mb-4" />
          <h1 className="text-4xl font-bold tracking-tight text-primary sm:text-5xl lg:text-6xl">
            Smart Fertilizer Guide
          </h1>
          <p className="mt-4 text-lg leading-8 text-muted-foreground max-w-2xl mx-auto">
            Confused about fertilizers? Tell us about your plant and its needs, and our AI will recommend the right nutrients for thriving growth.
          </p>
        </div>

        <FertilizerForm onSubmit={handleGetFertilizerSuggestions} isLoading={isLoading} />

        {isLoading && (
          <div className="flex justify-center items-center py-10">
            <Loader2 className="h-12 w-12 animate-spin text-primary" />
            <p className="ml-4 text-lg text-muted-foreground">Mixing up fertilizer advice...</p>
          </div>
        )}

        {error && !isLoading && (
          <Alert variant="destructive" className="max-w-xl mx-auto">
            <AlertTitle>Error Fetching Suggestions</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {!isLoading && !error && suggestions.length > 0 && (
          <div className="mt-12">
            <FertilizerList suggestions={suggestions} />
            <div className="text-center mt-8">
              <Button onClick={handleRequestMore} disabled={isLoading || !lastInput} variant="outline" size="lg">
                {isLoading && lastInput ? (
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                ) : (
                  <RefreshCw className="mr-2 h-5 w-5" />
                )}
                Get New Suggestions (Same Criteria)
              </Button>
            </div>
          </div>
        )}
        {!isLoading && !error && suggestions.length === 0 && lastInput && (
          <div className="text-center py-8 text-muted-foreground mt-8">
              <p className="text-lg">No specific fertilizer suggestions found for the given criteria. Perhaps try different keywords or broaden your search.</p>
          </div>
        )}
        {!isLoading && !error && suggestions.length === 0 && !lastInput && (
          <div className="text-center py-8 text-muted-foreground mt-8">
              <p className="text-lg">Enter your plant details above to get personalized fertilizer recommendations!</p>
          </div>
        )}
      </section>
    </ProtectedRoute>
  );
}
