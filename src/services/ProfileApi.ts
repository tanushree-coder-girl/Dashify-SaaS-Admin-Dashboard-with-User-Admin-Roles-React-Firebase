import { db } from "../config/FirebaseConfig";
import { doc, getDoc, updateDoc } from "firebase/firestore";

// ✅ Fetch user profile
export const fetchUserProfile = async (userId: string) => {
  if (!userId) return null;
  try {
    const userRef = doc(db, "users", userId);
    const userSnap = await getDoc(userRef);
    return userSnap.exists() ? { id: userSnap.id, ...userSnap.data() } : null;
  } catch (error) {
    console.error("Error fetching user profile:", error);
    return null;
  }
};

// ✅ Update user profile
export const updateUserProfile = async (userId: string, updatedData: any) => {
  if (!userId) return false;
  try {
    const userRef = doc(db, "users", userId);
    await updateDoc(userRef, updatedData);
    return true;
  } catch (error) {
    console.error("Error updating user profile:", error);
    return false;
  }
};

// ✅ Convert Image to Base64 and Save to Firestore
export const uploadProfileImage = async (userId: string, file: File) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = async () => {
      try {
        const base64String = reader.result as string;
        const userRef = doc(db, "users", userId);
        await updateDoc(userRef, { profilePic: base64String });
        resolve(base64String);
      } catch (error) {
        console.error("Error uploading profile picture:", error);
        reject(error);
      }
    };
    reader.onerror = (error) => reject(error);
  });
};
