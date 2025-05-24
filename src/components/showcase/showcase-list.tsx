
import type { ShowcasePost } from '@/types/showcase';
import { ShowcaseCard } from './showcase-card';
import { GalleryThumbnails, Info } from 'lucide-react';

interface ShowcaseListProps {
  posts: ShowcasePost[];
}

export function ShowcaseList({ posts }: ShowcaseListProps) {
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
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6"> {/* Adjusted grid columns */}
      {posts.map((post) => (
        <ShowcaseCard key={post.id} post={post} />
      ))}
    </div>
  );
}
