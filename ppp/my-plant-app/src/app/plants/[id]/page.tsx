
import { getPlantDetails } from '@/lib/plant-api-service';
import { PlantDetailDisplay } from '@/components/plant/plant-detail-display';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ArrowLeft, ServerCrash, HelpCircle } from 'lucide-react';
import type { Metadata, ResolvingMetadata } from 'next';

type PlantDetailPageProps = {
  params: { id: string }; // The `id` property itself might be thenable/awaitable
};

// Required for static export of dynamic routes if output: 'export' is used,
// but not strictly necessary for dynamic rendering. Kept for completeness.
export async function generateStaticParams() {
  return [];
}

export async function generateMetadata(
  { params }: PlantDetailPageProps,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const plantIdStr = await params.id; // Await access to the id property
  const plantId = parseInt(plantIdStr, 10);
  
  if (isNaN(plantId)) {
    return {
      title: 'Invalid Plant ID | Urban Gardening',
      description: 'The plant ID provided is not valid.',
    }
  }

  try {
    const plant = await getPlantDetails(plantId);
    if (!plant) {
      return {
        title: `Plant Details Not Found | Urban Gardening`,
        description: `Details for plant ID ${plantIdStr} could not be loaded or the plant was not found.`,
      };
    }
    return {
      title: `${plant.common_name} | Urban Gardening`,
      description: `Details about ${plant.common_name}: ${plant.description?.substring(0,150) || 'Learn more about this plant.'}...`,
    }
  } catch (error) {
    console.error(`Error generating metadata for plant ID ${plantIdStr}:`, error);
    return {
      title: 'Error Loading Plant Info | Urban Gardening',
      description: 'There was an error while trying to load plant information for metadata. Please try again later.',
    }
  }
}


export default async function PlantDetailPage({ params }: PlantDetailPageProps) {
  let plant = null;
  let fetchError = null;
  let plantIdStrParam: string | undefined;

  try {
    plantIdStrParam = await params.id; // Await access to the id property

    if (!plantIdStrParam) {
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

    const plantId = parseInt(plantIdStrParam, 10);

    if (isNaN(plantId)) {
      return (
        <div className="text-center py-10">
          <Alert variant="destructive" className="max-w-md mx-auto">
            <HelpCircle className="h-5 w-5" />
            <AlertTitle>Error: Invalid Plant ID</AlertTitle>
            <AlertDescription>The plant ID "{plantIdStrParam}" is not a valid format.</AlertDescription>
          </Alert>
          <Button asChild variant="link" className="mt-4">
            <Link href="/">
              <ArrowLeft className="mr-2 h-4 w-4" /> Back to Search
            </Link>
          </Button>
        </div>
      );
    }

    plant = await getPlantDetails(plantId);
    console.log(`PlantDetailPage: Fetched plant data for ID ${plantId}:`, JSON.stringify(plant, null, 2)); // ADDED THIS LOG

  } catch (error: any) {
    console.error(`SERVER_LOG: Error fetching plant details in PlantDetailPage for ID ${plantIdStrParam || 'unknown'}:`, error);
    fetchError = error.message || "An unknown error occurred during data fetching.";
    // Log more detailed error for server debugging
    let detailedLogMessage = `SERVER_LOG: Detailed error object for plant ID ${plantIdStrParam || 'unknown'}:\n`;
    if (error.name) detailedLogMessage += `  Name: ${error.name}\n`;
    if (error.message) detailedLogMessage += `  Message: ${error.message}\n`;
    if (error.stack) detailedLogMessage += `  Stack: ${error.stack.substring(0, 500)}...\n`;
    console.error(detailedLogMessage);
  }

  if (fetchError || !plant) {
    return (
      <div className="text-center py-10">
        <Alert variant="destructive" className="max-w-lg mx-auto">
          <ServerCrash className="h-5 w-5" />
          <AlertTitle>Plant Not Found or Error Loading Details</AlertTitle>
          <AlertDescription>
            Sorry, we couldn't find or load details for plant ID "{plantIdStrParam || params.id}". 
            It might be a rare species, not in our database, or there was an issue fetching its information.
            Please ensure your Perenual API key is correctly configured if this issue persists.
            {fetchError && <p className="mt-2">Details: {fetchError}. Check server logs for more information.</p>}
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
