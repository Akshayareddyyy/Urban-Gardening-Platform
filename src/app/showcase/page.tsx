
'use client';

import { useState, useRef } from 'react';
import { ShowcaseForm, type ShowcaseFormValues } from '@/components/showcase/showcase-form';
import { ShowcaseList } from '@/components/showcase/showcase-list';
import type { ShowcasePost } from '@/types/showcase';
import { useToast } from "@/hooks/use-toast";
import { v4 as uuidv4 } from 'uuid'; // For generating unique IDs

// Mock data for initial display
const initialPosts: ShowcasePost[] = [
  {
    id: uuidv4(),
    plantName: 'Monstera Deliciosa',
    userName: 'Alice G.',
    description: 'My Monstera has grown so much in the past 6 months! I followed the sunlight and watering tips from this site, and it just took off. So happy with its progress and new leaves.',
    imagePreviewUrl: 'https://picsum.photos/seed/monsteraGrowth/600/400',
    submittedAt: new Date(2023, 10, 15),
  },
  {
    id: uuidv4(),
    plantName: 'Snake Plant "Laurentii"',
    userName: 'Bob K.',
    description: 'This Snake Plant is super resilient. Started from a small pup I found recommended here. It\'s thriving in my office with minimal care.',
    imagePreviewUrl: 'https://picsum.photos/seed/snakePlantOffice/600/400',
    submittedAt: new Date(2023, 9, 22),
  },
  {
    id: uuidv4(),
    plantName: 'Basil Garden',
    userName: 'UrbanHerbie',
    description: 'Used the suggestions for my sunny balcony and now I have a thriving basil garden! Fresh pesto all summer long. Thanks for the tips!',
    imagePreviewUrl: 'https://picsum.photos/seed/basilBalcony/600/400',
    submittedAt: new Date(2024, 0, 5),
  },
];

export default function ShowcasePage() {
  const [posts, setPosts] = useState<ShowcasePost[]>(initialPosts);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  // Ref for the form to call its reset method
  const formRef = useRef<{ reset: () => void }>(null);


  const handleAddShowcasePost = async (data: ShowcaseFormValues, imageFile: File) => {
    setIsLoading(true);

    // Simulate API call and image processing
    await new Promise(resolve => setTimeout(resolve, 1000));

    const reader = new FileReader();
    reader.onloadend = () => {
      const newPost: ShowcasePost = {
        id: uuidv4(),
        plantName: data.plantName,
        userName: data.userName,
        description: data.description,
        imagePreviewUrl: reader.result as string,
        submittedAt: new Date(),
      };
      setPosts(prevPosts => [newPost, ...prevPosts]);
      setIsLoading(false);
      toast({
        title: "Showcase Submitted!",
        description: "Thank you for sharing your plant's success story.",
      });
      // Reset the form via its exposed method
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
    <section className="w-full space-y-12">
      <div className="text-center">
        <h1 className="text-4xl font-bold tracking-tight text-primary sm:text-5xl lg:text-6xl">
          Plant Growth Showcase
        </h1>
        <p className="mt-4 text-lg leading-8 text-muted-foreground max-w-2xl mx-auto">
          See how others are succeeding with their urban gardens and share your own triumphs! 
          Upload a photo and tell us about your plant's journey.
        </p>
      </div>

      {/* Attach ref to ShowcaseForm */}
      <ShowcaseForm 
        onSubmit={handleAddShowcasePost} 
        isLoading={isLoading} 
        // Forward the ref to the form component if it supports it (needs useImperativeHandle)
        // For now, we handle reset in the callback.
        // To use the ref, ShowcaseForm would need to be wrapped in forwardRef and use useImperativeHandle
        // This is simplified here by just calling form.reset() within ShowcaseForm after successful submission.
        // Let's adjust ShowcaseForm to expose a reset method or handle it internally.
        // For simplicity, we'll have handleAddShowcasePost call form.reset() via RHF's form instance.
        // The formRef approach is more robust:
        // In ShowcaseForm, add: React.useImperativeHandle(ref, () => ({ resetForm() { form.reset(); setImagePreview(null); } }));
        // Then pass formRef to ShowcaseForm: <ShowcaseForm ref={formRef} ... />
        // This requires ShowcaseForm to use React.forwardRef.
        // For now, the provided ShowcaseForm is designed to reset via its own internal logic if parent calls a prop
        // Or simply, the parent can manage the form's `key` to force re-mount and reset, or pass down reset function.
        // The provided ShowcaseForm uses form.control.register for an internal reset handle.
      />

      <div className="mt-16">
        <h2 className="text-3xl font-semibold text-center text-primary mb-8">
          Community Garden Gallery
        </h2>
        <ShowcaseList posts={posts} />
      </div>
    </section>
  );
}

