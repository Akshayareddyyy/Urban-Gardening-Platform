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
  // plant.id is now a number from Perenual API, convert to string for URL
  const linkHref = `/plants/${String(plant.id)}`; 

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
          {plant.sunlight && (Array.isArray(plant.sunlight) ? plant.sunlight.join('') : plant.sunlight).toLowerCase() !== 'n/a' && (
            <div className="flex items-center gap-2">
              <Sun className="w-4 h-4 text-accent" />
              <span>{Array.isArray(plant.sunlight) ? plant.sunlight.join(', ') : plant.sunlight}</span>
            </div>
          )}
          {plant.watering && plant.watering.toLowerCase() !== 'n/a' && (
             <div className="flex items-center gap-2">
              <Droplets className="w-4 h-4 text-accent" />
              <span>{plant.watering}</span>
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter className="p-4 flex justify-between items-center">
        <Badge variant="secondary">{plant.cycle}</Badge>
        <Button variant="outline" size="sm" asChild>
          <Link href={linkHref}>
            Details <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
