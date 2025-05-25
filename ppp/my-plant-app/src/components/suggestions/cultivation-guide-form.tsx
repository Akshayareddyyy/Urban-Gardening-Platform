
'use client';

import * as React from 'react'; // Ensure React is imported
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
import { Loader2, BookOpen } from 'lucide-react';
import type { GetCultivationGuideInput } from '@/ai/flows/get-cultivation-guide-flow';

const formSchema = z.object({
  plantName: z.string().min(2, { message: 'Plant name must be at least 2 characters.' }).max(100, {message: 'Plant name is too long (max 100 characters).'}),
});

type CultivationGuideFormValues = z.infer<typeof formSchema>;

type CultivationGuideFormProps = {
  onSubmit: (data: GetCultivationGuideInput) => Promise<void>;
  isLoading: boolean;
  initialPlantName?: string;
};

export function CultivationGuideForm({ onSubmit, isLoading, initialPlantName }: CultivationGuideFormProps) {
  const form = useForm<CultivationGuideFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      plantName: initialPlantName || '',
    },
  });

  // Update default value if initialPlantName changes
  React.useEffect(() => {
    if (initialPlantName) {
      form.reset({ plantName: initialPlantName });
    }
  }, [initialPlantName, form]);

  const handleSubmit = (values: CultivationGuideFormValues) => {
    onSubmit(values);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="plantName"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-lg font-semibold text-primary">Plant Name for Cultivation Guide</FormLabel>
              <FormControl>
                <Input placeholder="e.g., Tomato, Basil, Sunflower" {...field} className="text-base"/>
              </FormControl>
              <FormDescription>
                Enter the name of the plant you want to grow.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={isLoading} className="w-full text-base py-3 h-12">
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              Fetching Guide...
            </>
          ) : (
            <>
              <BookOpen className="mr-2 h-5 w-5" />
              Get Cultivation Guide
            </>
          )}
        </Button>
      </form>
    </Form>
  );
}
