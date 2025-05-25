
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
  let displayValue: string | React.ReactNode = 'N/A'; // Default to 'N/A'

  if (children) {
    displayValue = children;
  } else if (value !== null && value !== undefined) {
    if (Array.isArray(value)) {
      const filteredArray = value.map(s => String(s).trim()).filter(s => s && s.toLowerCase() !== 'n/a' && s !== '');
      if (filteredArray.length > 0) {
        displayValue = filteredArray.join(', ');
      }
    } else if (typeof value === 'boolean') {
      displayValue = value ? 'Yes' : 'No';
    } else if (String(value).trim() !== '' && String(value).toLowerCase() !== 'n/a') {
      displayValue = String(value);
    }
  }

  return (
    <div className="flex items-start space-x-3">
      <Icon className="h-6 w-6 text-accent mt-1 shrink-0" />
      <div>
        <h3 className="text-md font-semibold text-foreground">{label}</h3>
        {typeof displayValue === 'string' ? (
          <p className="text-muted-foreground text-sm whitespace-pre-wrap">{displayValue}</p>
        ) : (
          displayValue 
        )}
      </div>
    </div>
  );
};


export function PlantDetailDisplay({ plant }: PlantDetailDisplayProps) {
  console.log("PlantDetailDisplay received plant prop:", JSON.stringify(plant, null, 2));

  const imageUrl = plant.default_image?.medium_url || plant.default_image?.regular_url || plant.default_image?.original_url;

  const hasMeaningfulDescription = plant.description && plant.description.trim() !== '' && plant.description.toLowerCase() !== 'n/a';
  
  // Filter out empty or "n/a" scientific names
  const validScientificNames = Array.isArray(plant.scientific_name) 
    ? plant.scientific_name.map(name => String(name).trim()).filter(name => name && name.toLowerCase() !== 'n/a') 
    : [];
  
  // Filter out empty or "n/a" other names
  const validOtherNames = Array.isArray(plant.other_name)
    ? plant.other_name.map(name => String(name).trim()).filter(name => name && name.toLowerCase() !== 'n/a')
    : [];

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
            {validScientificNames.length > 0 ? (
              <CardDescription className="text-lg text-primary-foreground/90 italic mt-1 drop-shadow-sm">
                {validScientificNames.join(', ')}
              </CardDescription>
            ) : null}
        </div>
      </CardHeader>
      <CardContent className="p-6 md:p-8 space-y-6">
        
        <DetailItem icon={Info} label="Description" value={plant.description} />
        
        {hasMeaningfulDescription && <Separator />}
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
          <DetailItem icon={Leaf} label="Type" value={plant.type} />
          <DetailItem icon={Sun} label="Sunlight" value={plant.sunlight} />
          <DetailItem icon={Droplets} label="Watering" value={plant.watering} />
          
          <DetailItem 
            icon={Droplets} 
            label="Watering Benchmark" 
            value={(plant.watering_general_benchmark?.value && plant.watering_general_benchmark.unit && String(plant.watering_general_benchmark.value).toLowerCase() !== 'n/a') 
                    ? `${plant.watering_general_benchmark.value} ${plant.watering_general_benchmark.unit}` 
                    : "N/A"} 
          />

          <DetailItem icon={CalendarDays} label="Cycle" value={plant.cycle} />
          <DetailItem icon={Settings2} label="Care Level" value={plant.care_level} />
          <DetailItem icon={TrendingUp} label="Growth Rate" value={plant.growth_rate} />
          
          <DetailItem 
            icon={Thermometer} 
            label="Hardiness Zones" 
            value={(plant.hardiness?.min && plant.hardiness?.max && String(plant.hardiness.min).toLowerCase() !== 'n/a') 
                    ? `${plant.hardiness.min} - ${plant.hardiness.max}` 
                    : "N/A"} 
          />
          
          <DetailItem 
            icon={Milestone} 
            label={`Dimensions (${plant.dimensions?.type || 'Height'})`} 
            value={(plant.dimensions?.min_value && plant.dimensions?.max_value && plant.dimensions?.unit) 
                    ? `${plant.dimensions.min_value}-${plant.dimensions.max_value} ${plant.dimensions.unit}` 
                    : "N/A"} 
          />

          <DetailItem icon={Scissors} label="Maintenance" value={plant.maintenance} />
          <DetailItem icon={ShieldCheck} label="Drought Tolerant" value={plant.drought_tolerant} />
          <DetailItem icon={ShieldAlert} label="Poisonous to Humans" value={plant.poisonous_to_humans === 1 ? "Yes" : (plant.poisonous_to_humans === 0 ? "No" : "N/A") } />
          <DetailItem icon={ShieldAlert} label="Poisonous to Pets" value={plant.poisonous_to_pets === 1 ? "Yes" : (plant.poisonous_to_pets === 0 ? "No" : "N/A") } />
          <DetailItem icon={Info} label="Indoor Plant" value={plant.indoor} />
        </div>

        {validOtherNames.length > 0 && (
          <>
            <Separator />
            <div>
              <h3 className="text-lg font-semibold text-foreground mb-2">Other Names</h3>
              <div className="flex flex-wrap gap-2">
                {validOtherNames.map(name => <Badge key={name} variant="outline">{name}</Badge>)}
              </div>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}

    