import Image from 'next/image';
import type { Plant } from '@/types/plant';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Sun, Droplets, Leaf, CalendarDays, TrendingUp, Settings2, Info } from 'lucide-react';

interface PlantDetailDisplayProps {
  plant: Plant;
}

const DetailItem: React.FC<{ icon: React.ElementType; label: string; value?: string | string[] | null; children?: React.ReactNode }> = ({ icon: Icon, label, value, children }) => {
  if (!value && !children && (typeof value !== 'string' || value.toLowerCase() === 'n/a')) return null;
  const displayValue = value === null || value === undefined || (typeof value === 'string' && value.trim() === '') || (typeof value === 'string' && value.toLowerCase() === 'n/a') ? 'N/A' : value;

  return (
    <div className="flex items-start space-x-3">
      <Icon className="h-6 w-6 text-accent mt-1 shrink-0" />
      <div>
        <h3 className="text-md font-semibold text-foreground">{label}</h3>
        {displayValue && <p className="text-muted-foreground text-sm">{Array.isArray(displayValue) ? displayValue.join(', ') : displayValue}</p>}
        {children}
      </div>
    </div>
  );
};


export function PlantDetailDisplay({ plant }: PlantDetailDisplayProps) {
  // plant.id is the slug
  const placeholderImage = `https://picsum.photos/seed/${plant.id}/800/600`;
  const imageUrl = plant.default_image?.imageDataUri || plant.default_image?.original_url || plant.default_image?.regular_url || placeholderImage;

  return (
    <Card className="overflow-hidden shadow-xl">
      <CardHeader className="p-0 relative">
        <div className="w-full h-64 md:h-96 relative">
          <Image
            src={imageUrl}
            alt={`Image of ${plant.common_name}`}
            layout="fill"
            objectFit="cover"
            priority
            data-ai-hint={`${plant.common_name.split(' ')[0] || 'plant'} ${plant.common_name.split(' ').slice(1,2).join('') || 'detail'}`}
            unoptimized={!!plant.default_image?.imageDataUri} // Data URIs don't need optimization
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
        </div>
        <div className="absolute bottom-0 left-0 p-6 md:p-8">
            <CardTitle className="text-3xl md:text-4xl font-bold text-primary-foreground drop-shadow-md">{plant.common_name}</CardTitle>
            {plant.scientific_name && plant.scientific_name.length > 0 && (
              <CardDescription className="text-lg text-primary-foreground/90 italic mt-1 drop-shadow-sm">
                {plant.scientific_name.join(', ')}
              </CardDescription>
            )}
        </div>
      </CardHeader>
      <CardContent className="p-6 md:p-8 space-y-6">
        {plant.description && (
          <>
            <DetailItem icon={Info} label="Description" value={plant.description} />
            <Separator />
          </>
        )}
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
          <DetailItem icon={Leaf} label="Type" value={plant.type} />
          <DetailItem icon={Sun} label="Sunlight" value={plant.sunlight} />
          <DetailItem icon={Droplets} label="Watering" value={plant.watering} />
          <DetailItem icon={CalendarDays} label="Cycle" value={plant.cycle} />
          <DetailItem icon={Settings2} label="Care Level" value={plant.care_level} />
          <DetailItem icon={TrendingUp} label="Growth Rate" value={plant.growth_rate} />
          {/* Add other relevant fields from the simplified Plant type as needed */}
        </div>

        {plant.other_name && plant.other_name.length > 0 && (
          <>
            <Separator />
            <div>
              <h3 className="text-lg font-semibold text-foreground mb-2">Other Names</h3>
              <div className="flex flex-wrap gap-2">
                {plant.other_name.map(name => <Badge key={name} variant="outline">{name}</Badge>)}
              </div>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
