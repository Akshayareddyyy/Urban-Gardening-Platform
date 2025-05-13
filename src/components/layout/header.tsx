
'use client';
import Link from 'next/link';
import { SproutIcon } from '@/components/icons';
import { Button } from '@/components/ui/button';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Search, Lightbulb, GalleryThumbnails, FlaskConical, Mail } from 'lucide-react';


const navItems = [
  { href: '/', label: 'Search Plants', icon: Search },
  { href: '/showcase', label: 'Showcase', icon: GalleryThumbnails },
  { href: '/suggestions', label: 'Get Suggestions', icon: Lightbulb },
  { href: '/fertilizer-guide', label: 'Fertilizer Guide', icon: FlaskConical },
  { href: '/contact', label: 'Contact Us', icon: Mail },
];

export function AppHeader() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 max-w-screen-2xl items-center justify-between">
        <Link href="/" className="flex items-center space-x-2">
          <SproutIcon className="h-8 w-8 text-primary" />
          <span className="font-bold text-xl text-primary">Urban Gardening</span>
        </Link>
        <nav className="flex items-center space-x-1 md:space-x-0">
          {navItems.map((item) => (
            <Button
              key={item.href}
              variant="ghost"
              asChild
              className={cn(
                'text-sm font-medium px-2 py-2 md:px-3',
                pathname === item.href
                  ? 'text-primary bg-primary/10 hover:bg-primary/20 hover:text-primary'
                  : 'text-muted-foreground hover:text-foreground hover:bg-accent/50'
              )}
            >
              <Link href={item.href} title={item.label}>
                <item.icon className="h-4 w-4 md:mr-2" />
                <span className="hidden md:inline">{item.label}</span>
              </Link>
            </Button>
          ))}
        </nav>
      </div>
    </header>
  );
}
