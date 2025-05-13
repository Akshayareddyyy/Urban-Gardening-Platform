
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
import { Textarea } from '@/components/ui/textarea'; // Replaced Select with Textarea for soil
import type { SuggestFertilizersInput } from '@/types/fertilizer';
import { Loader2, Sparkles } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const growthFocusOptions = [
  "General health and maintenance",
  "Lush leafy growth",
  "Abundant flowers",
  "Fruit or vegetable production",
  "Strong root development",
  "Seedling or young plant establishment",
  "Revitalizing stressed plant",
];

const formSchema = z.object({
  plantType: z.string().min(3, { message: 'Plant type must be at least 3 characters.' }).max(100, {message: 'Plant type description is too long (max 100 characters).'}),
  growthFocus: z.string().min(3, { message: 'Please select a growth focus.' }),
  soilDescription: z.string()
    .max(150, {message: "Soil description is too long (max 150 characters)."})
    .optional()
    .describe('A brief description of the soil, if known (e.g., "sandy and drains quickly", "heavy clay", "using standard potting mix", "unknown garden soil").'),
});

type FertilizerFormProps = {
  onSubmit: (data: SuggestFertilizersInput) => Promise<void>;
  isLoading: boolean;
};

export function FertilizerForm({ onSubmit, isLoading }: FertilizerFormProps) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      plantType: '',
      growthFocus: '',
      soilDescription: '',
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
          name="plantType"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-lg font-semibold text-primary">Plant Type / Name</FormLabel>
              <FormControl>
                <Input placeholder="e.g., Tomatoes, Roses, Peace Lily, Herb Garden" {...field} className="text-base"/>
              </FormControl>
              <FormDescription>
                What kind of plant(s) are you fertilizing?
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="growthFocus"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-lg font-semibold text-primary">Primary Growth Goal</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger className="text-base">
                    <SelectValue placeholder="Select your main objective for fertilizing" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {growthFocusOptions.map(option => (
                    <SelectItem key={option} value={option} className="text-base">
                      {option}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormDescription>
                What do you primarily want to achieve with fertilization?
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="soilDescription"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-lg font-semibold text-primary">Soil Description (Optional)</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="e.g., Sandy and drains quickly, heavy clay, new potting mix, unknown outdoor soil"
                  className="resize-none text-base min-h-[80px]"
                  {...field}
                />
              </FormControl>
              <FormDescription>
                If you know your soil type, describe it briefly. This can help tailor suggestions.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={isLoading} className="w-full text-base py-3 h-12">
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              Finding Fertilizer Wisdom...
            </>
          ) : (
            <>
              <Sparkles className="mr-2 h-5 w-5" />
              Get Fertilizer Advice
            </>
          )}
        </Button>
      </form>
    </Form>
  );
}
