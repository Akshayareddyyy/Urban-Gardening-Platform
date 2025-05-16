
'use client';
import Link from 'next/link';
import { SproutIcon } from '@/components/icons';
import { Button } from '@/components/ui/button';
import { usePathname, useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Search, Lightbulb, GalleryThumbnails, FlaskConical, LogIn, UserPlus, LogOut } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { auth } from '@/lib/firebase';
import { signOut } from 'firebase/auth';
import { useToast } from '@/hooks/use-toast';

// Common nav items are removed as "Contact Us" was the only one.
// If you add other common items, this array can be reinstated.
// const commonNavItems = [
// ];

const protectedNavItems = [
  { href: '/', label: 'Search Plants', icon: Search, protected: true },
  { href: '/showcase', label: 'Showcase', icon: GalleryThumbnails, protected: true },
  { href: '/suggestions', label: 'Get Suggestions', icon: Lightbulb, protected: true },
  { href: '/fertilizer-guide', label: 'Fertilizer Guide', icon: FlaskConical, protected: true },
  // Removed: { href: '/admin/contact-messages', label: 'Inbox', icon: Inbox, protected: true },
];

const authNavItems = [
  { href: '/login', label: 'Login', icon: LogIn, protected: false },
  { href: '/signup', label: 'Sign Up', icon: UserPlus, protected: false },
];

export function AppHeader() {
  const pathname = usePathname();
  const { user, isAuthenticated } = useAuth();
  const router = useRouter();
  const { toast } = useToast();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      toast({ title: "Logged Out", description: "You have been successfully logged out." });
      router.push('/login'); // Redirect to login page after logout
    } catch (error) {
      console.error("Error logging out:", error);
      toast({ variant: "destructive", title: "Logout Error", description: "Failed to log out. Please try again." });
    }
  };

  let currentNavItems = [];
  if (isAuthenticated) {
    currentNavItems = [...protectedNavItems];
  }
  // If there were commonNavItems, they would be added here:
  // currentNavItems = [...currentNavItems, ...commonNavItems];


  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 max-w-screen-2xl items-center">
        <Link href={isAuthenticated ? "/" : "/login"} className="flex items-center space-x-2 mr-6">
          <SproutIcon className="h-8 w-8 text-primary" />
          <span className="font-bold text-xl text-primary">Urban Gardening</span>
        </Link>
        <nav className="flex items-center space-x-1 md:space-x-0 flex-grow">
          {currentNavItems.map((item) => (
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
        <nav className="flex items-center space-x-1 md:space-x-0 ml-auto">
          {isAuthenticated ? (
            <Button
              variant="ghost"
              onClick={handleLogout}
              className="text-sm font-medium px-2 py-2 md:px-3 text-muted-foreground hover:text-foreground hover:bg-accent/50"
              title="Logout"
            >
              <LogOut className="h-4 w-4 md:mr-2" />
              <span className="hidden md:inline">Logout</span>
            </Button>
          ) : (
            authNavItems.map((item) => (
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
            ))
          )}
        </nav>
      </div>
    </header>
  );
}
