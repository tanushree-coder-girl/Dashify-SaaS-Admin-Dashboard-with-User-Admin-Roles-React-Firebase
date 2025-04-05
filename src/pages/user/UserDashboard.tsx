import { useEffect, useState } from "react";
import PageHeader from "@components/PageHeader";
import { useAuth } from "@context/AuthContext";
import {
  fetchUserBookings,
  fetchUserPayments,
  fetchUserActiveServices,
} from "@services/userDashboardApi";
import LoadingSpinner from "@components/LoadingSpinner";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid } from "recharts";

// ✅ Define TypeScript Types
interface BookingData {
  totalBookings: number;
  pendingBookings: number;
  approvedBookings: number;
  rejectedBookings: number;
}

interface PaymentData {
  completedPayments: number;
  pendingPayments: number;
  failedPayments: number;
  totalSpent: number;
}

interface ServiceData {
  activeServices: string[];
}

const UserDashboard = () => {
  const { user } = useAuth();

  const [bookingsData, setBookingsData] = useState<BookingData | null>(null);
  const [paymentsData, setPaymentsData] = useState<PaymentData | null>(null);
  const [activeServices, setActiveServices] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    if (!user?.uid) return;

    const fetchData = async () => {
      try {
        const [bookings, payments, services] = await Promise.all([
          fetchUserBookings(user.uid),
          fetchUserPayments(user.uid),
          fetchUserActiveServices(user.uid),
        ]);

        setBookingsData(bookings as BookingData);
        setPaymentsData(payments as PaymentData);
        setActiveServices((services as ServiceData).activeServices || []);
      } catch (err) {
        console.error("Error fetching user dashboard data: ", err);
        setError("Failed to load data!");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user]);

  // ✅ Chart Data for Payments
  const paymentChartData =
    paymentsData !== null
      ? [
          { name: "Completed", value: paymentsData.completedPayments || 0 },
          { name: "Pending", value: paymentsData.pendingPayments || 0 },
          { name: "Failed", value: paymentsData.failedPayments || 0 },
        ]
      : [];

  // ✅ Group and count active services for BarChart
  const activeServicesData = Object.entries(
    activeServices.reduce((acc: Record<string, number>, service) => {
      acc[service] = (acc[service] || 0) + 1;
      return acc;
    }, {})
  ).map(([name, count]) => ({ name, count }));

  return (
    <div>
      <PageHeader
        title={`Welcome Back, ${user?.name || "User"}!`}
        subtitle="Track your bookings, payments, and active services."
      />

      {loading ? (
        <LoadingSpinner />
      ) : error ? (
        <p className="text-center text-lg font-semibold text-error">{error}</p>
      ) : (
        <>
          {/* 📊 Key Stats */}
          <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              {
                label: "Total Bookings",
                value: bookingsData?.totalBookings ?? 0,
                color: "text-primary",
              },
              {
                label: "Pending Bookings",
                value: bookingsData?.pendingBookings ?? 0,
                color: "text-secondary",
              },
              {
                label: "Approved Bookings",
                value: bookingsData?.approvedBookings ?? 0,
                color: "text-success",
              },
              {
                label: "Rejected Bookings",
                value: bookingsData?.rejectedBookings ?? 0,
                color: "text-error",
              },
            ].map((stat, index) => (
              <div key={index} className="bg-surface p-4 rounded-lg shadow-lg">
                <h2 className="text-lg font-semibold text-theme">
                  {stat.label}
                </h2>
                <p className={`text-2xl font-bold ${stat.color}`}>
                  {stat.value}
                </p>
              </div>
            ))}
          </div>

          {/* 💳 Payments & Active Services */}
          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* 🚀 Payment Pie Chart */}
            <div className="bg-surface p-6 rounded-lg shadow-lg flex flex-col items-center">
              <h2 className="text-lg font-semibold text-theme">
                Total Amount Spent
              </h2>
              <p className="text-4xl font-bold text-primary">
                ${paymentsData?.totalSpent ?? 0}
              </p>

              {paymentChartData.some((data) => data.value > 0) ? (
                <div className="w-full h-60 mt-4">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={paymentChartData}
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        dataKey="value"
                        label
                      >
                        {paymentChartData.map((_entry, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={
                              index === 0
                                ? "var(--diagram-color1)"
                                : index === 1
                                ? "var(--diagram-color2)"
                                : "var(--diagram-color3)"
                            }
                          />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              ) : (
                <p className="text-secondary mt-4">No Payment Data Available</p>
              )}
            </div>

            {/* ✅ Active Services Bar Chart */}
            <div className="bg-surface p-6 rounded-lg shadow-lg flex flex-col items-center">
              <h2 className="text-lg font-semibold text-theme">
                Active Services
              </h2>

              {activeServicesData.length > 0 ? (
                <div className="w-full h-60 mt-4">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={activeServicesData}>
                      <defs>
                        <linearGradient
                          id="primaryGradient"
                          x1="0"
                          y1="0"
                          x2="0"
                          y2="1"
                        >
                          <stop
                            offset="5%"
                            stopColor="var(--diagram-color1)"
                            stopOpacity={1}
                          />
                          <stop
                            offset="95%"
                            stopColor="var(--diagram-color2)"
                            stopOpacity={1}
                          />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis allowDecimals={false} />
                      <Tooltip />
                      <Bar dataKey="count" fill="url(#primaryGradient)" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              ) : (
                <p className="text-secondary mt-4">No Active Services</p>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default UserDashboard;
