import React from "react";
import CheckoutForm from "../components/checkout.form.jsx";

export default function CheckoutPage() {
  return (
    <div className="mx-auto max-w-5xl p-4">
      <h1 className="mb-4 text-2xl font-bold">Checkout</h1>
      <CheckoutForm />
    </div>
  );
}
