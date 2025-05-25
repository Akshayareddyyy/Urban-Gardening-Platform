
'use client';

import { useState } from 'react';
import { SuggestionForm } from '@/components/suggestions/suggestion-form';
import { SuggestionList } from '@/components/suggestions/suggestion-list';
import { suggestPlants, type SuggestPlantsInput, type SuggestPlantsOutput } from '@/ai/flows/suggest-plants';
import { getCultivationGuide, type GetCultivationGuideInput, type GetCultivationGuideOutput } from '@/ai/flows/get-cultivation-guide-flow'; // New import
import { CultivationGuideForm } from '@/components/suggestions/cultivation-guide-form'; // New import
import { CultivationGuideDisplay } from '@/components/suggestions/cultivation-guide-display'; // New import
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator'; // New import
import { Loader2, RefreshCw, Lightbulb, HelpCircle } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';

export default function SuggestionsPage() {
  const [suggestions, setSuggestions] = useState<SuggestPlantsOutput['suggestions']>([]);
  const [isLoadingSuggestions, setIsLoadingSuggestions] = useState(false);
  const [suggestionError, setSuggestionError] = useState<string | null>(null);
  const [lastSuggestionInput, setLastSuggestionInput] = useState<SuggestPlantsInput | null>(null);

  const [cultivationGuide, setCultivationGuide] = useState<GetCultivationGuideOutput | null>(null);
  const [isFetchingGuide, setIsFetchingGuide] = useState(false);
  const [guideError, setGuideError] = useState<string | null>(null);
  const [selectedPlantForGuide, setSelectedPlantForGuide] = useState<string | undefined>(undefined);


  const { toast } = useToast();

  const handleGetSuggestions = async (data: SuggestPlantsInput) => {
    setIsLoadingSuggestions(true);
    setSuggestionError(null);
    setLastSuggestionInput(data);
    setSuggestions([]); // Clear previous suggestions
    setCultivationGuide(null); // Clear previous guide
    setSelectedPlantForGuide(undefined); // Clear selected plant

    try {
      const result = await suggestPlants(data);
      if (result && result.suggestions && result.suggestions.length > 0) {
        setSuggestions(result.suggestions);
        toast({
          title: "Plant Suggestions Ready!",
          description: `We found ${result.suggestions.length} plant ideas for you.`,
        });
        // Optionally, pre-select the first suggested plant for the cultivation guide
        if (result.suggestions[0]?.name) {
          setSelectedPlantForGuide(result.suggestions[0].name);
        }
      } else {
        setSuggestions([]);
        setSuggestionError(result?.suggestions?.[0]?.description || 'No specific plant suggestions found for your criteria. Try adjusting your input.');
        toast({
          variant: "default",
          title: "No Matches Found",
          description: result?.suggestions?.[0]?.description || "Try rephrasing your climate or space description.",
        });
      }
    } catch (err) {
      console.error('Failed to get suggestions:', err);
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred while fetching suggestions.';
      setSuggestionError(`Sorry, we couldn't fetch plant suggestions: ${errorMessage}`);
       toast({
        variant: "destructive",
        title: "Suggestion Error",
        description: errorMessage,
      });
    } finally {
      setIsLoadingSuggestions(false);
    }
  };

  const handleRequestMoreSuggestions = () => {
    if (lastSuggestionInput) {
      handleGetSuggestions(lastSuggestionInput);
    }
  };

  const handleGetCultivationGuide = async (data: GetCultivationGuideInput) => {
    setIsFetchingGuide(true);
    setGuideError(null);
    setCultivationGuide(null);
    try {
      const result = await getCultivationGuide(data);
      if (result && result.plantName) { // Check if a valid guide was returned
        setCultivationGuide(result);
        toast({
          title: "Cultivation Guide Ready!",
          description: `Displaying cultivation guide for ${data.plantName}.`,
        });
      } else {
        setCultivationGuide(null);
        setGuideError(`Could not generate a cultivation guide for "${data.plantName}". The AI might not have information for this specific plant or an error occurred.`);
         toast({
          variant: "destructive",
          title: "Guide Error",
          description: `Failed to generate guide for ${data.plantName}.`,
        });
      }
    } catch (err) {
      console.error('Failed to get cultivation guide:', err);
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred.';
      setGuideError(`Sorry, an error occurred while fetching the cultivation guide: ${errorMessage}`);
      toast({
        variant: "destructive",
        title: "Guide System Error",
        description: errorMessage,
      });
    } finally {
      setIsFetchingGuide(false);
    }
  };


  return (
    <ProtectedRoute>
      <section className="w-full space-y-12">
        <div className="text-center">
           <Lightbulb className="mx-auto h-16 w-16 text-primary opacity-80 mb-4" />
          <h1 className="text-4xl font-bold tracking-tight text-primary sm:text-5xl lg:text-6xl">
            Personalized Plant Ideas
          </h1>
          <p className="mt-4 text-lg leading-8 text-muted-foreground max-w-2xl mx-auto">
            Tell us about your space and climate, and our AI will suggest the perfect plants for your urban oasis.
          </p>
        </div>

        <SuggestionForm onSubmit={handleGetSuggestions} isLoading={isLoadingSuggestions} />

        {isLoadingSuggestions && (
          <div className="flex justify-center items-center py-10">
            <Loader2 className="h-12 w-12 animate-spin text-primary" />
            <p className="ml-4 text-lg text-muted-foreground">Generating your plant suggestions...</p>
          </div>
        )}

        {suggestionError && !isLoadingSuggestions && (
          <Alert variant="destructive" className="max-w-xl mx-auto">
            <AlertTitle>Suggestion Error</AlertTitle>
            <AlertDescription>{suggestionError}</AlertDescription>
          </Alert>
        )}

        {!isLoadingSuggestions && !suggestionError && suggestions.length > 0 && (
          <div className="mt-12">
            <SuggestionList suggestions={suggestions} />
            <div className="text-center mt-8">
              <Button onClick={handleRequestMoreSuggestions} disabled={isLoadingSuggestions || !lastSuggestionInput} variant="outline" size="lg">
                {isLoadingSuggestions && lastSuggestionInput ? (
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                ) : (
                  <RefreshCw className="mr-2 h-5 w-5" />
                )}
                Get New Suggestions (Same Criteria)
              </Button>
            </div>
          </div>
        )}
        
        {!isLoadingSuggestions && !suggestionError && suggestions.length === 0 && lastSuggestionInput && (
           <div className="text-center py-10 text-muted-foreground">
            <HelpCircle className="mx-auto h-12 w-12 mb-3 opacity-70" />
            <h3 className="text-xl font-semibold">No Suggestions Found</h3>
            <p>We couldn't find specific plant matches for your criteria. Try rephrasing your climate or space description.</p>
          </div>
        )}
        
        {!isLoadingSuggestions && !suggestionError && suggestions.length === 0 && !lastSuggestionInput && (
          <div className="text-center py-8 text-muted-foreground mt-8">
              <p className="text-lg">Enter your details above to discover plants tailored for you!</p>
          </div>
        )}

        {/* Cultivation Guide Section - Appears after suggestions are loaded */}
        {(suggestions.length > 0 || cultivationGuide) && !isLoadingSuggestions && (
          <>
            <Separator className="my-12" />
            <div className="space-y-8">
              <div className="text-center">
                <h2 className="text-3xl font-bold tracking-tight text-primary sm:text-4xl">
                  How to Grow Your Plant
                </h2>
                <p className="mt-3 text-md leading-7 text-muted-foreground max-w-xl mx-auto">
                  Got a plant in mind from the suggestions above or your own choice? Enter its name below to get detailed cultivation steps.
                </p>
              </div>
              <CultivationGuideForm 
                onSubmit={handleGetCultivationGuide} 
                isLoading={isFetchingGuide}
                initialPlantName={selectedPlantForGuide} 
              />
              {isFetchingGuide && (
                <div className="flex justify-center items-center py-10">
                  <Loader2 className="h-10 w-10 animate-spin text-primary" />
                  <p className="ml-3 text-md text-muted-foreground">Crafting cultivation guide...</p>
                </div>
              )}
              {guideError && !isFetchingGuide && (
                <Alert variant="destructive" className="max-w-xl mx-auto">
                  <AlertTitle>Guide Error</AlertTitle>
                  <AlertDescription>{guideError}</AlertDescription>
                </Alert>
              )}
              <CultivationGuideDisplay guide={cultivationGuide} />
            </div>
          </>
        )}
      </section>
    </ProtectedRoute>
  );
}
