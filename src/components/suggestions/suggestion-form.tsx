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
import type { SuggestPlantsInput } from '@/ai/flows/suggest-plants';
import { Loader2, Sparkles } from 'lucide-react';

const formSchema = z.object({
  climate: z.string().min(3, { message: 'Climate must be at least 3 characters.' }).max(100, {message: 'Climate description is too long (max 100 characters).'}),
  availableSpace: z.string().min(3, { message: 'Available space description must be at least 3 characters.' }).max(200, {message: 'Available space description is too long (max 200 characters).'}),
});

type SuggestionFormProps = {
  onSubmit: (data: SuggestPlantsInput) => Promise<void>;
  isLoading: boolean;
};

export function SuggestionForm({ onSubmit, isLoading }: SuggestionFormProps) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      climate: '',
      availableSpace: '',
    },
  });

  const handleSubmit = (values: z.infer<typeof formSchema>) => {
    onSubmit(values);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-8 max-w-xl mx-auto p-6 bg-card rounded-lg shadow-lg border">
        <FormField
          control={form.control}
          name="climate"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-lg font-semibold text-primary">Your Climate</FormLabel>
              <FormControl>
                <Input placeholder="e.g., Temperate with warm summers and mild winters" {...field} className="text-base"/>
              </FormControl>
              <FormDescription>
                Describe the general climate of your location (e.g., tropical, arid, temperate with cold winters).
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="availableSpace"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-lg font-semibold text-primary">Available Space</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="e.g., Small sunny balcony (10 sq ft), large shady backyard patch (100 sq ft), indoor windowsill with indirect light"
                  className="resize-none text-base min-h-[100px]"
                  {...field}
                />
              </FormControl>
              <FormDescription>
                Briefly describe the space you have for plants (size, light conditions, indoor/outdoor).
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={isLoading} className="w-full text-base py-3 h-12">
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              Conjuring Plant Ideas...
            </>
          ) : (
            <>
              <Sparkles className="mr-2 h-5 w-5" />
              Get Plant Suggestions
            </>
          )}
        </Button>
      </form>
    </Form>
  );
}
