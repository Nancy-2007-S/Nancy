import { doc, setDoc, getDoc } from 'firebase/firestore';
import { db } from './firebase';

export const saveUserProgress = async (userId, userProfile) => {
  try {
    const userRef = doc(db, 'users', userId);
    await setDoc(userRef, {
      ...userProfile,
      updatedAt: new Date().toISOString()
    }, { merge: true });
    console.log("Successfully saved progress to Firestore");
  } catch (error) {
    console.error("Error saving to Firestore", error);
  }
};

export const loadUserProgress = async (userId) => {
  try {
    const userRef = doc(db, 'users', userId);
    const docSnap = await getDoc(userRef);
    if (docSnap.exists()) {
      return docSnap.data();
    }
  } catch (error) {
    console.error("Error loading from Firestore", error);
  }
  return null;
};
