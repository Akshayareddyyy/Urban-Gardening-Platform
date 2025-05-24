
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
import { Avatar, AvatarFallback } from "@/components/ui/avatar"; // Ensure Avatar is imported

const protectedNavItems = [
  { href: '/', label: 'Search Plants', icon: Search, protected: true },
  { href: '/showcase', label: 'Showcase', icon: GalleryThumbnails, protected: true },
  { href: '/suggestions', label: 'Get Suggestions', icon: Lightbulb, protected: true },
  { href: '/fertilizer-guide', label: 'Fertilizer Guide', icon: FlaskConical, protected: true },
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
      router.push('/login');
    } catch (error) {
      console.error("Error logging out:", error);
      toast({ variant: "destructive", title: "Logout Error", description: "Failed to log out. Please try again." });
    }
  };

  let currentNavItems = [];
  if (isAuthenticated) {
    currentNavItems = [...protectedNavItems];
  }

  const getUserInitial = () => {
    if (user) {
      if (user.displayName) {
        return user.displayName.charAt(0).toUpperCase();
      }
      if (user.email) {
        return user.email.charAt(0).toUpperCase();
      }
    }
    return 'U'; // Fallback initial
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 max-w-screen-2xl items-center">
        {/* Logo - mr-auto will push everything else to the right */}
        <Link href={isAuthenticated ? "/" : "/"} className="flex items-center space-x-2 mr-auto">
          <SproutIcon className="h-8 w-8 text-primary" />
          <span className="font-bold text-xl text-primary">Urban Gardening</span>
        </Link>

        {/* Main Navigation items (Search Plants, Showcase, etc.) */}
        <nav className="flex items-center space-x-1 md:space-x-0">
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

        {/* Spacer between main nav and auth nav, only if main nav has items */}
        {currentNavItems.length > 0 && (
          <div className="w-2 md:w-4" />
        )}

        {/* Authentication Navigation (Login/Signup or Logout) */}
        <nav className="flex items-center space-x-1 md:space-x-2">
          {isAuthenticated && user ? (
            <>
              <Avatar className="h-8 w-8 border border-primary/30">
                <AvatarFallback className="bg-primary/10 text-primary font-semibold text-sm">
                  {getUserInitial()}
                </AvatarFallback>
              </Avatar>
              <Button
                variant="ghost"
                onClick={handleLogout}
                className="text-sm font-medium px-2 py-2 md:px-3 text-muted-foreground hover:text-foreground hover:bg-accent/50"
                title="Logout"
              >
                <LogOut className="h-4 w-4 md:mr-2" />
                <span className="hidden md:inline">Logout</span>
              </Button>
            </>
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
