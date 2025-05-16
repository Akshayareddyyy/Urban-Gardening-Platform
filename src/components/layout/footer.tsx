
// src/components/layout/footer.tsx
import { Separator } from "@/components/ui/separator";
import { Mail, Phone } from "lucide-react";

export function AppFooter() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-muted/50 border-t border-border mt-auto">
      <div className="container mx-auto px-4 py-8 md:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          <div>
            <h3 className="text-lg font-semibold text-primary mb-3">Urban Gardening Platform</h3>
            <p className="text-sm text-muted-foreground">
              Cultivating green spaces in city places. Your guide to urban gardening success.
            </p>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-primary mb-3">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li><a href="/" className="text-muted-foreground hover:text-primary transition-colors">Home</a></li>
              <li><a href="/showcase" className="text-muted-foreground hover:text-primary transition-colors">Showcase</a></li>
              <li><a href="/suggestions" className="text-muted-foreground hover:text-primary transition-colors">Get Suggestions</a></li>
              <li><a href="/fertilizer-guide" className="text-muted-foreground hover:text-primary transition-colors">Fertilizer Guide</a></li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-primary mb-3">Contact Us</h3>
            <address className="not-italic space-y-2 text-sm text-muted-foreground">
              <div className="flex items-center">
                <Mail className="h-4 w-4 mr-2 text-accent" />
                <a href="mailto:support@urbangardening.example.com" className="hover:text-primary transition-colors">
                  support@urbangardening.example.com
                </a>
              </div>
              <div className="flex items-center">
                <Phone className="h-4 w-4 mr-2 text-accent" />
                <span>(555) 123-4567 (Example)</span>
              </div>
              <p>123 Green St, Cityville, USA</p>
            </address>
          </div>
        </div>
        <Separator />
        <div className="text-center text-sm text-muted-foreground pt-6">
          <p>&copy; {currentYear} Urban Gardening Platform. All rights reserved.</p>
          <p className="mt-1">
            Designed to help your urban garden thrive.
          </p>
        </div>
      </div>
    </footer>
  );
}
