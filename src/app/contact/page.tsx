
import { ContactForm } from '@/components/contact/contact-form';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Contact Us | Urban Gardening Platform',
  description: 'Get in touch with the Urban Gardening Platform team. Send us your questions, feedback, or inquiries.',
};

export default function ContactPage() {
  return (
    <section className="w-full space-y-12">
      <div className="text-center">
        <h1 className="text-4xl font-bold tracking-tight text-primary sm:text-5xl lg:text-6xl">
          Contact Us
        </h1>
        <p className="mt-4 text-lg leading-8 text-muted-foreground max-w-2xl mx-auto">
          Have a question, feedback, or just want to say hello? Fill out the form below, and we'll get back to you as soon as possible.
        </p>
      </div>
      <ContactForm />
    </section>
  );
}
