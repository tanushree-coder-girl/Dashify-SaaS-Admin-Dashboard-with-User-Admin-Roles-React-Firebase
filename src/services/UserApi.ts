import { db } from "../config/FirebaseConfig";
import {
  collection,
  getDocs,
  updateDoc,
  doc,
} from "firebase/firestore";

// Define the TypeScript type for a user
export interface User {
  id: string;
  name: string;
  email: string;
  role: "admin" | "user" | "editor";
  status: boolean;
  created_at: Date;
}

const usersCollection = collection(db, "users");

// ✅ **Fetch All Users**
export const fetchUsers = async (): Promise<User[]> => {
  const querySnapshot = await getDocs(usersCollection);
  return querySnapshot.docs.map((doc) => ({
    id: doc.id,
    name: doc.data().name || "Unnamed User",
    email: doc.data().email || "No Email",
    role: doc.data().role || "user",
    status: doc.data().status ?? true, // Default active
    created_at: doc.data().created_at?.toDate() || new Date(),
  }));
};

// ✅ **Update User Role**
export const updateUserRole = async (id: string, newRole: "admin" | "user" | "editor"): Promise<void> => {
  const userRef = doc(db, "users", id);
  await updateDoc(userRef, { role: newRole });
};

// ✅ **Activate/Deactivate User**
export const toggleUserStatus = async (id: string, newStatus: boolean): Promise<void> => {
  const userRef = doc(db, "users", id);
  await updateDoc(userRef, { status: newStatus });
};
