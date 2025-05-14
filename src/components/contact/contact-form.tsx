
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
import { useToast } from '@/hooks/use-toast';
import { Loader2, Send } from 'lucide-react';
import { useState } from 'react';
import { db } from '@/lib/firebase'; // Import db instance
import { collection, addDoc, serverTimestamp } from 'firebase/firestore'; // Import Firestore functions

const contactFormSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }).max(100, {message: "Name cannot exceed 100 characters."}),
  email: z.string().email({ message: "Please enter a valid email address." }).max(100, {message: "Email cannot exceed 100 characters."}),
  message: z.string().min(10, { message: "Message must be at least 10 characters." }).max(1000, {message: "Message cannot exceed 1000 characters."}),
});

type ContactFormValues = z.infer<typeof contactFormSchema>;

export function ContactForm() {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<ContactFormValues>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      name: '',
      email: '',
      message: '',
    },
  });

  const handleSubmit = async (values: ContactFormValues) => {
    console.log("Contact form: Attempting to send message with values:", values);
    console.log("Contact form: Firestore db instance:", db);
    setIsLoading(true);

    if (!db) {
      console.error("Contact form: Firestore database is not initialized. 'db' is null or undefined.");
      toast({
        variant: "destructive",
        title: "Configuration Error",
        description: "The messaging service is not properly configured. Please contact support.",
      });
      setIsLoading(false);
      return;
    }

    try {
      console.log("Contact form: Calling addDoc to Firestore 'contacts' collection...");
      const docRef = await addDoc(collection(db, "contacts"), {
        ...values,
        submittedAt: serverTimestamp(), // Add a server timestamp
      });
      console.log("Contact form: Message successfully sent to Firestore. Document ID:", docRef.id);

      toast({
        title: "Message Sent!",
        description: "Thank you for contacting us. We'll get back to you shortly.",
      });
      form.reset();
    } catch (error) {
      console.error("Contact form: Detailed error adding document to Firestore:", error);
      let errorMessage = "There was a problem sending your message. Please try again later.";
      if (error instanceof Error && 'code' in error) {
        // Firebase errors often have a 'code' property
        const firebaseError = error as { code: string; message: string };
        if (firebaseError.code === 'permission-denied') {
          errorMessage = "Submission failed: Permission denied. Please check Firestore security rules.";
        } else {
          errorMessage = `Submission failed: ${firebaseError.message} (Code: ${firebaseError.code})`;
        }
      } else if (error instanceof Error) {
        errorMessage = `Submission failed: ${error.message}`;
      }
      
      toast({
        variant: "destructive",
        title: "Submission Error",
        description: errorMessage,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-8 max-w-xl mx-auto p-6 bg-card rounded-lg shadow-lg border">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-lg font-semibold text-primary">Your Name</FormLabel>
              <FormControl>
                <Input placeholder="e.g., Jane Doe" {...field} className="text-base" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-lg font-semibold text-primary">Your Email</FormLabel>
              <FormControl>
                <Input placeholder="e.g., jane.doe@example.com" {...field} className="text-base" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="message"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-lg font-semibold text-primary">Your Message</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Let us know how we can help or what's on your mind..."
                  className="resize-none text-base min-h-[150px]"
                  {...field}
                />
              </FormControl>
              <FormDescription>
                Please provide as much detail as possible (max 1000 characters).
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={isLoading} className="w-full text-base py-3 h-12">
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              Sending Message...
            </>
          ) : (
            <>
              <Send className="mr-2 h-5 w-5" />
              Send Message
            </>
          )}
        </Button>
      </form>
    </Form>
  );
}
