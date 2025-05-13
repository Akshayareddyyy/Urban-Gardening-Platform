import { getPlantDetails } from '@/lib/plant-api-service';
import { PlantDetailDisplay } from '@/components/plant/plant-detail-display';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import type { Metadata, ResolvingMetadata } from 'next';

type PlantDetailPageProps = {
  params: { id: string }; // id here is the plant's slugified common_name
};

export async function generateMetadata(
  { params }: PlantDetailPageProps,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const plantSlug = params.id;
  // The slug itself might not be enough for a good metadata title if it's too generic.
  // We fetch details to get the common name.
  const plant = await getPlantDetails(plantSlug);
  
  return {
    title: plant ? `${plant.common_name} | Urban Gardening` : 'Plant Not Found',
    description: plant ? `Details about ${plant.common_name}: ${plant.description?.substring(0,150) || ''}...` : `Could not find details for plant: ${plantSlug}.`,
  }
}


export default async function PlantDetailPage({ params }: PlantDetailPageProps) {
  const plantSlug = params.id;

  if (!plantSlug) {
    return (
      <div className="text-center py-10">
        <Alert variant="destructive" className="max-w-md mx-auto">
          <AlertTitle>Invalid Plant Identifier</AlertTitle>
          <AlertDescription>The plant identifier provided is not valid.</AlertDescription>
        </Alert>
        <Button asChild variant="link" className="mt-4">
          <Link href="/">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Search
          </Link>
        </Button>
      </div>
    );
  }

  const plant = await getPlantDetails(plantSlug);

  if (!plant) {
    return (
      <div className="text-center py-10">
        <Alert variant="destructive" className="max-w-md mx-auto">
          <AlertTitle>Plant Not Found</AlertTitle>
          <AlertDescription>Sorry, we couldn't find details for "{plantSlug.replace(/-/g, ' ')}". It might be a rare species or there was an issue fetching its information.</AlertDescription>
        </Alert>
         <Button asChild variant="link" className="mt-4">
          <Link href="/">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Search
          </Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <Button asChild variant="outline" size="sm">
          <Link href="/">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Search
          </Link>
        </Button>
      </div>
      <PlantDetailDisplay plant={plant} />
    </div>
  );
}
