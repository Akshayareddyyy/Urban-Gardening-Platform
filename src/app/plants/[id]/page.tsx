import { getPlantDetails } from '@/lib/perenual-api';
import { PlantDetailDisplay } from '@/components/plant/plant-detail-display';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import type { Metadata, ResolvingMetadata } from 'next';

type PlantDetailPageProps = {
  params: { id: string };
};

export async function generateMetadata(
  { params }: PlantDetailPageProps,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const id = parseInt(params.id);
  if (isNaN(id)) {
    return { title: 'Plant Not Found' };
  }
  const plant = await getPlantDetails(id);
  
  return {
    title: plant ? `${plant.common_name} | Urban Gardening` : 'Plant Not Found',
    description: plant ? `Details about ${plant.common_name}: ${plant.description?.substring(0,150) || ''}...` : 'Could not find details for this plant.',
  }
}


export default async function PlantDetailPage({ params }: PlantDetailPageProps) {
  const id = parseInt(params.id);

  if (isNaN(id)) {
    return (
      <div className="text-center py-10">
        <Alert variant="destructive" className="max-w-md mx-auto">
          <AlertTitle>Invalid Plant ID</AlertTitle>
          <AlertDescription>The plant ID provided is not valid.</AlertDescription>
        </Alert>
        <Button asChild variant="link" className="mt-4">
          <Link href="/">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Search
          </Link>
        </Button>
      </div>
    );
  }

  const plant = await getPlantDetails(id);

  if (!plant) {
    return (
      <div className="text-center py-10">
        <Alert variant="destructive" className="max-w-md mx-auto">
          <AlertTitle>Plant Not Found</AlertTitle>
          <AlertDescription>Sorry, we couldn't find details for this plant.</AlertDescription>
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
