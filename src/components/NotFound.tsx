import React from "react";
import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <div className="min-h-screen bg-theme text-theme flex flex-col items-center justify-center px-4 text-center">
      <h1 className="text-6xl font-bold text-primary mb-4">404</h1>
      <p className="text-2xl text-secondary mb-6">Page Not Found</p>
      <p className="text-base text-secondary mb-10">
        Oops! The page you're looking for doesn't exist.
      </p>
      <Link
        to="/dashboard"
        className="bg-primary text-theme px-6 py-3 rounded-lg font-medium hover:opacity-80 transition"
      >
        Go back to Dashboard
      </Link>
    </div>
  );
};

export default NotFound;
