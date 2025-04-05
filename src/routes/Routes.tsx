import { lazy } from "react";
import { RouteObject } from "react-router-dom";
import AuthGuard from "@guards/AuthGuard";
import ProjectGuard from "@guards/ProjectGuard";
import AdminGuard from "@guards/AdminGuard";

const Auth = lazy(() => import("@pages/auth/Auth"));
const DashboardLayout = lazy(() => import("@layouts/DashboardLayout"));
const Dashboard = lazy(() => import("@pages/dashboard/Dashboard"));
const Profile = lazy(() => import("@pages/profile/Profile"));
const Payments = lazy(() => import("@pages/payments/Payments"));
const Help = lazy(() => import("@pages/help/Help"));
const Bookings = lazy(() => import("@pages/bookings/Bookings"));
const AdminUsers = lazy(() => import("@/pages/admin/UserManagement"));
const AdminServices = lazy(() => import("@pages/admin/services/AdminServices"));
const NotFound = lazy(() => import("@components/NotFound"));

const routes: RouteObject[] = [
  {
    path: "/",
    element: (
      <AuthGuard>
        <Auth />
      </AuthGuard>
    ),
  },
  {
    path: "/dashboard",
    element: (
      <ProjectGuard>
        <DashboardLayout />
      </ProjectGuard>
    ),
    children: [
      { index: true, element: <Dashboard /> },
      { path: "payments", element: <Payments /> },
      { path: "bookings", element: <Bookings /> },
      {
        path: "admin/users",
        element: (
          <AdminGuard>
            <AdminUsers />
          </AdminGuard>
        ),
      },
      {
        path: "admin/services",
        element: (
          <AdminGuard>
            <AdminServices />
          </AdminGuard>
        ),
      },
      { path: "profile", element: <Profile /> },
      { path: "help", element: <Help /> },
    ],
  },
  {
    path: "*",
    element: <NotFound />,
  },
];

export default routes;
