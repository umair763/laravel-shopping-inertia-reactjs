import React, { useEffect, useState } from "react";
import { getJson, formatCurrency, formatNumber, formatPercent } from "./fetch.js";

const CARD_LAYOUT = [
  { key: "total_revenue", label: "Total Revenue", format: "currency", accent: "from-emerald-500/10 to-emerald-500/0", dot: "bg-emerald-500" },
  { key: "total_orders", label: "Total Orders", format: "number", accent: "from-sky-500/10 to-sky-500/0", dot: "bg-sky-500" },
  { key: "total_customers", label: "Total Customers", format: "number", accent: "from-violet-500/10 to-violet-500/0", dot: "bg-violet-500" },
  { key: "total_products", label: "Total Products", format: "number", accent: "from-amber-500/10 to-amber-500/0", dot: "bg-amber-500" },
  { key: "pending_orders", label: "Pending Orders", format: "number", accent: "from-amber-500/10 to-amber-500/0", dot: "bg-amber-500" },
  { key: "completed_orders", label: "Completed Orders", format: "number", accent: "from-emerald-500/10 to-emerald-500/0", dot: "bg-emerald-500" },
  { key: "cancelled_orders", label: "Cancelled Orders", format: "number", accent: "from-rose-500/10 to-rose-500/0", dot: "bg-rose-500" },
  { key: "total_refunds", label: "Total Refunds", format: "currency", accent: "from-rose-500/10 to-rose-500/0", dot: "bg-rose-500" },
  { key: "monthly_revenue", label: "Monthly Revenue", format: "currency", accent: "from-emerald-500/10 to-emerald-500/0", dot: "bg-emerald-500" },
  { key: "average_order_value", label: "Average Order Value", format: "currency", accent: "from-sky-500/10 to-sky-500/0", dot: "bg-sky-500" },
  { key: "conversion_rate", label: "Conversion Rate", format: "percent", accent: "from-violet-500/10 to-violet-500/0", dot: "bg-violet-500" },
  { key: "active_users", label: "Active Users (30d)", format: "number", accent: "from-sky-500/10 to-sky-500/0", dot: "bg-sky-500" },
];

function formatValue(value, format) {
  if (format === "currency") return formatCurrency(value);
  if (format === "percent") return formatPercent(value);
  return formatNumber(value);
}

export default function KpiCards({ initial = null }) {
  const [data, setData] = useState(initial);
  const [loading, setLoading] = useState(!initial);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (initial) return;
    let cancelled = false;
    setLoading(true);
    getJson("/admin/dashboard/overview")
      .then((r) => !cancelled && setData(r.data))
      .catch((e) => !cancelled && setError(e.message))
      .finally(() => !cancelled && setLoading(false));
    return () => {
      cancelled = true;
    };
  }, [initial]);

  return (
    <section className="space-y-3">
      <header className="flex items-center justify-between">
        <h2 className="text-base font-semibold text-slate-900">Overview</h2>
        {loading && <span className="text-xs text-slate-400">Loading…</span>}
        {error && <span className="text-xs text-rose-600">{error}</span>}
      </header>

      <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4">
        {CARD_LAYOUT.map((card) => (
          <div
            key={card.key}
            className={`relative overflow-hidden rounded-2xl border border-slate-100 bg-white p-4 shadow-sm`}
          >
            <div className={`absolute inset-0 bg-gradient-to-br ${card.accent} pointer-events-none`} />
            <div className="relative space-y-1">
              <div className="flex items-center gap-2">
                <span className={`h-2 w-2 rounded-full ${card.dot}`} />
                <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-500">{card.label}</p>
              </div>
              <p className="text-2xl font-black tracking-tight text-slate-900">
                {loading && !data ? "—" : formatValue(data?.[card.key], card.format)}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
