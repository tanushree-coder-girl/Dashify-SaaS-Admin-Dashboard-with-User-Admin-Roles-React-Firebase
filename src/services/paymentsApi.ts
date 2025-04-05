import { db } from "../config/FirebaseConfig";
import {
  collection,
  getDocs,
  query,
  where,
  doc,
  updateDoc,
} from "firebase/firestore";

interface Payment {
  id?: string;
  bookingId: string;
  userId: string;
  serviceTitle: string;
  price: number;
  paymentStatus: "Pending" | "Completed" | "Failed";
}

// ✅ **Payments Collection Reference**
const paymentsCollection = collection(db, "payments");

// ✅ **Fetch Payments (For Admin or User)**
export const fetchPayments = async (
  isAdmin: boolean,
  userId?: string
): Promise<Payment[]> => {
  const q = isAdmin
    ? paymentsCollection // 🟢 Admin sees all payments
    : query(paymentsCollection, where("userId", "==", userId)); // 🔵 User sees only their own

  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() } as Payment));
};

// ✅ **Update Payment Status to "Completed"**
export const updatePaymentStatus = async (paymentId: string) => {
  if (!paymentId) return;

  const paymentRef = doc(db, "payments", paymentId);

  try {
    await updateDoc(paymentRef, { paymentStatus: "Completed" });
    console.log(`✅ Payment ID: ${paymentId} marked as Completed`);
  } catch (error) {
    console.error("❌ Error updating payment status:", error);
  }
};
