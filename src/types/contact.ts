
import type { Timestamp } from 'firebase/firestore';

export interface ContactMessage {
  id: string; // Firestore document ID
  name: string;
  email: string;
  message: string;
  submittedAt: Date; // Converted from Firestore Timestamp for easier use
}

export interface FirestoreContactData {
  name: string;
  email: string;
  message: string;
  submittedAt: Timestamp; // Firestore Timestamp
}
