import { db } from "../config/FirebaseConfig";
import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  getDocs,
  doc,
} from "firebase/firestore";

// Define the TypeScript type for a service
export interface Service {
  id?: string;
  title: string;
  category: string;
  price: number;
  status?: "Active" | "Inactive";
}

const servicesCollection = collection(db, "services");

// ✅ **Fetch Services**
export const fetchServices = async (): Promise<Service[]> => {
  const querySnapshot = await getDocs(servicesCollection);
  return querySnapshot.docs.map((doc) => ({
    id: doc.id,
    title: doc.data().title || "Unnamed Service",
    category: doc.data().category || "Uncategorized",
    price: doc.data().price || 0,
    status: doc.data().status || "Active",
  }));
};

// ✅ **Add Service**
export const addService = async (service: Service): Promise<void> => {
  const updatedService = { status: "Active", ...service };
  await addDoc(servicesCollection, updatedService);
};

// ✅ **Update Service**
export const updateService = async (
  id: string,
  updatedData: Partial<Service>
): Promise<void> => {
  const serviceRef = doc(db, "services", id);
  await updateDoc(serviceRef, updatedData);
};

// ✅ **Delete Service**
export const deleteService = async (id: string): Promise<void> => {
  const serviceRef = doc(db, "services", id);
  await deleteDoc(serviceRef);
};
