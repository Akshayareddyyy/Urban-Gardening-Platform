import type { PlantSuggestion } from '@/types/plant';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Lightbulb, Leaf } from 'lucide-react';

interface SuggestionListProps {
  suggestions: PlantSuggestion[];
}

export function SuggestionList({ suggestions }: SuggestionListProps) {
  if (!suggestions || suggestions.length === 0) {
    // This case should ideally be handled by the parent component (SuggestionsPage)
    // before rendering this list, but as a fallback:
    return (
      <div className="text-center py-8 text-muted-foreground">
        <Leaf className="mx-auto h-12 w-12 mb-4 text-accent" />
        <p>No plant suggestions available at the moment.</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <h2 className="text-3xl font-semibold text-center text-primary mb-8">
        Your Personalized Plant Recommendations
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {suggestions.map((suggestion, index) => (
          <Card key={index} className="flex flex-col bg-card shadow-lg hover:shadow-xl transition-shadow duration-300 rounded-lg border">
            <CardHeader className="pb-3">
              <CardTitle className="text-xl text-primary flex items-center">
                <Lightbulb className="h-6 w-6 mr-3 text-accent flex-shrink-0" />
                {suggestion.name}
              </CardTitle>
            </CardHeader>
            <CardContent className="flex-grow pt-0">
              <CardDescription className="text-base text-foreground/90 leading-relaxed">
                {suggestion.description}
              </CardDescription>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
