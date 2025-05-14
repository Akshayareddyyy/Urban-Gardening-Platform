
'use client';

import { useState } from 'react';
import { SuggestionForm } from '@/components/suggestions/suggestion-form';
import { SuggestionList } from '@/components/suggestions/suggestion-list';
import { suggestPlants, type SuggestPlantsInput, type SuggestPlantsOutput } from '@/ai/flows/suggest-plants';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Loader2, RefreshCw } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';

export default function SuggestionsPage() {
  const [suggestions, setSuggestions] = useState<SuggestPlantsOutput['suggestions']>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastInput, setLastInput] = useState<SuggestPlantsInput | null>(null);
  const { toast } = useToast();

  const handleGetSuggestions = async (data: SuggestPlantsInput) => {
    setIsLoading(true);
    setError(null);
    setLastInput(data);
    try {
      const result = await suggestPlants(data);
      if (result && result.suggestions) {
        setSuggestions(result.suggestions);
        toast({
          title: "Suggestions Ready!",
          description: `We found ${result.suggestions.length} plant ideas for you.`,
        });
      } else {
        setSuggestions([]);
        setError('Received an unexpected response from the suggestion service. Please try again.');
        toast({
          variant: "destructive",
          title: "Error",
          description: "Could not process suggestions.",
        });
      }
    } catch (err) {
      console.error('Failed to get suggestions:', err);
      setError('Sorry, we couldn\'t fetch suggestions at this time. Please try again later.');
       toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to get plant suggestions.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleRequestMore = () => {
    if (lastInput) {
      handleGetSuggestions(lastInput);
    }
  };

  return (
    <ProtectedRoute>
      <section className="w-full space-y-12">
        <div className="text-center">
          <h1 className="text-4xl font-bold tracking-tight text-primary sm:text-5xl lg:text-6xl">
            Personalized Plant Ideas
          </h1>
          <p className="mt-4 text-lg leading-8 text-muted-foreground max-w-2xl mx-auto">
            Tell us about your space and climate, and our AI will suggest the perfect plants for your urban oasis.
          </p>
        </div>

        <SuggestionForm onSubmit={handleGetSuggestions} isLoading={isLoading} />

        {isLoading && (
          <div className="flex justify-center items-center py-10">
            <Loader2 className="h-12 w-12 animate-spin text-primary" />
            <p className="ml-4 text-lg text-muted-foreground">Generating your plant suggestions...</p>
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
            <SuggestionList suggestions={suggestions} />
            <div className="text-center mt-8">
              <Button onClick={handleRequestMore} disabled={isLoading || !lastInput} variant="outline" size="lg">
                {isLoading && lastInput ? (
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                ) : (
                  <RefreshCw className="mr-2 h-5 w-5" />
                )}
                Get New Suggestions With Same Criteria
              </Button>
            </div>
          </div>
        )}
        {!isLoading && !error && suggestions.length === 0 && lastInput && (
          <div className="text-center py-8 text-muted-foreground mt-8">
              <p className="text-lg">No suggestions found for the given criteria. Try being more general or different keywords.</p>
          </div>
        )}
        {!isLoading && !error && suggestions.length === 0 && !lastInput && (
          <div className="text-center py-8 text-muted-foreground mt-8">
              <p className="text-lg">Enter your details above to discover plants tailored for you!</p>
          </div>
        )}
      </section>
    </ProtectedRoute>
  );
}
