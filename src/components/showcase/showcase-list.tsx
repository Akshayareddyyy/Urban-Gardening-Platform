
import type { ShowcasePost } from '@/types/showcase';
import { ShowcaseCard } from './showcase-card';
import { GalleryThumbnails } from 'lucide-react';

interface ShowcaseListProps {
  posts: ShowcasePost[];
  currentUserId: string | null;
  onDeletePost: (postId: string) => void;
  isDeletingPostId: string | null;
}

export function ShowcaseList({ posts, currentUserId, onDeletePost, isDeletingPostId }: ShowcaseListProps) {
  if (posts.length === 0) {
    return (
      <div className="text-center py-10 text-muted-foreground">
        <GalleryThumbnails className="mx-auto h-16 w-16 mb-4 text-primary opacity-50" />
        <h3 className="text-xl font-semibold text-foreground mb-2">No Showcases Yet!</h3>
        <p>Be the first to share your plant's growth journey using the form on the left.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {posts.map((post) => (
        <ShowcaseCard 
          key={post.id} 
          post={post} 
          currentUserId={currentUserId}
          onDelete={onDeletePost}
          isDeleting={isDeletingPostId === post.id}
        />
      ))}
    </div>
  );
}
