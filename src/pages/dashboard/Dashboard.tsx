import UserDashboard from "@pages/user/UserDashboard";
import AdminDashboard from "@pages/admin/AdminDashboard";
import { useAuth } from "@context/AuthContext";

const DashboardPage = () => {
  const { user } = useAuth();
  return <>{user?.role === "admin" ? <AdminDashboard /> : <UserDashboard />}</>;
};

export default DashboardPage;
