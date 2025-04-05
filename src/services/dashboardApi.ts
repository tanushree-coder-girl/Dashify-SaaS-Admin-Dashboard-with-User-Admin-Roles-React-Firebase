import { db } from "../config/FirebaseConfig";
import { collection, getDocs } from "firebase/firestore";

// ✅ Define Types for Firestore Data
interface User {
  id: string;
  email: string;
  name: string;
  role: string;
  status: boolean;
  uid: string;
}

interface Service {
  id: string;
  category: string;
  price: number;
  status: "active" | "inactive";
  title: string;
}

interface Booking {
  id: string;
  category: string;
  price: number;
  serviceId: string;
  serviceTitle: string;
  status: "Approved" | "Rejected" | "Pending";
  userId: string;
}

interface Payment {
  id: string;
  bookingId: string;
  userId: string;
  paymentStatus: "Completed" | "Pending" | "Failed";
  price: number;
  serviceTitle: string;
}

// ✅ Users Data Fetch + Analytics
export const fetchUsers = async (): Promise<{
  totalUsers: number;
  activeUsers: number;
  inactiveUsers: number;
  users: User[];
}> => {
  const snapshot = await getDocs(collection(db, "users"));
  const users: User[] = snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as User[];

  return {
    totalUsers: users.length,
    activeUsers: users.filter((user) => user.status).length,
    inactiveUsers: users.filter((user) => !user.status).length,
    users,
  };
};

// ✅ Services Data Fetch
export const fetchServices = async (): Promise<Service[]> => {
  const snapshot = await getDocs(collection(db, "services"));
  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as Service[];
};

// ✅ Bookings Data Fetch + Analytics
export const fetchBookings = async (): Promise<{
  totalBookings: number;
  rejectedBookings: number;
  completedBookings: number;
  pendingBookings: number;
  bookings: Booking[];
}> => {
  const snapshot = await getDocs(collection(db, "bookings"));
  const bookings: Booking[] = snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as Booking[];

  return {
    totalBookings: bookings.length,
    rejectedBookings: bookings.filter((b) => b.status === "Rejected").length,
    completedBookings: bookings.filter((b) => b.status === "Approved").length,
    pendingBookings: bookings.filter((b) => b.status === "Pending").length,
    bookings,
  };
};

// ✅ Payments Data Fetch + Total Revenue Calculation
export const fetchPayments = async (): Promise<{
  totalRevenue: number;
  payments: Payment[];
}> => {
  const snapshot = await getDocs(collection(db, "payments"));
  const payments: Payment[] = snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as Payment[];

  const totalRevenue = payments
    .filter((p) => p.paymentStatus.toLowerCase() === "completed")
    .reduce((acc, p) => acc + (Number(p.price) || 0), 0);

  return {
    totalRevenue,
    payments,
  };
};
