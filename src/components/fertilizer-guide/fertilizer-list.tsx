
import type { FertilizerSuggestion } from '@/types/fertilizer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Droplets, Leaf, CheckCircle2 } from 'lucide-react';

interface FertilizerListProps {
  suggestions: FertilizerSuggestion[];
}

export function FertilizerList({ suggestions }: FertilizerListProps) {
  if (!suggestions || suggestions.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        <Leaf className="mx-auto h-12 w-12 mb-4 text-accent" />
        <p>No fertilizer recommendations available at the moment. Try adjusting your search criteria.</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <h2 className="text-3xl font-semibold text-center text-primary mb-8">
        Your Custom Fertilizer Recommendations
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {suggestions.map((suggestion, index) => (
          <Card key={index} className="flex flex-col bg-card shadow-lg hover:shadow-xl transition-shadow duration-300 rounded-lg border">
            <CardHeader className="pb-3">
              <CardTitle className="text-xl text-primary flex items-center">
                <Droplets className="h-6 w-6 mr-3 text-accent flex-shrink-0" />
                {suggestion.fertilizerName}
              </CardTitle>
            </CardHeader>
            <CardContent className="flex-grow pt-0 space-y-3">
              <div>
                <h4 className="text-sm font-semibold text-muted-foreground mb-1">Why it's a good choice:</h4>
                <p className="text-base text-foreground/90 leading-relaxed">
                  {suggestion.suitability}
                </p>
              </div>
               <div>
                <h4 className="text-sm font-semibold text-muted-foreground mb-1">How to use:</h4>
                <p className="text-base text-foreground/90 leading-relaxed">
                  {suggestion.applicationNotes}
                </p>
              </div>
            </CardContent>
            <CardFooter className="p-4 mt-auto">
                <div className="flex items-center text-xs text-muted-foreground">
                    <CheckCircle2 className="h-4 w-4 mr-2 text-green-500" />
                    <span>AI Recommended</span>
                </div>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
