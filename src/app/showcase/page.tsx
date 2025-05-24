
'use client';

import { useState, useRef } from 'react';
import { ShowcaseForm, type ShowcaseFormValues } from '@/components/showcase/showcase-form';
import { ShowcaseList } from '@/components/showcase/showcase-list';
import type { ShowcasePost } from '@/types/showcase';
import { useToast } from "@/hooks/use-toast";
import { v4 as uuidv4 } from 'uuid'; 
import { Users, Leaf } from 'lucide-react';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';

const initialPosts: ShowcasePost[] = [
  // Initial posts are removed, showcase starts empty
];

export default function ShowcasePage() {
  const [posts, setPosts] = useState<ShowcasePost[]>(initialPosts);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const formRef = useRef<{ reset: () => void }>(null);

  const handleAddShowcasePost = async (data: ShowcaseFormValues, imageFile: File) => {
    setIsLoading(true);
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000)); 

    const reader = new FileReader();
    reader.onloadend = () => {
      const newPost: ShowcasePost = {
        id: uuidv4(),
        plantName: data.plantName,
        userName: data.userName,
        userAvatarUrl: `https://placehold.co/64x64.png?text=${data.userName.substring(0,2).toUpperCase()}`, 
        description: data.description,
        imagePreviewUrl: reader.result as string, // This will be a data URI
        submittedAt: new Date(),
        dataAiHint: `${data.plantName.split(" ")[0]} user project` 
      };
      setPosts(prevPosts => [newPost, ...prevPosts]);
      setIsLoading(false);
      toast({
        title: "Showcase Submitted!",
        description: "Thank you for sharing your plant's success story.",
      });
      if (formRef.current) {
        formRef.current.reset();
      }
    };
    reader.onerror = () => {
      setIsLoading(false);
      toast({
        variant: "destructive",
        title: "Image Processing Error",
        description: "Could not process the uploaded image. Please try again.",
      });
    };
    reader.readAsDataURL(imageFile);
  };

  return (
    <ProtectedRoute>
      <section className="w-full space-y-12">
        <div className="text-center">
          <Users className="mx-auto h-16 w-16 text-primary opacity-80 mb-4" />
          <h1 className="text-4xl font-bold tracking-tight text-primary sm:text-5xl lg:text-6xl">
            Plant Growth Showcase
          </h1>
          <p className="mt-4 text-lg leading-8 text-muted-foreground max-w-2xl mx-auto">
            See how others are succeeding with their urban gardens and share your own triumphs! 
            Upload a photo and tell us about your plant's journey.
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-10 lg:gap-12">
          {/* Left Column: Form */}
          <aside className="lg:w-1/3 lg:sticky lg:top-24 self-start h-fit space-y-6"> {/* Added self-start for sticky behavior */}
            <div className="p-6 bg-card rounded-lg shadow-lg border">
              <h2 className="text-2xl font-semibold text-primary mb-1 flex items-center">
                <Leaf className="h-6 w-6 mr-2 text-accent" />
                Share Your Green Success!
              </h2>
              <p className="text-sm text-muted-foreground mb-6">
                Inspire others by showcasing your plant's progress.
              </p>
              <ShowcaseForm 
                ref={formRef}
                onSubmit={handleAddShowcasePost} 
                isLoading={isLoading} 
              />
            </div>
          </aside>

          {/* Right Column: List */}
          <main className="lg:w-2/3">
            <h2 className="text-3xl font-semibold text-primary mb-10 text-center lg:text-left">
              Our Community's Green Gallery
            </h2>
            <ShowcaseList posts={posts} />
          </main>
        </div>
      </section>
    </ProtectedRoute>
  );
}
