import React from "react";
import OrderDetails from "../components/order.details.jsx";
import StoreLayout from "../../../layouts/store.layout.jsx";

export default function OrderDetailsPage({ order }) {
  return <OrderDetails order={order} />;
}

// Default layout for user orders
OrderDetailsPage.layout = (page) => <StoreLayout>{page}</StoreLayout>;
