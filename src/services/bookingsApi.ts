import { db } from "../config/FirebaseConfig";
import {
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc,
  query,
  where,
  updateDoc,
  setDoc,
} from "firebase/firestore";

interface Booking {
  id?: string;
  userId: string | number | undefined;
  serviceId: string;
  serviceTitle: string;
  category: string;
  price: number;
  status: "Pending" | "Approved" | "Rejected";
}

const bookingsCollection = collection(db, "bookings");

export const fetchBookings = async (userId?: string): Promise<Booking[]> => {
  const q = userId
    ? query(bookingsCollection, where("userId", "==", userId))
    : bookingsCollection;
  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() } as Booking));
};

export const addBooking = async (booking: Booking): Promise<void> => {
  await addDoc(bookingsCollection, booking);
};

export const cancelBooking = async (id: string): Promise<void> => {
  const bookingRef = doc(db, "bookings", id);
  await deleteDoc(bookingRef);
};

export const updateBookingStatus = async ({
  bookingId,
  status,
  userId,
  serviceTitle,
  price,
}: {
  bookingId: string;
  status: "Approved" | "Rejected";
  userId: string;
  serviceTitle: string;
  price: number;
}) => {
  const bookingRef = doc(db, "bookings", bookingId);
  await updateDoc(bookingRef, { status });

  if (status === "Approved") {
    // ✅ **Agar Approved Hai To Payment Table Me Store Karo**
    const paymentsCollection = collection(db, "payments");
    await addDoc(paymentsCollection, {
      bookingId,
      userId,
      serviceTitle,
      price,
      paymentStatus: "Pending",
    });
  }
};

// ✅ Check if payment is completed for a booking
export const fetchPaymentStatus = async (
  bookingId: string
): Promise<boolean> => {
  const paymentsCollection = collection(db, "payments");
  const q = query(
    paymentsCollection,
    where("bookingId", "==", bookingId),
    where("paymentStatus", "==", "Completed")
  );
  const snapshot = await getDocs(q);

  return !snapshot.empty; // अगर कोई "Completed" पेमेंट मिली, तो true return करो
};
