import { db } from "../config/FirebaseConfig";
import { collection, getDocs, query, where } from "firebase/firestore";

// ✅ Fetch User’s Bookings
export const fetchUserBookings = async (userId: string) => {
  const q = query(collection(db, "bookings"), where("userId", "==", userId));
  const snapshot = await getDocs(q);
  const bookings = snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as any[];

  return {
    totalBookings: bookings.length,
    approvedBookings: bookings.filter((b) => b.status === "Approved").length,
    rejectedBookings: bookings.filter((b) => b.status === "Rejected").length,
    pendingBookings: bookings.filter((b) => b.status === "Pending").length,
    bookings, // Raw Data
  };
};

// ✅ Fetch User’s Payments (FIX APPLIED)
export const fetchUserPayments = async (userId: string) => {
  const q = query(collection(db, "payments"), where("userId", "==", userId));
  const snapshot = await getDocs(q);
  const payments = snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as any[];

  // ✅ Calculate Total Spent
  const totalSpent = payments
    .filter((p) => p.paymentStatus === "Completed")
    .reduce((acc, p) => acc + (Number(p.price) || 0), 0);

  // ✅ Count Payment Statuses
  const completedPayments = payments.filter((p) => p.paymentStatus === "Completed").length;
  const pendingPayments = payments.filter((p) => p.paymentStatus === "Pending").length;
  const failedPayments = payments.filter((p) => p.paymentStatus === "Failed").length;

  return {
    totalSpent,
    completedPayments,
    pendingPayments,
    failedPayments,
    payments, // Raw Data
  };
};

// ✅ Fetch User’s Active Services
export const fetchUserActiveServices = async (userId: string) => {
  const q = query(collection(db, "bookings"), where("userId", "==", userId));
  const snapshot = await getDocs(q);
  const bookings = snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as any[];

  // ✅ Find services that are still active (based on approved bookings)
  const activeServices = bookings
    .filter((b) => b.status === "Approved")
    .map((b) => b.serviceTitle);

  return {
    activeServices,
  };
};
