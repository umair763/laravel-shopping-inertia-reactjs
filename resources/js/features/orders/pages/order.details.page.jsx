import React from "react";
import { useParams } from "react-router-dom";
import OrderDetails from "../components/order.details.jsx";

export default function OrderDetailsPage() {
  const { id } = useParams();
  return <OrderDetails order={{ id }} />;
}
