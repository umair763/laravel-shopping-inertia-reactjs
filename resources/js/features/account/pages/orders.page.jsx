import React from "react";
import MyOrdersPage from "../../orders/pages/my.orders.page.jsx";

export default function CustomerOrdersPage() {
  return (
    <section className="space-y-4 rounded-[2rem] border border-sky-100 bg-white p-6 shadow-sm">
      <div>
        <p className="text-[10px] uppercase tracking-[0.28em] text-sky-500">Orders</p>
        <h1 className="mt-2 text-3xl font-black tracking-tight text-slate-900">Your orders</h1>
        <p className="mt-2 text-sm leading-6 text-slate-600">Track purchases, view status updates, and review order history.</p>
      </div>
      <MyOrdersPage />
    </section>
  );
}