import React from "react";
import { Link } from "@inertiajs/react";

const STATUS_STYLES = {
  pending:    "bg-amber-50 text-amber-700 border-amber-100",
  processing: "bg-sky-50 text-sky-700 border-sky-100",
  shipped:    "bg-indigo-50 text-indigo-700 border-indigo-100",
  delivered:  "bg-emerald-50 text-emerald-700 border-emerald-100",
  cancelled:  "bg-red-50 text-red-700 border-red-100",
};

export default function ActivityFeed({ orders = [] }) {
  if (!orders.length) {
    return (
      <div className="rounded-[1.75rem] border border-slate-100 bg-white p-6 shadow-sm">
        <p className="text-xs uppercase tracking-[0.28em] text-slate-400">Recent activity</p>
        <p className="mt-4 text-sm text-slate-500">No recent orders to display.</p>
      </div>
    );
  }

  return (
    <div className="rounded-[1.75rem] border border-slate-100 bg-white p-6 shadow-sm">
      <p className="text-xs uppercase tracking-[0.28em] text-slate-400">Recent activity</p>
      <ul className="mt-4 space-y-3">
        {orders.map((order) => {
          const style = STATUS_STYLES[order.order_status] || "bg-slate-50 text-slate-600 border-slate-100";
          return (
            <li key={order.id} className="flex items-center justify-between gap-3 rounded-2xl border border-slate-100 bg-slate-50 px-4 py-3">
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-slate-900">
                  Order #{order.id} — {order.user?.name || order.user?.email || "Guest"}
                </p>
                <p className="mt-0.5 text-xs text-slate-500">${Number(order.total ?? 0).toFixed(2)}</p>
              </div>
              <span className={`shrink-0 rounded-full border px-3 py-1 text-xs font-semibold ${style}`}>
                {order.order_status}
              </span>
            </li>
          );
        })}
      </ul>
      <Link href="/admin/orders" className="mt-4 block text-center text-xs font-semibold text-sky-600 hover:underline">
        View all orders →
      </Link>
    </div>
  );
}
