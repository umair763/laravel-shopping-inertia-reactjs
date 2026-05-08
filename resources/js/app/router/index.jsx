import React from "react";
import { createBrowserRouter, Navigate } from "react-router-dom";
import publicRoutes from "./routes.public.jsx";
import authRoutes from "./routes.auth.jsx";
import accountRoutes from "./routes.account.jsx";
import adminRoutes from "./routes.admin.jsx";

const router = createBrowserRouter([
  { path: "/", element: <Navigate to="/store" replace /> },
  ...publicRoutes,
  ...authRoutes,
  ...accountRoutes,
  ...adminRoutes,
]);

export default router;
