
'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Loader2, Camera, UploadCloud } from 'lucide-react';
import { useState, type ChangeEvent } from 'react';
import Image from 'next/image';

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ACCEPTED_IMAGE_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'];

const showcaseFormSchema = z.object({
  plantName: z.string().min(2, { message: "Plant name must be at least 2 characters." }).max(50, { message: "Plant name cannot exceed 50 characters." }),
  userName: z.string().min(2, { message: "Your name must be at least 2 characters." }).max(50, { message: "Your name cannot exceed 50 characters." }),
  description: z.string().min(10, { message: "Description must be at least 10 characters." }).max(500, { message: "Description cannot exceed 500 characters." }),
  image: z
    .custom<FileList>((val) => val instanceof FileList && val.length > 0, "An image of your plant is required.")
    .refine((files) => files?.[0]?.size <= MAX_FILE_SIZE, `Max file size is 5MB.`)
    .refine(
      (files) => ACCEPTED_IMAGE_TYPES.includes(files?.[0]?.type),
      "Only .jpg, .jpeg, .png, .webp and .gif formats are supported."
    ),
});

export type ShowcaseFormValues = z.infer<typeof showcaseFormSchema>;

type ShowcaseFormProps = {
  onSubmit: (data: ShowcaseFormValues, imageFile: File) => Promise<void>;
  isLoading: boolean;
};

export function ShowcaseForm({ onSubmit, isLoading }: ShowcaseFormProps) {
  const form = useForm<ShowcaseFormValues>({
    resolver: zodResolver(showcaseFormSchema),
    defaultValues: {
      plantName: '',
      userName: '',
      description: '',
      image: undefined,
    },
  });

  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const handleImageChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Set for RHF validation
      const dataTransfer = new DataTransfer();
      dataTransfer.items.add(file);
      form.setValue('image', dataTransfer.files, { shouldValidate: true });
      
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      form.resetField('image');
      setImagePreview(null);
    }
  };

  const handleSubmit = (values: ShowcaseFormValues) => {
    const imageFile = values.image[0];
    onSubmit(values, imageFile);
    // Reset preview and form fields after successful submission handled by parent
  };
  
  // Function to be called by parent to reset form & preview
  React.useImperativeHandle(form.control.register('resetForm', {}).ref, () => ({
    reset: () => {
      form.reset();
      setImagePreview(null);
    }
  }));


  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-8 max-w-xl mx-auto p-6 bg-card rounded-lg shadow-lg border">
        <FormField
          control={form.control}
          name="plantName"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-lg font-semibold text-primary">Plant Name</FormLabel>
              <FormControl>
                <Input placeholder="e.g., My beautiful Fiddle Leaf Fig" {...field} className="text-base"/>
              </FormControl>
              <FormDescription>What's the name of your plant?</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="userName"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-lg font-semibold text-primary">Your Name</FormLabel>
              <FormControl>
                <Input placeholder="e.g., PlantLover23" {...field} className="text-base"/>
              </FormControl>
              <FormDescription>How should we credit you?</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-lg font-semibold text-primary">Growth Story</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Tell us about your plant's journey, tips, or how our platform helped!"
                  className="resize-none text-base min-h-[120px]"
                  {...field}
                />
              </FormControl>
              <FormDescription>Share a brief story about your plant's growth (max 500 characters).</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="image"
          render={({ field }) => ( // field is used for RHF state, but input is handled by handleImageChange
            <FormItem>
              <FormLabel className="text-lg font-semibold text-primary">Plant Photo</FormLabel>
              <FormControl>
                 <Input 
                    type="file" 
                    accept="image/*" 
                    onChange={handleImageChange}
                    className="text-base file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20"
                  />
              </FormControl>
              <FormDescription>Upload a picture of your thriving plant (max 5MB).</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        
        {imagePreview && (
          <div className="mt-4">
            <p className="text-sm font-medium text-muted-foreground mb-2">Image Preview:</p>
            <Image src={imagePreview} alt="Selected plant preview" width={200} height={200} className="rounded-md border object-cover aspect-square" />
          </div>
        )}

        <Button type="submit" disabled={isLoading} className="w-full text-base py-3 h-12">
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              Submitting Showcase...
            </>
          ) : (
            <>
              <UploadCloud className="mr-2 h-5 w-5" />
              Share Your Plant's Success
            </>
          )}
        </Button>
      </form>
    </Form>
  );
}
