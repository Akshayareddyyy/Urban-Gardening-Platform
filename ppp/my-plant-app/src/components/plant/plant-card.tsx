
import Image from 'next/image';
import Link from 'next/link';
import type { PlantSummary } from '@/types/plant';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ArrowRight, Droplets, Sun, ImageOff } from 'lucide-react';

interface PlantCardProps {
  plant: PlantSummary;
}

export function PlantCard({ plant }: PlantCardProps) {
  const imageUrl = plant.default_image?.regular_url || plant.default_image?.original_url || plant.default_image?.medium_url || plant.default_image?.small_url || plant.default_image?.thumbnail;
  const linkHref = `/plants/${String(plant.id)}`;

  // Process sunlight information for display
  let sunlightDisplayString = 'N/A';
  if (plant.sunlight && Array.isArray(plant.sunlight)) {
    const validSunlightEntries = plant.sunlight.map(s => s.trim()).filter(s => s && s.toLowerCase() !== 'n/a' && s !== '');
    if (validSunlightEntries.length > 0) {
      sunlightDisplayString = validSunlightEntries.join(', ');
    }
  } else if (plant.sunlight && typeof plant.sunlight === 'string' && plant.sunlight.trim().toLowerCase() !== 'n/a' && plant.sunlight.trim() !== '') {
    sunlightDisplayString = plant.sunlight.trim();
  }

  // Process watering information for display
  let wateringDisplayString = 'N/A';
  if (plant.watering && typeof plant.watering === 'string' && plant.watering.trim().toLowerCase() !== 'n/a' && plant.watering.trim() !== '') {
    wateringDisplayString = plant.watering.trim();
  }
  
  const cycleDisplayString = (plant.cycle && typeof plant.cycle === 'string' && plant.cycle.trim().toLowerCase() !== 'n/a' && plant.cycle.trim() !== '')
    ? plant.cycle.trim()
    : null;

  return (
    <Card className="flex flex-col overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 rounded-lg">
      <CardHeader className="p-0">
        <Link href={linkHref} aria-label={`View details for ${plant.common_name}`}>
          <div className="relative w-full h-48 bg-muted">
            {imageUrl ? (
              <Image
                src={imageUrl}
                alt={`Image of ${plant.common_name}`}
                layout="fill"
                objectFit="cover"
                className="rounded-t-lg"
                data-ai-hint={`${plant.common_name.split(' ')[0] || 'plant'} ${plant.common_name.split(' ').slice(1,2).join('') || 'greenery'}`}
              />
            ) : (
              <div className="flex items-center justify-center h-full w-full">
                <ImageOff className="w-16 h-16 text-muted-foreground" />
              </div>
            )}
          </div>
        </Link>
      </CardHeader>
      <CardContent className="p-4 flex-grow">
        <CardTitle className="text-xl mb-2">
          <Link href={linkHref} className="hover:text-primary transition-colors">
            {plant.common_name}
          </Link>
        </CardTitle>
        <p className="text-sm text-muted-foreground italic mb-3 truncate">
          {Array.isArray(plant.scientific_name) ? plant.scientific_name.join(', ') : plant.scientific_name}
        </p>
        <div className="space-y-2 text-sm">
          <div className="flex items-center gap-2">
            <Sun className="w-4 h-4 text-accent" />
            <span>{sunlightDisplayString}</span>
          </div>
          <div className="flex items-center gap-2">
            <Droplets className="w-4 h-4 text-accent" />
            <span>{wateringDisplayString}</span>
          </div>
        </div>
      </CardContent>
      <CardFooter className="p-4 flex justify-between items-center">
        {cycleDisplayString ? (
            <Badge variant="secondary">{cycleDisplayString}</Badge>
        ) : (
            <span /> // Empty span to maintain layout if cycle is not available
        )}
        <Button variant="outline" size="sm" asChild>
          <Link href={linkHref}>
            Details <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
