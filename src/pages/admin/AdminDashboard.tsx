import { useEffect, useState } from "react";
import PageHeader from "@components/PageHeader";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Legend,
} from "recharts";
import { useAuth } from "@context/AuthContext";
import {
  fetchUsers,
  fetchBookings,
  fetchPayments,
  fetchServices,
} from "@services/dashboardApi";
import LoadingSpinner from "@components/LoadingSpinner";

// 📌 Define Data Types
interface UserData {
  totalUsers: number;
  activeUsers: number;
  inactiveUsers: number;
}

interface BookingData {
  totalBookings: number;
  rejectedBookings: number;
  completedBookings: number;
  pendingBookings: number;
  bookings: { serviceId: string }[];
}

interface PaymentData {
  totalRevenue: number;
}

interface ServiceData {
  id: string;
  title: string;
}

// ✅ Functional Component with TypeScript
const AdminDashboard = () => {
  const { user } = useAuth();

  const [usersData, setUsersData] = useState<UserData | null>(null);
  const [bookingsData, setBookingsData] = useState<BookingData | null>(null);
  const [paymentsData, setPaymentsData] = useState<PaymentData | null>(null);
  const [services, setServices] = useState<ServiceData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const users = await fetchUsers();
        const bookings = await fetchBookings();
        const payments = await fetchPayments();
        const servicesData = await fetchServices();

        setUsersData(users);
        setBookingsData(bookings);
        setPaymentsData(payments);
        setServices(servicesData);
      } catch (err) {
        console.error("Error fetching data: ", err);
        setError("Failed to load data!");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="">
      <PageHeader
        title={`Welcome ${user?.name || "Admin"}`}
        subtitle="Manage users, monitor activity, and analyze data."
      />

      {loading ? (
        <LoadingSpinner />
      ) : error ? (
        <p className="text-center text-lg font-semibold text-error">{error}</p>
      ) : (
        <>
          {/* Metrics */}
          <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-surface p-4 rounded-lg shadow-lg">
              <h2 className="text-lg font-semibold text-theme">Total Users</h2>
              <p className="text-2xl font-bold text-theme">
                {usersData?.totalUsers ?? 0}
              </p>
            </div>
            <div className="bg-surface p-4 rounded-lg shadow-lg">
              <h2 className="text-lg font-semibold text-theme">Revenue</h2>
              <p className="text-2xl font-bold text-theme">
                ${paymentsData?.totalRevenue ?? 0}
              </p>
            </div>
            <div className="bg-surface p-4 rounded-lg shadow-lg">
              <h2 className="text-lg font-semibold text-theme">
                Total Bookings
              </h2>
              <p className="text-2xl font-bold text-theme">
                {bookingsData?.totalBookings ?? 0}
              </p>
            </div>
            <div className="bg-surface p-4 rounded-lg shadow-lg">
              <h2 className="text-lg font-semibold text-theme">
                Total Services
              </h2>
              <p className="text-2xl font-bold text-theme">{services.length}</p>
            </div>
          </div>

          {/* Charts */}
          <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="w-full min-w-0 bg-surface p-4 rounded-lg shadow-lg">
              <h2 className="text-lg font-semibold text-theme">
                Bookings per Service (Bar Chart)
              </h2>
              <div className="w-full h-[250px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={services.map((service) => ({
                      name: service.title,
                      bookings:
                        bookingsData?.bookings.filter(
                          (b) => b.serviceId === service.id
                        ).length ?? 0,
                    }))}
                  >
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
                    <CartesianGrid strokeDasharray="3 3" stroke="text-theme" />
                    <XAxis dataKey="name" stroke="var(--text-color)" />
                    <YAxis stroke="var(--text-color)" />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="bookings" fill="url(#primaryGradient)" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="w-full min-w-0 bg-surface p-4 rounded-lg shadow-lg">
              <h2 className="text-lg font-semibold text-theme">
                User Status Distribution (Radar Chart)
              </h2>
              <div className="w-full h-[250px]">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart
                    outerRadius="80%"
                    data={[
                      {
                        subject: "Active Users",
                        A: usersData?.activeUsers ?? 0,
                      },
                      {
                        subject: "Inactive Users",
                        A: usersData?.inactiveUsers ?? 0,
                      },
                    ]}
                  >
                    <PolarGrid />
                    <PolarAngleAxis
                      dataKey="subject"
                      stroke="var(--diagram-color1)"
                    />
                    <PolarRadiusAxis
                      angle={30}
                      domain={[
                        0,
                        Math.max(
                          usersData?.activeUsers ?? 0,
                          usersData?.inactiveUsers ?? 0
                        ),
                      ]}
                    />
                    <Radar
                      name="User Status"
                      dataKey="A"
                      stroke="text-primary"
                      fill="var(--diagram-color1)"
                      fillOpacity={0.6}
                    />
                    <Tooltip />
                    <Legend />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Booking Summary */}
          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-surface p-4 rounded-lg shadow-lg">
              <h2 className="text-lg font-semibold text-theme">
                Completed Bookings
              </h2>
              <p className="text-2xl font-bold text-primary">
                {bookingsData?.completedBookings ?? 0}
              </p>
            </div>

            <div className="bg-surface p-4 rounded-lg shadow-lg">
              <h2 className="text-lg font-semibold text-theme">
                Pending Bookings
              </h2>
              <p className="text-2xl font-bold text-primary">
                {bookingsData?.pendingBookings ?? 0}
              </p>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default AdminDashboard;
