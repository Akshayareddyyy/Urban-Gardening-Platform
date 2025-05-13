import { PlantSearch } from '@/components/plant/plant-search';

export default function HomePage() {
  return (
    <section className="w-full">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold tracking-tight text-primary sm:text-5xl lg:text-6xl">
          Discover Your Next Plant
        </h1>
        <p className="mt-4 text-lg leading-8 text-muted-foreground max-w-2xl mx-auto">
          Search our extensive database or get personalized suggestions to find the perfect plants for your urban garden.
        </p>
      </div>
      <PlantSearch />
    </section>
  );
}
