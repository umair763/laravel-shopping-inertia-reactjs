import React from "react";
import useOrders from "../hooks/use.orders.js";
import OrderCard from "../components/order.card.jsx";

export default function MyOrdersPage() {
  const { data } = useOrders();
  const orders = data?.data || [];
  return <div className="space-y-3">{orders.map((order) => <OrderCard key={order.id} order={order} />)}</div>;
}

