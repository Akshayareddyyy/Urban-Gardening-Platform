
'use server';

import { db } from '@/lib/firebase';
import { collection, getDocs, query, orderBy, Timestamp } from 'firebase/firestore';
import type { ContactMessage, FirestoreContactData } from '@/types/contact';

export async function getContactMessages(): Promise<ContactMessage[]> {
  if (!db) {
    console.error("Firestore database is not initialized.");
    // In a real app, you might throw an error or return an empty array with a status
    return [];
  }
  try {
    const contactsCollectionRef = collection(db, 'contacts');
    const q = query(contactsCollectionRef, orderBy('submittedAt', 'desc'));
    const querySnapshot = await getDocs(q);

    const messages: ContactMessage[] = querySnapshot.docs.map((doc) => {
      const data = doc.data() as FirestoreContactData;
      return {
        id: doc.id,
        name: data.name,
        email: data.email,
        message: data.message,
        // Convert Firestore Timestamp to JavaScript Date object
        submittedAt: data.submittedAt instanceof Timestamp ? data.submittedAt.toDate() : new Date(),
      };
    });
    return messages;
  } catch (error) {
    console.error("Error fetching contact messages from Firestore:", error);
    // Depending on your error handling strategy, you might throw the error
    // or return an empty array to allow the page to render gracefully.
    return [];
  }
}
