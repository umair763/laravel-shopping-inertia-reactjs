import React from "react";
import { Navigate } from "react-router-dom";
import AuthGuard from "./guards/auth.guard.jsx";
import CustomerLayout from "../../layouts/customer.layout.jsx";
import CustomerDashboardPage from "../../features/account/pages/dashboard.page.jsx";
import CustomerOrdersPage from "../../features/account/pages/orders.page.jsx";
import CustomerReturnsPage from "../../features/account/pages/returns.page.jsx";
import ProfilePage from "../../features/account/pages/profile.page.jsx";

const routes = [
  {
    path: "/account",
    element: <AuthGuard><CustomerLayout /></AuthGuard>,
    children: [
      { index: true, element: <Navigate to="dashboard" replace /> },
      { path: "dashboard", element: <CustomerDashboardPage /> },
      { path: "orders", element: <CustomerOrdersPage /> },
      { path: "returns", element: <CustomerReturnsPage /> },
      { path: "profile", element: <ProfilePage scope="customer" /> },
    ],
  },
];

export default routes;