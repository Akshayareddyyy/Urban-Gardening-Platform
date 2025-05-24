'use server';

import { db, storage } from '@/lib/firebase';
import { collection, getDocs, query, orderBy, Timestamp, addDoc, serverTimestamp, deleteDoc, doc, getDoc } from 'firebase/firestore';
import { ref, uploadBytesResumable, getDownloadURL, deleteObject } from "firebase/storage";
import type { ContactMessage, FirestoreContactData } from '@/types/contact';
import type { ShowcasePost } from '@/types/showcase';
import { v4 as uuidv4 } from 'uuid';

export async function getContactMessages(): Promise<ContactMessage[]> {
  if (!db) {
    console.error("Firestore database is not initialized.");
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
        submittedAt: data.submittedAt instanceof Timestamp ? data.submittedAt.toDate() : new Date(),
      };
    });
    return messages;
  } catch (error) {
    console.error("Error fetching contact messages from Firestore:", error);
    return [];
  }
}

// Showcase Posts Service Functions

export async function addShowcasePost(
  postData: {
    plantName: string;
    description: string;
    userName: string;
    userAvatarUrl?: string;
    userId: string;
    dataAiHint?: string;
  },
  imageFile: File
): Promise<ShowcasePost> {
  if (!db || !storage) {
    throw new Error("Firebase services (Firestore/Storage) not initialized.");
  }

  // 1. Upload image to Firebase Storage
  const imageFileName = `showcaseImages/${postData.userId}/${uuidv4()}-${imageFile.name}`;
  const storageRef = ref(storage, imageFileName);
  
  await uploadBytesResumable(storageRef, imageFile);
  const imageUrl = await getDownloadURL(storageRef);

  // 2. Add post data to Firestore
  const showcaseCollectionRef = collection(db, 'showcasePosts');
  const docRef = await addDoc(showcaseCollectionRef, {
    ...postData,
    imageUrl: imageUrl,
    submittedAt: serverTimestamp(),
  });

  // Return the newly created post data (approximate, as submittedAt will be a server timestamp)
  return {
    id: docRef.id,
    ...postData,
    imageUrl,
    submittedAt: new Date(), // Client-side approximation, actual value is server-generated
  };
}

export async function getShowcasePosts(): Promise<ShowcasePost[]> {
  if (!db) {
    console.error("Firestore database is not initialized.");
    return [];
  }
  try {
    const postsCollectionRef = collection(db, 'showcasePosts');
    const q = query(postsCollectionRef, orderBy('submittedAt', 'desc'));
    const querySnapshot = await getDocs(q);

    const posts: ShowcasePost[] = querySnapshot.docs.map((doc) => {
      const data = doc.data();
      // Ensure submittedAt is converted to Date, default to now if somehow missing (should not happen with serverTimestamp)
      const submittedAtDate = data.submittedAt instanceof Timestamp 
                                ? data.submittedAt.toDate() 
                                : (data.submittedAt ? new Date(data.submittedAt) : new Date());
      return {
        id: doc.id,
        plantName: data.plantName,
        userName: data.userName,
        userAvatarUrl: data.userAvatarUrl,
        userId: data.userId,
        description: data.description,
        imageUrl: data.imageUrl,
        submittedAt: submittedAtDate,
        dataAiHint: data.dataAiHint,
      } as ShowcasePost;
    });
    return posts;
  } catch (error) {
    console.error("Error fetching showcase posts:", error);
    throw new Error("Failed to fetch showcase posts.");
  }
}

export async function deleteShowcasePost(postId: string, requestingUserId: string): Promise<void> {
  if (!db || !storage) {
    throw new Error("Firebase services (Firestore/Storage) not initialized.");
  }

  const postDocRef = doc(db, 'showcasePosts', postId);
  const postSnap = await getDoc(postDocRef);

  if (!postSnap.exists()) {
    throw new Error("Post not found.");
  }

  const postData = postSnap.data() as ShowcasePost;

  if (postData.userId !== requestingUserId) {
    throw new Error("User not authorized to delete this post.");
  }

  // Delete image from Storage
  if (postData.imageUrl) {
    try {
      const imageRef = ref(storage, postData.imageUrl); // Firebase SDK can parse full URL
      await deleteObject(imageRef);
    } catch (storageError: any) {
      // Log storage error but proceed to delete Firestore doc if image deletion fails
      // (e.g., if file was already deleted or URL was malformed, but post might still exist)
      console.error(`Failed to delete image ${postData.imageUrl} from Storage:`, storageError);
      if (storageError.code === 'storage/object-not-found') {
        console.warn('Image was not found in storage, possibly already deleted.');
      } else {
         // Optionally re-throw if image deletion is critical before Firestore deletion
         // throw new Error('Failed to delete post image from storage.');
      }
    }
  }

  // Delete document from Firestore
  await deleteDoc(postDocRef);
}