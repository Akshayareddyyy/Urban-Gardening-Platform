import Image from 'next/image';
import type { Plant } from '@/types/plant';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Sun, Droplets, Thermometer, Leaf, CalendarDays, Wind, Users, Settings, TriangleAlert } from 'lucide-react'; // Using Layers as a generic soil icon

interface PlantDetailDisplayProps {
  plant: Plant;
}

const DetailItem: React.FC<{ icon: React.ElementType; label: string; value?: string | string[] | null; children?: React.ReactNode }> = ({ icon: Icon, label, value, children }) => {
  if (!value && !children) return null;
  return (
    <div className="flex items-start space-x-3">
      <Icon className="h-6 w-6 text-accent mt-1 shrink-0" />
      <div>
        <h3 className="text-md font-semibold text-foreground">{label}</h3>
        {value && <p className="text-muted-foreground text-sm">{Array.isArray(value) ? value.join(', ') : value}</p>}
        {children}
      </div>
    </div>
  );
};


export function PlantDetailDisplay({ plant }: PlantDetailDisplayProps) {
  const placeholderImage = `https://picsum.photos/seed/${plant.id}/800/600`;
  const imageUrl = plant.default_image?.original_url || plant.default_image?.regular_url || placeholderImage;

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
            data-ai-hint="plant detail"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
        </div>
        <div className="absolute bottom-0 left-0 p-6 md:p-8">
            <CardTitle className="text-3xl md:text-4xl font-bold text-primary-foreground drop-shadow-md">{plant.common_name}</CardTitle>
            <CardDescription className="text-lg text-primary-foreground/90 italic mt-1 drop-shadow-sm">
              {plant.scientific_name.join(', ')}
            </CardDescription>
        </div>
      </CardHeader>
      <CardContent className="p-6 md:p-8 space-y-6">
        {plant.description && (
          <>
            <p className="text-base leading-relaxed text-foreground/90">{plant.description}</p>
            <Separator />
          </>
        )}
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
          <DetailItem icon={Leaf} label="Type" value={plant.type || 'N/A'} />
          <DetailItem icon={Sun} label="Sunlight" value={plant.sunlight} />
          <DetailItem icon={Droplets} label="Watering" value={plant.watering} />
          <DetailItem icon={Thermometer} label="Hardiness Zone" value={plant.hardiness ? `${plant.hardiness.min} - ${plant.hardiness.max}`: 'Varies'} />
          <DetailItem icon={Wind} label="Soil" value={plant.soil || ['Varies']} /> {/* Using Wind as a stand-in for Layers/Soil */}
          <DetailItem icon={CalendarDays} label="Cycle" value={plant.cycle} />
          {plant.flower_season && <DetailItem icon={CalendarDays} label="Flowering Season" value={plant.flower_season} />}
          {plant.fruiting_season && <DetailItem icon={CalendarDays} label="Fruiting Season" value={plant.fruiting_season} />}
          {plant.care_level && <DetailItem icon={Settings} label="Care Level" value={plant.care_level} />}
          {plant.growth_rate && <DetailItem icon={Users} label="Growth Rate" value={plant.growth_rate} />}
          {plant.maintenance && <DetailItem icon={Settings} label="Maintenance" value={plant.maintenance} />}
          {plant.dimension && <DetailItem icon={Leaf} label="Dimensions" value={plant.dimension} />}
          {plant.propagation && plant.propagation.length > 0 && <DetailItem icon={SproutIcon} label="Propagation Methods" value={plant.propagation} />}
          {plant.problem && <DetailItem icon={TriangleAlert} label="Common Problems" value={plant.problem} />}

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

// Placeholder SproutIcon if not already defined elsewhere
const SproutIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M7 20h10"/>
    <path d="M10 20c0-4.42-2.69-8-6-8"/>
    <path d="M14 20c0-4.42 2.69-8 6-8"/>
    <path d="M12 17a4.002 4.002 0 0 0 4-4c0-3.31-2.69-6-6-6S6 6.69 6 10c0 .9.19 1.74.52 2.5"/>
    <path d="M8.52 2.5A4.002 4.002 0 0 1 12 6"/>
  </svg>
);

