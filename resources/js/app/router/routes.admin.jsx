import React from "react";
import AdminGuard from "./guards/admin.guard.jsx";
import DashboardLayout from "../../layouts/dashboard.layout.jsx";
import DashboardPage from "../../features/admin/dashboard/dashboard.page.jsx";
import ProductTable from "../../features/admin/products/product.table.jsx";
import ProductCreate from "../../features/admin/products/product.create.jsx";
import ProductEdit from "../../features/admin/products/product.edit.jsx";
import OrdersTable from "../../features/admin/orders/orders.table.jsx";
import UsersTable from "../../features/admin/users/users.table.jsx";
import AdminSettings from "../../features/admin/settings/admin.settings.jsx";
import ProfilePage from "../../features/account/pages/profile.page.jsx";

const routes = [
  {
    path: "/admin",
    element: <AdminGuard><DashboardLayout /></AdminGuard>,
    children: [
      { index: true, element: <DashboardPage /> },
      { path: "products", element: <ProductTable /> },
      { path: "products/create", element: <ProductCreate /> },
      { path: "products/:id/edit", element: <ProductEdit /> },
      { path: "orders", element: <OrdersTable /> },
      { path: "users", element: <UsersTable /> },
      { path: "profile", element: <ProfilePage scope="admin" /> },
      { path: "settings", element: <AdminSettings /> },
    ],
  },
];

export default routes;

