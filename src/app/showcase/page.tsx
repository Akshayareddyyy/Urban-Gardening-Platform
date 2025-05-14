
'use client';

import { useState, useRef } from 'react';
import { ShowcaseForm, type ShowcaseFormValues } from '@/components/showcase/showcase-form';
import { ShowcaseList } from '@/components/showcase/showcase-list';
import type { ShowcasePost } from '@/types/showcase';
import { useToast } from "@/hooks/use-toast";
import { v4 as uuidv4 } from 'uuid'; 
import { Users } from 'lucide-react';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';


const initialPosts: ShowcasePost[] = [
  {
    id: uuidv4(),
    plantName: 'Monstera Deliciosa',
    userName: 'Alice G.',
    userAvatarUrl: 'https://placehold.co/64x64.png?text=AG',
    description: 'My Monstera has grown so much in the past 6 months! I followed the sunlight and watering tips from this site, and it just took off. So happy with its progress and new leaves.',
    imagePreviewUrl: 'https://placehold.co/600x400.png',
    submittedAt: new Date(2023, 10, 15),
    dataAiHint: 'monstera plant'
  },
  {
    id: uuidv4(),
    plantName: 'Snake Plant "Laurentii"',
    userName: 'Bob K.',
    userAvatarUrl: 'https://placehold.co/64x64.png?text=BK',
    description: 'This Snake Plant is super resilient. Started from a small pup I found recommended here. It\'s thriving in my office with minimal care.',
    imagePreviewUrl: 'https://placehold.co/600x400.png',
    submittedAt: new Date(2023, 9, 22),
    dataAiHint: 'snake plant'
  },
  {
    id: uuidv4(),
    plantName: 'Basil Garden',
    userName: 'UrbanHerbie',
    userAvatarUrl: 'https://placehold.co/64x64.png?text=UH',
    description: 'Used the suggestions for my sunny balcony and now I have a thriving basil garden! Fresh pesto all summer long. Thanks for the tips!',
    imagePreviewUrl: 'https://placehold.co/600x400.png',
    submittedAt: new Date(2024, 0, 5),
    dataAiHint: 'basil garden'
  },
];

export default function ShowcasePage() {
  const [posts, setPosts] = useState<ShowcasePost[]>(initialPosts);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const formRef = useRef<{ reset: () => void }>(null);

  const handleAddShowcasePost = async (data: ShowcaseFormValues, imageFile: File) => {
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1000)); 

    const reader = new FileReader();
    reader.onloadend = () => {
      const newPost: ShowcasePost = {
        id: uuidv4(),
        plantName: data.plantName,
        userName: data.userName,
        userAvatarUrl: `https://placehold.co/64x64.png?text=${data.userName.substring(0,2).toUpperCase()}`, 
        description: data.description,
        imagePreviewUrl: reader.result as string,
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

        <ShowcaseForm 
          ref={formRef}
          onSubmit={handleAddShowcasePost} 
          isLoading={isLoading} 
        />

        <div className="mt-16">
          <h2 className="text-3xl font-semibold text-center text-primary mb-10">
            Our Community's Green Gallery
          </h2>
          <ShowcaseList posts={posts} />
        </div>
      </section>
    </ProtectedRoute>
  );
}
