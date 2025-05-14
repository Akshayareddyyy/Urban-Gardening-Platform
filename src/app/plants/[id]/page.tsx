import { getPlantDetails } from '@/lib/plant-api-service';
import { PlantDetailDisplay } from '@/components/plant/plant-detail-display';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ArrowLeft, ServerCrash, HelpCircle } from 'lucide-react';
import type { Metadata, ResolvingMetadata } from 'next';

type PlantDetailPageProps = {
  params: { id: string }; // id from URL is a string
};

// Required for static export of dynamic routes
export async function generateStaticParams() {
  // In a real scenario with static export, you'd fetch a list of all plant IDs
  // to pre-render. For now, returning an empty array means no plant detail pages
  // will be pre-built. Accessing them directly might lead to 404s or client-side rendering
  // which won't work for data fetching if it relies on server actions.
  return [];
}

export async function generateMetadata(
  { params }: PlantDetailPageProps,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const plantId = parseInt(params.id, 10);
  
  if (isNaN(plantId)) {
    return {
      title: 'Invalid Plant ID | Urban Gardening',
      description: 'The plant ID provided is not valid.',
    }
  }

  const plant = await getPlantDetails(plantId);
  
  return {
    title: plant ? `${plant.common_name} | Urban Gardening` : 'Plant Details | Urban Gardening',
    description: plant ? `Details about ${plant.common_name}: ${plant.description?.substring(0,150) || 'Learn more about this plant.'}...` : `Discover plant details on the Urban Gardening Platform.`,
  }
}


export default async function PlantDetailPage({ params }: PlantDetailPageProps) {
  const plantIdStr = params.id;

  if (!plantIdStr) {
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

  const plantId = parseInt(plantIdStr, 10);

  if (isNaN(plantId)) {
     return (
      <div className="text-center py-10">
        <Alert variant="destructive" className="max-w-md mx-auto">
           <HelpCircle className="h-5 w-5" />
          <AlertTitle>Error: Invalid Plant ID</AlertTitle>
          <AlertDescription>The plant ID "{plantIdStr}" is not a valid format.</AlertDescription>
        </Alert>
        <Button asChild variant="link" className="mt-4">
          <Link href="/">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Search
          </Link>
        </Button>
      </div>
    );
  }

  const plant = await getPlantDetails(plantId);

  if (!plant) {
    return (
      <div className="text-center py-10">
        <Alert variant="destructive" className="max-w-lg mx-auto">
          <ServerCrash className="h-5 w-5" />
          <AlertTitle>Plant Not Found</AlertTitle>
          <AlertDescription>
            Sorry, we couldn't find details for the plant ID "{plantIdStr}". 
            It might be a rare species, not in our database, or there was an issue fetching its information.
            Please ensure your Perenual API key is correctly configured if this issue persists.
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
