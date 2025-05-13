import type { PlantSuggestion } from '@/types/plant';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Lightbulb } from 'lucide-react';

interface SuggestionListProps {
  suggestions: PlantSuggestion[];
}

export function SuggestionList({ suggestions }: SuggestionListProps) {
  if (suggestions.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        <Lightbulb className="mx-auto h-12 w-12 mb-4 text-accent" />
        <p>No suggestions yet. Fill out the form above to get some ideas!</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold text-center text-primary mb-6">
        Here are some plant suggestions for you:
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {suggestions.map((suggestion, index) => (
          <Card key={index} className="flex flex-col bg-card shadow-lg hover:shadow-xl transition-shadow duration-300 rounded-lg">
            <CardHeader>
              <CardTitle className="text-xl text-primary flex items-center">
                <Lightbulb className="h-6 w-6 mr-3 text-accent" />
                {suggestion.name}
              </CardTitle>
            </CardHeader>
            <CardContent className="flex-grow">
              <CardDescription className="text-base text-foreground/80 leading-relaxed">
                {suggestion.description}
              </CardDescription>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
