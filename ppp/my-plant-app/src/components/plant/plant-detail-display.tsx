
import Image from 'next/image';
import type { Plant } from '@/types/plant';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Sun, Droplets, Leaf, CalendarDays, TrendingUp, Settings2, Info, ImageOff, Thermometer, ShieldCheck, ShieldAlert, Milestone, Scissors } from 'lucide-react';

interface PlantDetailDisplayProps {
  plant: Plant;
}

const DetailItem: React.FC<{ icon: React.ElementType; label: string; value?: string | string[] | null | number | boolean; children?: React.ReactNode }> = ({ icon: Icon, label, value, children }) => {
  let displayValue: string;

  if (children) {
    // If children are provided, they handle rendering the value.
    // We don't need to calculate displayValue for the <p> tag in this case,
    // but we still render the label and icon.
    displayValue = ''; // Set to empty as children will render the value part
  } else if (value === null || value === undefined || (typeof value === 'string' && value.trim() === '')) {
    displayValue = 'N/A';
  } else if (typeof value === 'boolean') {
    displayValue = value ? 'Yes' : 'No';
  } else if (Array.isArray(value)) {
    // Filter out empty or "N/A" strings from array before joining
    const filteredArray = value.filter(item => typeof item === 'string' && item.trim() !== '' && item.toLowerCase() !== 'n/a');
    displayValue = filteredArray.length > 0 ? filteredArray.join(', ') : 'N/A';
  } else if (typeof value === 'string' && value.toLowerCase() === 'n/a') {
    displayValue = 'N/A';
  } else {
    displayValue = String(value);
  }

  return (
    <div className="flex items-start space-x-3">
      <Icon className="h-6 w-6 text-accent mt-1 shrink-0" />
      <div>
        <h3 className="text-md font-semibold text-foreground">{label}</h3>
        {children ? (
          children
        ) : (
          <p className="text-muted-foreground text-sm whitespace-pre-wrap">{displayValue}</p>
        )}
      </div>
    </div>
  );
};


export function PlantDetailDisplay({ plant }: PlantDetailDisplayProps) {
  const imageUrl = plant.default_image?.medium_url || plant.default_image?.regular_url || plant.default_image?.original_url;

  return (
    <Card className="overflow-hidden shadow-xl">
      <CardHeader className="p-0 relative">
        <div className="w-full h-64 md:h-96 relative bg-muted">
          {imageUrl ? (
            <Image
              src={imageUrl}
              alt={`Image of ${plant.common_name}`}
              layout="fill"
              objectFit="cover"
              priority
              data-ai-hint={`${plant.common_name.split(' ')[0] || 'plant'} ${plant.common_name.split(' ').slice(1,2).join('') || 'detail'}`}
            />
          ) : (
            <div className="flex items-center justify-center h-full w-full">
              <ImageOff className="w-24 h-24 text-muted-foreground" />
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
        </div>
        <div className="absolute bottom-0 left-0 p-6 md:p-8">
            <CardTitle className="text-3xl md:text-4xl font-bold text-primary-foreground drop-shadow-md">{plant.common_name}</CardTitle>
            {plant.scientific_name && plant.scientific_name.length > 0 && plant.scientific_name.some(name => name.trim().toLowerCase() !== 'n/a' && name.trim() !== '') && (
              <CardDescription className="text-lg text-primary-foreground/90 italic mt-1 drop-shadow-sm">
                {plant.scientific_name.filter(name => name.trim().toLowerCase() !== 'n/a' && name.trim() !== '').join(', ')}
              </CardDescription>
            )}
        </div>
      </CardHeader>
      <CardContent className="p-6 md:p-8 space-y-6">
        {plant.description && plant.description.trim() !== '' && plant.description.toLowerCase() !== 'n/a' && (
          <>
            <DetailItem icon={Info} label="Description" value={plant.description} />
            <Separator />
          </>
        )}
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
          <DetailItem icon={Leaf} label="Type" value={plant.type} />
          <DetailItem icon={Sun} label="Sunlight" value={plant.sunlight} />
          <DetailItem icon={Droplets} label="Watering" value={plant.watering} />
          {(plant.watering_general_benchmark?.value && plant.watering_general_benchmark.unit && plant.watering_general_benchmark.value.toLowerCase() !== 'n/a') ? (
            <DetailItem icon={Droplets} label="Watering Benchmark" value={`${plant.watering_general_benchmark.value} ${plant.watering_general_benchmark.unit}`} />
          ) : (
            <DetailItem icon={Droplets} label="Watering Benchmark" value="N/A" />
          )}
          <DetailItem icon={CalendarDays} label="Cycle" value={plant.cycle} />
          <DetailItem icon={Settings2} label="Care Level" value={plant.care_level} />
          <DetailItem icon={TrendingUp} label="Growth Rate" value={plant.growth_rate} />
          {(plant.hardiness?.min && plant.hardiness?.max && plant.hardiness.min.toLowerCase() !== 'n/a') ? ( 
            <DetailItem icon={Thermometer} label="Hardiness Zones" value={`${plant.hardiness.min} - ${plant.hardiness.max}`} />
          ) : (
             <DetailItem icon={Thermometer} label="Hardiness Zones" value="N/A" />
          )}
          {(plant.dimensions?.min_value && plant.dimensions?.max_value && plant.dimensions?.unit) ? (
             <DetailItem icon={Milestone} label={`Dimensions (${plant.dimensions.type || 'Height'})`} value={`${plant.dimensions.min_value}-${plant.dimensions.max_value} ${plant.dimensions.unit}`} />
          ) : (
             <DetailItem icon={Milestone} label={`Dimensions (${plant.dimensions?.type || 'Height'})`} value="N/A" />
          )}
          <DetailItem icon={Scissors} label="Maintenance" value={plant.maintenance} />
          <DetailItem icon={ShieldCheck} label="Drought Tolerant" value={plant.drought_tolerant} />
          <DetailItem icon={ShieldAlert} label="Poisonous to Humans" value={plant.poisonous_to_humans === 1 ? "Yes" : (plant.poisonous_to_humans === 0 ? "No" : "N/A") } />
          <DetailItem icon={ShieldAlert} label="Poisonous to Pets" value={plant.poisonous_to_pets === 1 ? "Yes" : (plant.poisonous_to_pets === 0 ? "No" : "N/A") } />
           <DetailItem icon={Info} label="Indoor Plant" value={plant.indoor} />
        </div>

        {plant.other_name && plant.other_name.length > 0 && plant.other_name.some(name => name.trim() !== '' && name.toLowerCase() !== 'n/a') && (
          <>
            <Separator />
            <div>
              <h3 className="text-lg font-semibold text-foreground mb-2">Other Names</h3>
              <div className="flex flex-wrap gap-2">
                {plant.other_name.filter(name => name.trim() !== '' && name.toLowerCase() !== 'n/a').map(name => <Badge key={name} variant="outline">{name}</Badge>)}
              </div>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
