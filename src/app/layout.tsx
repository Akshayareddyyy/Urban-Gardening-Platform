
import type {Metadata} from 'next';
import { GeistSans } from 'geist/font/sans';
// import { GeistMono } from 'geist/font/mono'; // Removed as it's not used and causing error
import './globals.css';
import { AppHeader } from '@/components/layout/header';
import { Toaster } from "@/components/ui/toaster";

export const metadata: Metadata = {
  title: {
    default: 'Urban Gardening Platform',
    template: '%s | Urban Gardening Platform',
  },
  description: 'Your one-stop platform for urban gardening success. Find plants, get suggestions, share your growth, and learn about plant care.',
  keywords: ['urban gardening', 'plants', 'gardening tips', 'plant care', 'indoor plants', 'balcony garden', 'fertilizer guide', 'plant showcase'],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${GeistSans.variable} font-sans antialiased`}>
        <div className="flex flex-col min-h-screen">
          <AppHeader />
          <main className="flex-grow container mx-auto px-4 py-8 md:px-6 lg:px-8">
            {children}
          </main>
        </div>
        <Toaster />
      </body>
    </html>
  );
}
