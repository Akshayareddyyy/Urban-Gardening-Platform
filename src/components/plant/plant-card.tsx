import Image from 'next/image';
import Link from 'next/link';
import type { PlantSummary } from '@/types/plant';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ArrowRight, Droplets, Sun } from 'lucide-react';

interface PlantCardProps {
  plant: PlantSummary;
}

export function PlantCard({ plant }: PlantCardProps) {
  const placeholderImage = `https://picsum.photos/seed/${plant.id}/400/300`;
  const imageUrl = plant.default_image?.regular_url || plant.default_image?.thumbnail || placeholderImage;

  return (
    <Card className="flex flex-col overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 rounded-lg">
      <CardHeader className="p-0">
        <Link href={`/plants/${plant.id}`} aria-label={`View details for ${plant.common_name}`}>
          <div className="relative w-full h-48">
            <Image
              src={imageUrl}
              alt={`Image of ${plant.common_name}`}
              layout="fill"
              objectFit="cover"
              className="rounded-t-lg"
              data-ai-hint="plant flower"
            />
          </div>
        </Link>
      </CardHeader>
      <CardContent className="p-4 flex-grow">
        <CardTitle className="text-xl mb-2">
          <Link href={`/plants/${plant.id}`} className="hover:text-primary transition-colors">
            {plant.common_name}
          </Link>
        </CardTitle>
        <p className="text-sm text-muted-foreground italic mb-3">
          {Array.isArray(plant.scientific_name) ? plant.scientific_name.join(', ') : plant.scientific_name}
        </p>
        <div className="space-y-2 text-sm">
          <div className="flex items-center gap-2">
            <Sun className="w-4 h-4 text-accent" />
            <span>{Array.isArray(plant.sunlight) ? plant.sunlight.join(', ') : plant.sunlight}</span>
          </div>
          <div className="flex items-center gap-2">
            <Droplets className="w-4 h-4 text-accent" />
            <span>{plant.watering} Watering</span>
          </div>
        </div>
      </CardContent>
      <CardFooter className="p-4 flex justify-between items-center">
        <Badge variant="secondary">{plant.cycle}</Badge>
        <Button variant="outline" size="sm" asChild>
          <Link href={`/plants/${plant.id}`}>
            Details <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
