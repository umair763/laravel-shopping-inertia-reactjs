import React from "react";
import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

export default function AdminGuard({ children }) {
  const user = useSelector((state) => state.auth.user);

  if (!user) return <Navigate to="/auth/login" replace />;
  if (user.role !== "admin") return <Navigate to="/store" replace />;

  return children;
}
