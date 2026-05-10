import React from "react";
import OrderCard from "../components/order.card.jsx";
import StoreLayout from "../../../layouts/store.layout.jsx";

export default function MyOrdersPage({ orders }) {
  const items = orders?.data || orders || [];
  return <div className="space-y-3">{items.map((order) => <OrderCard key={order.id} order={order} />)}</div>;
}

MyOrdersPage.layout = (page) => <StoreLayout>{page}</StoreLayout>;

