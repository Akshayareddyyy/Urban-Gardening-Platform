
import Image from 'next/image';
import type { ShowcasePost } from '@/types/showcase';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { User, CalendarDays, Leaf } from 'lucide-react';
import { format } from 'date-fns';

interface ShowcaseCardProps {
  post: ShowcasePost;
}

export function ShowcaseCard({ post }: ShowcaseCardProps) {
  return (
    <Card className="flex flex-col overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 rounded-lg">
      <CardHeader className="p-0">
        <div className="relative w-full h-56 bg-muted">
          <Image
            src={post.imagePreviewUrl}
            alt={`Image of ${post.plantName} shared by ${post.userName}`}
            layout="fill"
            objectFit="cover"
            className="rounded-t-lg"
            data-ai-hint={`${post.plantName.split(' ')[0] || 'plant'} ${post.userName.split(' ')[0] || 'growth'}`}
          />
        </div>
      </CardHeader>
      <CardContent className="p-4 flex-grow">
        <CardTitle className="text-xl mb-2 text-primary flex items-center">
          <Leaf className="mr-2 h-5 w-5" />
          {post.plantName}
        </CardTitle>
        <CardDescription className="text-base text-foreground/90 leading-relaxed mb-3">
          {post.description}
        </CardDescription>
      </CardContent>
      <CardFooter className="p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center text-sm text-muted-foreground space-y-2 sm:space-y-0">
        <div className="flex items-center">
          <User className="mr-2 h-4 w-4 text-accent" />
          <span>Shared by: {post.userName}</span>
        </div>
        <div className="flex items-center">
          <CalendarDays className="mr-2 h-4 w-4 text-accent" />
          <span>{format(post.submittedAt, 'PP')}</span>
        </div>
      </CardFooter>
    </Card>
  );
}
