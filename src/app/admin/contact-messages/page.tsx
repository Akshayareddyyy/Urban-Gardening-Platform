
import { getContactMessages } from '@/lib/firestore-service';
import type { ContactMessage } from '@/types/contact';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { format } from 'date-fns';
import { Inbox, UserCircle, Mail as MailIcon, MessageSquare, CalendarDays } from 'lucide-react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Contact Messages | Admin',
  description: 'View messages submitted through the contact form.',
};

export default async function ContactMessagesPage() {
  const messages: ContactMessage[] = await getContactMessages();

  return (
    <ProtectedRoute>
      <section className="w-full space-y-8">
        <div className="text-center">
          <Inbox className="mx-auto h-16 w-16 text-primary opacity-80 mb-4" />
          <h1 className="text-4xl font-bold tracking-tight text-primary sm:text-5xl">
            Contact Form Submissions
          </h1>
          <p className="mt-3 text-lg leading-8 text-muted-foreground max-w-xl mx-auto">
            Browse messages received from users.
          </p>
        </div>

        {messages.length === 0 ? (
          <Card className="max-w-2xl mx-auto text-center py-12">
            <CardHeader>
              <MessageSquare className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
              <CardTitle className="text-2xl">No Messages Yet</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                There are no messages in the inbox. When users submit the contact form, their messages will appear here.
              </p>
            </CardContent>
          </Card>
        ) : (
          <ScrollArea className="h-[calc(100vh-250px)] max-w-4xl mx-auto pr-4">
            <div className="space-y-6">
              {messages.map((msg) => (
                <Card key={msg.id} className="shadow-lg border">
                  <CardHeader className="flex flex-row items-start gap-4 space-y-0 pb-3">
                    <Avatar className="h-12 w-12 border">
                       {/* Simple fallback with first letter of name */}
                      <AvatarFallback className="text-lg bg-secondary text-secondary-foreground">
                        {msg.name ? msg.name.charAt(0).toUpperCase() : <UserCircle size={24} />}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <CardTitle className="text-xl text-primary">{msg.name}</CardTitle>
                      <CardDescription className="flex items-center text-sm text-muted-foreground pt-1">
                        <MailIcon className="mr-1.5 h-4 w-4" /> {msg.email}
                      </CardDescription>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <Separator />
                    <p className="text-base text-foreground/90 whitespace-pre-wrap leading-relaxed">
                      {msg.message}
                    </p>
                  </CardContent>
                  <CardFooter className="text-xs text-muted-foreground flex justify-end items-center pt-3">
                    <CalendarDays className="mr-1.5 h-3.5 w-3.5" />
                    Submitted: {format(new Date(msg.submittedAt), "PPpp")} {/* Format date nicely */}
                  </CardFooter>
                </Card>
              ))}
            </div>
          </ScrollArea>
        )}
      </section>
    </ProtectedRoute>
  );
}
