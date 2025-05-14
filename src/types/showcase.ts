
export interface ShowcasePost {
  id: string;
  plantName: string;
  userName: string;
  userAvatarUrl?: string; // Optional: URL for user's avatar
  description: string;
  imagePreviewUrl: string; // Data URI or URL for the image
  submittedAt: Date;
  dataAiHint?: string; // Optional: Hint for AI image search
}
