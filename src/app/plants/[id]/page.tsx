import { getPlantDetails } from '@/lib/plant-api-service';
import { PlantDetailDisplay } from '@/components/plant/plant-detail-display';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ArrowLeft, ServerCrash } from 'lucide-react';
import type { Metadata, ResolvingMetadata } from 'next';

type PlantDetailPageProps = {
  params: { id: string }; // id here is the OpenFarm plant slug
};

export async function generateMetadata(
  { params }: PlantDetailPageProps,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const plantSlug = params.id;
  const plant = await getPlantDetails(plantSlug);
  
  return {
    title: plant ? `${plant.common_name} | Urban Gardening` : 'Plant Details | Urban Gardening',
    description: plant ? `Details about ${plant.common_name}: ${plant.description?.substring(0,150) || 'Learn more about this plant.'}...` : `Discover plant details on the Urban Gardening Platform.`,
  }
}


export default async function PlantDetailPage({ params }: PlantDetailPageProps) {
  const plantSlug = params.id;

  if (!plantSlug) {
    // This case should ideally not be hit if routing is set up correctly.
    return (
      <div className="text-center py-10">
        <Alert variant="destructive" className="max-w-md mx-auto">
           <ServerCrash className="h-5 w-5" />
          <AlertTitle>Error: Invalid Request</AlertTitle>
          <AlertDescription>No plant identifier was provided.</AlertDescription>
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
        <Alert variant="destructive" className="max-w-lg mx-auto">
          <ServerCrash className="h-5 w-5" />
          <AlertTitle>Plant Not Found</AlertTitle>
          <AlertDescription>
            Sorry, we couldn't find details for the plant identified by "{plantSlug}". 
            It might be a rare species, not yet in our OpenFarm database, or there was an issue fetching its information.
          </AlertDescription>
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
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Search Results
          </Link>
        </Button>
      </div>
      <PlantDetailDisplay plant={plant} />
    </div>
  );
}
