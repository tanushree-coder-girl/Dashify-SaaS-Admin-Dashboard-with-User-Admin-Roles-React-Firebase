import { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const AdminGuard = ({ children }: { children: ReactNode }) => {
  const { user } = useAuth();

  return user?.role === "admin" ? (
    children
  ) : (
    <Navigate to="/dashboard" replace />
  );
};

export default AdminGuard;
