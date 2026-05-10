import React from "react";

function formatCurrency(value) {
  if (value == null) return "—";
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(value);
}

export default function RevenueChart({ stats }) {
  const total = stats?.total_revenue ?? null;
  const orders = stats?.total_orders ?? null;
  const avg = total != null && orders ? (total / orders) : null;

  return (
    <div className="rounded-[1.75rem] border border-slate-100 bg-white p-6 shadow-sm">
      <p className="text-xs uppercase tracking-[0.28em] text-slate-400">Revenue overview</p>
      <div className="mt-4 grid gap-4 sm:grid-cols-3">
        <div className="rounded-2xl bg-sky-50 p-4">
          <p className="text-xs text-sky-600">Total revenue</p>
          <p className="mt-2 text-2xl font-black text-sky-800">{formatCurrency(total)}</p>
        </div>
        <div className="rounded-2xl bg-indigo-50 p-4">
          <p className="text-xs text-indigo-600">Orders placed</p>
          <p className="mt-2 text-2xl font-black text-indigo-800">{orders ?? "—"}</p>
        </div>
        <div className="rounded-2xl bg-emerald-50 p-4">
          <p className="text-xs text-emerald-600">Avg. order value</p>
          <p className="mt-2 text-2xl font-black text-emerald-800">{avg != null ? formatCurrency(avg) : "—"}</p>
        </div>
      </div>
    </div>
  );
}
