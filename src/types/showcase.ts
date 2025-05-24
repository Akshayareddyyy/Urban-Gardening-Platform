
import type { Timestamp } from 'firebase/firestore';

export interface ShowcasePost {
  id: string; // Firestore document ID
  plantName: string;
  userName: string; // Creator's display name
  userAvatarUrl?: string;
  userId: string; // Creator's Firebase UID
  description: string;
  imageUrl: string; // URL from Firebase Storage
  submittedAt: Date | Timestamp; // Will be Timestamp from Firestore, converted to Date for client
  dataAiHint?: string;
}
