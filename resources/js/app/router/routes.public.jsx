import React from "react";
import { Navigate } from "react-router-dom";
import StoreLayout from "../../layouts/store.layout.jsx";
import HomePage from "../../pages/store/home.page.jsx";
import ShopPage from "../../pages/store/shop.page.jsx";
import ProductPage from "../../pages/store/product.page.jsx";
import CartPage from "../../features/cart/pages/cart.page.jsx";
import CheckoutPage from "../../features/payments/pages/checkout.page.jsx";
import MyOrdersPage from "../../features/orders/pages/my.orders.page.jsx";
import OrderDetailsPage from "../../features/orders/pages/order.details.page.jsx";
import AuthGuard from "./guards/auth.guard.jsx";

const routes = [
  {
    path: "/store",
    element: <StoreLayout />,
    children: [
      { index: true, element: <HomePage /> },
      { path: "shop", element: <ShopPage /> },
      { path: "products/:slug", element: <ProductPage /> },
      { path: "cart", element: <CartPage /> },
      { path: "checkout", element: <AuthGuard><CheckoutPage /></AuthGuard> },
      { path: "orders", element: <AuthGuard><MyOrdersPage /></AuthGuard> },
      { path: "orders/:id", element: <AuthGuard><OrderDetailsPage /></AuthGuard> },
    ],
  },
  { path: "*", element: <Navigate to="/store" replace /> },
];

export default routes;

