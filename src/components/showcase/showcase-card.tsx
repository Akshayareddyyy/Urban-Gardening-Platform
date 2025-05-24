
import Image from 'next/image';
import type { ShowcasePost } from '@/types/showcase';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { User, CalendarDays, Leaf, MessageSquare, Trash2 } from 'lucide-react';
import { format } from 'date-fns';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

interface ShowcaseCardProps {
  post: ShowcasePost;
  currentUserId: string | null;
  onDelete: (postId: string) => void;
  isDeleting: boolean;
}

export function ShowcaseCard({ post, currentUserId, onDelete, isDeleting }: ShowcaseCardProps) {
  const canDelete = currentUserId === post.userId;
  const submittedDate = post.submittedAt instanceof Date ? post.submittedAt : post.submittedAt.toDate();

  return (
    <Card className="flex flex-col overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 rounded-lg border-border bg-card">
      <CardHeader className="p-0 relative">
        <div className="aspect-video w-full bg-muted relative">
          <Image
            src={post.imageUrl} // Use imageUrl from Firebase Storage
            alt={`Image of ${post.plantName} shared by ${post.userName}`}
            layout="fill"
            objectFit="cover"
            className="rounded-t-lg"
            data-ai-hint={post.dataAiHint || `${post.plantName.split(' ')[0]} growth`}
          />
        </div>
         <Badge variant="secondary" className="absolute top-3 right-3 shadow">
            <Leaf className="mr-1.5 h-3.5 w-3.5" />
            {post.plantName}
        </Badge>
      </CardHeader>
      <CardContent className="p-5 flex-grow">
        <div className="flex items-center space-x-3 mb-3">
          <Avatar className="h-10 w-10 border-2 border-primary/20">
            <AvatarImage src={post.userAvatarUrl} alt={post.userName} data-ai-hint="person portrait" />
            <AvatarFallback>{post.userName?.substring(0,2).toUpperCase() || 'UG'}</AvatarFallback>
          </Avatar>
          <div>
            <CardTitle className="text-lg text-primary">
              {post.userName}'s Story
            </CardTitle>
             <div className="text-xs text-muted-foreground flex items-center mt-0.5">
                <CalendarDays className="mr-1.5 h-3.5 w-3.5" />
                <span>{format(submittedDate, 'MMM d, yyyy')}</span>
            </div>
          </div>
        </div>
        <CardDescription className="text-sm text-foreground/90 leading-relaxed line-clamp-4 whitespace-pre-wrap">
          <MessageSquare className="inline-block h-4 w-4 mr-1.5 text-accent relative -top-0.5" />
          {post.description}
        </CardDescription>
      </CardContent>
       <CardFooter className="p-4 bg-muted/50 border-t border-border flex justify-between items-center">
        <p className="text-xs text-muted-foreground">
          Shared by the community.
        </p>
        {canDelete && (
          <Button
            variant="destructive"
            size="sm"
            onClick={() => onDelete(post.id)}
            disabled={isDeleting}
            aria-label="Delete post"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
