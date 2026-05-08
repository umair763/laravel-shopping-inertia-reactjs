import React from "react";
import AuthLayout from "../../layouts/auth.layout.jsx";
import LoginPage from "../../pages/auth/login.page.jsx";
import RegisterPage from "../../pages/auth/register.page.jsx";
import AdminLoginPage from "../../pages/admin/admin.login.page.jsx";
import AdminRegisterPage from "../../pages/admin/admin.register.page.jsx";
import GuestGuard from "./guards/guest.guard.jsx";

const routes = [
  {
    path: "/auth",
    element: <GuestGuard><AuthLayout /></GuestGuard>,
    children: [
      { path: "login", element: <LoginPage /> },
      { path: "register", element: <RegisterPage /> },
      { path: "admin/login", element: <AdminLoginPage /> },
      { path: "admin/register", element: <AdminRegisterPage /> },
    ],
  },
];

export default routes;

