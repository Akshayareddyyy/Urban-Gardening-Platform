
'use client';

import type { User } from 'firebase/auth';
import { onAuthStateChanged } from 'firebase/auth';
import { createContext, useContext, useEffect, useState } from 'react';
import { auth } from '@/lib/firebase'; // Firebase auth instance
import { Loader2 } from 'lucide-react';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    console.log('AuthContext: useEffect mounting, setting up onAuthStateChanged listener.');
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        console.log('AuthContext: onAuthStateChanged - User IS present:', firebaseUser.uid);
        setUser(firebaseUser);
      } else {
        console.log('AuthContext: onAuthStateChanged - User is NOT present (null).');
        setUser(null);
      }
      setIsLoading(false);
      console.log('AuthContext: onAuthStateChanged - setIsLoading to false.');
    });

    return () => {
      console.log('AuthContext: useEffect unmounting, unsubscribing from onAuthStateChanged.');
      unsubscribe();
    }
  }, []);

  // Initial loader shown only on client-side before first auth check completes
  if (isLoading && typeof window !== 'undefined') {
    console.log('AuthContext: Rendering loader because isLoading is true.');
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <Loader2 className="h-16 w-16 animate-spin text-primary" />
        <p className="ml-4 text-xl text-muted-foreground">Loading application...</p>
      </div>
    );
  }

  console.log('AuthContext: Rendering provider. User:', user ? user.uid : null, 'isLoading:', isLoading, 'isAuthenticated:', !!user);
  return (
    <AuthContext.Provider value={{ user, isLoading, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
