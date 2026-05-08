import React from "react";
import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

export default function GuestGuard({ children }) {
  const user = useSelector((state) => state.auth.user);
  if (user) {
    return <Navigate to={user.role === "admin" ? "/admin" : "/account/dashboard"} replace />;
  }
  return children;
}
