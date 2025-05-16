
'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ArrowRight, Search, Lightbulb, FlaskConical, Users, Leaf, Sparkles, Trees } from 'lucide-react';

const FeatureCard = ({
  icon: Icon,
  title,
  description,
}: {
  icon: React.ElementType;
  title: string;
  description: string;
}) => (
  <Card className="w-full overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 flex flex-col">
    <div className="w-full p-6">
      <div className="flex items-center mb-3">
        <Icon className="h-8 w-8 text-primary mr-3" />
        <CardTitle className="text-2xl text-primary">{title}</CardTitle>
      </div>
      <CardDescription className="text-base text-muted-foreground leading-relaxed">
        {description}
      </CardDescription>
    </div>
  </Card>
);

export function PublicLandingPage() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative py-20 md:py-32 bg-gradient-to-br from-primary/80 via-primary to-green-700 text-primary-foreground rounded-lg shadow-2xl overflow-hidden mb-16">
        {/* Removed background image div */}
        <div className="container mx-auto px-4 text-center relative z-10">
          <Leaf className="mx-auto h-24 w-24 mb-6 text-accent animate-pulse" />
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6 tracking-tight">
            Cultivate Your Urban Oasis
          </h1>
          <p className="text-xl md:text-2xl mb-10 max-w-3xl mx-auto leading-relaxed">
            Discover the perfect plants, get AI-powered guidance, and join a thriving community of city gardeners. Your green thumb starts here!
          </p>
          <Button size="lg" className="text-lg py-3 px-8 bg-accent hover:bg-accent/90 text-accent-foreground shadow-lg transition-transform duration-150 hover:scale-105" asChild>
            <Link href="/signup">
              Start Your Garden Today <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
        </div>
      </section>

      {/* Introduction Section */}
       <section className="py-12 md:py-16">
        <div className="container mx-auto px-4 text-center">
          <Sparkles className="mx-auto h-16 w-16 text-primary mb-4" />
          <h2 className="text-3xl md:text-4xl font-semibold text-primary mb-6">
            Why Choose Urban Gardening Platform?
          </h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            We're passionate about helping city dwellers transform their spaces into vibrant green havens. Our platform provides the tools, knowledge, and community support you need to succeed, no matter the size of your space.
          </p>
        </div>
      </section>


      {/* Features Section */}
      <section className="py-12 md:py-16 bg-secondary/30 rounded-lg mb-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-semibold text-primary text-center mb-12">
            Everything You Need to Grow
          </h2>
          <div className="space-y-10">
            <FeatureCard
              icon={Search}
              title="Discover a World of Plants"
              description="Effortlessly search our extensive database to find detailed information on a vast array of plants suitable for urban environments. Learn about their care, sunlight needs, and more."
            />
            <FeatureCard
              icon={Lightbulb}
              title="AI-Powered Plant Suggestions"
              description="Not sure what to grow? Tell us about your climate and available space, and our intelligent system will suggest the perfect plants tailored to your unique urban setting."
            />
            <FeatureCard
              icon={FlaskConical}
              title="Smart Fertilizer Guidance"
              description="Take the guesswork out of plant nutrition. Get AI-driven recommendations for the best fertilizers based on your plant type and specific growth goals for optimal health."
            />
            <FeatureCard
              icon={Users}
              title="Community Growth Showcase"
              description="Share your urban gardening triumphs, see what others are growing, and get inspired! Our showcase is a vibrant space to connect with fellow plant enthusiasts."
            />
          </div>
        </div>
      </section>

      {/* Final Call to Action */}
      <section className="py-20 md:py-28 bg-primary text-primary-foreground rounded-lg shadow-xl">
        <div className="container mx-auto px-4 text-center">
          <Trees className="mx-auto h-20 w-20 mb-6" />
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Grow Your Urban Jungle?
          </h2>
          <p className="text-xl md:text-2xl mb-10 max-w-2xl mx-auto">
            Join our community of urban gardeners today and unlock all the tools and knowledge to make your green dreams a reality.
          </p>
          <Button variant="secondary" size="lg" className="text-lg py-3 px-8 bg-accent hover:bg-accent/90 text-accent-foreground shadow-lg transition-transform duration-150 hover:scale-105" asChild>
            <Link href="/signup">
              Sign Up for Free <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
        </div>
      </section>
    </div>
  );
}
