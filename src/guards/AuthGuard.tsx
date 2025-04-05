import { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext"; // ✅ Import useAuth

const AuthGuard = ({ children }: { children: ReactNode }) => {
  const { user } = useAuth(); // ✅ AuthContext se user data lo

  return user ? <Navigate to="/dashboard" replace /> : children;
};

export default AuthGuard;
