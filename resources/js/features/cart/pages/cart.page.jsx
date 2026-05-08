import React from "react";
import CartSummary from "../components/cart.summary.jsx";

export default function CartPage() {
  return (
    <div className="mx-auto max-w-6xl p-4">
      <h1 className="mb-4 text-2xl font-bold">Your Cart</h1>
      <CartSummary />
    </div>
  );
}
