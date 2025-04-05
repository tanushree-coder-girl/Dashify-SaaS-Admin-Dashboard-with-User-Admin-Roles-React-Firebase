import { ReactNode } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const ProjectGuard = ({ children }: { children: ReactNode }) => {
  const { user } = useAuth();
  const location = useLocation();

  if (!user) return <Navigate to="/" replace />;

  // 🛑 Restrict non-admin users from admin pages
  if (
    location.pathname.startsWith("/dashboard/admin") &&
    user.role !== "admin"
  ) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

export default ProjectGuard;
