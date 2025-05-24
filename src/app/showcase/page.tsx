
'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { ShowcaseForm, type ShowcaseFormValues } from '@/components/showcase/showcase-form';
import { ShowcaseList } from '@/components/showcase/showcase-list';
import type { ShowcasePost } from '@/types/showcase';
import { useToast } from "@/hooks/use-toast";
import { Users, Leaf, Loader2 } from 'lucide-react';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { useAuth } from '@/context/AuthContext';
import { addShowcasePost, getShowcasePosts, deleteShowcasePost } from '@/lib/firestore-service';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';


export default function ShowcasePage() {
  const [posts, setPosts] = useState<ShowcasePost[]>([]);
  const [isLoading, setIsLoading] = useState(false); // For form submission
  const [isFetchingPosts, setIsFetchingPosts] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [isDeletingPostId, setIsDeletingPostId] = useState<string | null>(null);

  const { toast } = useToast();
  const formRef = useRef<{ reset: () => void }>(null);
  const { user } = useAuth();

  const fetchPosts = useCallback(async () => {
    setIsFetchingPosts(true);
    setFetchError(null);
    try {
      const fetchedPosts = await getShowcasePosts();
      setPosts(fetchedPosts);
    } catch (error) {
      console.error("Failed to fetch showcase posts:", error);
      setFetchError(error instanceof Error ? error.message : "Could not load posts.");
      toast({
        variant: "destructive",
        title: "Error Loading Posts",
        description: "Could not retrieve showcase posts. Please try refreshing.",
      });
    } finally {
      setIsFetchingPosts(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  const handleAddShowcasePost = async (data: ShowcaseFormValues, imageFile: File) => {
    if (!user) {
      toast({
        variant: "destructive",
        title: "Authentication Error",
        description: "You must be logged in to submit a showcase post.",
      });
      return;
    }
    setIsLoading(true);
    
    const userName = user.displayName || user.email || 'Anonymous Gardener';
    const userAvatar = user.photoURL || undefined; // Pass undefined if no photoURL

    const postData = {
      plantName: data.plantName,
      description: data.description,
      userName: userName,
      userAvatarUrl: userAvatar,
      userId: user.uid,
      dataAiHint: `${data.plantName.split(" ")[0]} user project`
    };

    try {
      await addShowcasePost(postData, imageFile);
      toast({
        title: "Showcase Submitted!",
        description: "Thank you for sharing your plant's success story.",
      });
      if (formRef.current) {
        formRef.current.reset();
      }
      fetchPosts(); // Re-fetch posts to show the new one
    } catch (error) {
      console.error("Failed to add showcase post:", error);
      toast({
        variant: "destructive",
        title: "Submission Error",
        description: error instanceof Error ? error.message : "Could not submit your post. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeletePost = async (postId: string) => {
    if (!user) {
      toast({ variant: "destructive", title: "Not Authorized", description: "You must be logged in." });
      return;
    }
    setIsDeletingPostId(postId);
    try {
      await deleteShowcasePost(postId, user.uid);
      toast({ title: "Post Deleted", description: "Your showcase post has been removed." });
      setPosts(prevPosts => prevPosts.filter(p => p.id !== postId)); // Optimistic update
    } catch (error) {
      console.error("Failed to delete post:", error);
      toast({
        variant: "destructive",
        title: "Deletion Failed",
        description: error instanceof Error ? error.message : "Could not delete the post.",
      });
    } finally {
      setIsDeletingPostId(null);
    }
  };

  return (
    <ProtectedRoute>
      <section className="w-full space-y-12">
        <div className="text-center">
          <Users className="mx-auto h-16 w-16 text-primary opacity-80 mb-4" />
          <h1 className="text-4xl font-bold tracking-tight text-primary sm:text-5xl lg:text-6xl">
            Plant Growth Showcase
          </h1>
          <p className="mt-4 text-lg leading-8 text-muted-foreground max-w-2xl mx-auto">
            See how others are succeeding with their urban gardens and share your own triumphs! 
            Upload a photo and tell us about your plant's journey.
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-10 lg:gap-12">
          <aside className="lg:w-1/3 lg:sticky lg:top-24 self-start h-fit space-y-6">
            <div className="p-6 bg-card rounded-lg shadow-lg border">
              <h2 className="text-2xl font-semibold text-primary mb-1 flex items-center">
                <Leaf className="h-6 w-6 mr-2 text-accent" />
                Share Your Green Success!
              </h2>
              <p className="text-sm text-muted-foreground mb-6">
                Inspire others by showcasing your plant's progress.
              </p>
              <ShowcaseForm 
                ref={formRef}
                onSubmit={handleAddShowcasePost} 
                isLoading={isLoading} 
              />
            </div>
          </aside>

          <main className="lg:w-2/3">
            <h2 className="text-3xl font-semibold text-primary mb-10 text-center lg:text-left">
              Our Community's Green Gallery
            </h2>
            {isFetchingPosts && (
              <div className="flex justify-center items-center py-10">
                <Loader2 className="h-12 w-12 animate-spin text-primary" />
                <p className="ml-4 text-lg text-muted-foreground">Loading showcases...</p>
              </div>
            )}
            {fetchError && !isFetchingPosts && (
              <Alert variant="destructive" className="max-w-xl mx-auto">
                <AlertTitle>Error Loading Posts</AlertTitle>
                <AlertDescription>{fetchError} Please try refreshing the page.</AlertDescription>
              </Alert>
            )}
            {!isFetchingPosts && !fetchError && (
              <ShowcaseList 
                posts={posts} 
                currentUserId={user?.uid || null}
                onDeletePost={handleDeletePost}
                isDeletingPostId={isDeletingPostId}
              />
            )}
          </main>
        </div>
      </section>
    </ProtectedRoute>
  );
}
