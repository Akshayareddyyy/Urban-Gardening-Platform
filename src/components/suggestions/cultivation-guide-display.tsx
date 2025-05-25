
'use client';

import type { GetCultivationGuideOutput } from '@/ai/flows/get-cultivation-guide-flow';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { CheckCircle2, AlertTriangle, BookText, Sun, Droplets, Wind, Clock, Sprout, Info } from 'lucide-react';

interface CultivationGuideDisplayProps {
  guide: GetCultivationGuideOutput | null;
}

const DetailSection: React.FC<{ icon: React.ElementType; title: string; content?: string | null }> = ({ icon: Icon, title, content }) => {
  if (!content) return null;
  return (
    <div className="flex items-start space-x-3">
      <Icon className="h-6 w-6 text-accent mt-1 flex-shrink-0" />
      <div>
        <h4 className="text-md font-semibold text-foreground">{title}</h4>
        <p className="text-muted-foreground text-sm whitespace-pre-wrap">{content}</p>
      </div>
    </div>
  );
};

export function CultivationGuideDisplay({ guide }: CultivationGuideDisplayProps) {
  if (!guide) {
    return null;
  }

  if (guide.introduction && guide.introduction.toLowerCase().includes("could not generate") || guide.introduction?.toLowerCase().includes("an error occurred")) {
     return (
      <Card className="mt-8 border-destructive bg-destructive/10">
        <CardHeader>
          <div className="flex items-center gap-3">
            <AlertTriangle className="h-8 w-8 text-destructive" />
            <CardTitle className="text-destructive text-xl">Guide Generation Issue for "{guide.plantName}"</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-destructive/90">
            {guide.introduction || "We encountered an issue generating the cultivation guide for this plant. Please try again or search for a different plant."}
          </p>
        </CardContent>
      </Card>
    );
  }


  return (
    <Card className="mt-10 shadow-xl border-primary/30">
      <CardHeader className="bg-muted/30 p-6 rounded-t-lg">
        <div className="flex items-center gap-3">
          <BookText className="h-10 w-10 text-primary opacity-80" />
          <div>
            <CardTitle className="text-3xl font-bold text-primary">Cultivation Guide: {guide.plantName}</CardTitle>
            {guide.introduction && <CardDescription className="text-md text-muted-foreground mt-1">{guide.introduction}</CardDescription>}
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-6 space-y-6">
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-4 border rounded-md bg-background shadow-sm">
          <DetailSection icon={Sun} title="Sunlight Needs" content={guide.sunlightNeeds} />
          <DetailSection icon={Droplets} title="Watering Needs" content={guide.wateringNeeds} />
          <DetailSection icon={Wind} title="Soil Needs" content={guide.soilNeeds} /> {/* Using Wind as a placeholder for soil/earth element */}
        </div>

        {guide.plantingSteps && guide.plantingSteps.length > 0 && (
          <div>
            <h3 className="text-xl font-semibold text-primary mb-4 flex items-center">
              <Sprout className="h-6 w-6 mr-2 text-accent" /> Planting & Growth Steps
            </h3>
            <div className="space-y-5 pl-2 border-l-2 border-primary/30 ml-2">
              {guide.plantingSteps.map((step) => (
                <div key={step.stepNumber} className="relative pl-6 group">
                  <span className="absolute left-[-0.8rem] top-1 flex h-6 w-6 items-center justify-center rounded-full bg-primary text-primary-foreground text-sm font-bold ring-4 ring-background group-hover:bg-accent transition-colors">
                    {step.stepNumber}
                  </span>
                  <h4 className="text-lg font-medium text-foreground mb-1">{step.title}</h4>
                  <p className="text-muted-foreground text-sm leading-relaxed">{step.description}</p>
                </div>
              ))}
            </div>
          </div>
        )}
        
        <Separator />

        <div className="space-y-4">
            {guide.estimatedTimeToHarvestOrBloom && (
                <DetailSection icon={Clock} title="Estimated Time to Harvest/Bloom" content={guide.estimatedTimeToHarvestOrBloom} />
            )}
            {guide.commonPestsAndDiseases && (
                <DetailSection icon={AlertTriangle} title="Common Pests & Diseases" content={guide.commonPestsAndDiseases} />
            )}
            {guide.additionalTips && (
                <DetailSection icon={Info} title="Additional Tips" content={guide.additionalTips} />
            )}
        </div>

      </CardContent>
       <CardFooter className="p-4 bg-muted/30 border-t">
          <div className="flex items-center text-xs text-muted-foreground">
              <CheckCircle2 className="h-4 w-4 mr-2 text-green-500" />
              <span>AI Generated Gardening Advice</span>
          </div>
      </CardFooter>
    </Card>
  );
}
