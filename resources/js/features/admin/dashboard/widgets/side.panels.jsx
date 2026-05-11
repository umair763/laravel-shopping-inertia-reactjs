import React, { useEffect, useState } from "react";
import { Link } from "@inertiajs/react";
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import { getJson, rangeFromPreset, formatCurrency, formatNumber } from "./fetch.js";

function useEndpoint(url, params = null, deps = []) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    getJson(url, params || {})
      .then((r) => !cancelled && setData(r.data))
      .catch((e) => !cancelled && setError(e.message))
      .finally(() => !cancelled && setLoading(false));
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  return { data, loading, error };
}

function PanelShell({ title, subtitle, action, loading, error, children }) {
  return (
    <section className="space-y-3 rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
      <header className="flex items-start justify-between gap-3">
        <div>
          <h3 className="text-sm font-semibold text-slate-900">{title}</h3>
          {subtitle && <p className="text-xs text-slate-500">{subtitle}</p>}
        </div>
        {action}
      </header>
      {error ? (
        <p className="text-sm text-rose-600">{error}</p>
      ) : loading ? (
        <p className="text-xs text-slate-400">Loading…</p>
      ) : (
        children
      )}
    </section>
  );
}

// -------- Recent Orders --------
export function RecentOrdersPanel() {
  const { data, loading, error } = useEndpoint("/admin/dashboard/recent-orders", { limit: 8 }, []);

  return (
    <PanelShell
      title="Recent orders"
      subtitle="Latest 8 placed"
      loading={loading}
      error={error}
      action={<Link href="/admin/orders" className="text-xs font-semibold text-sky-700 hover:underline">View all</Link>}
    >
      <ul className="divide-y divide-slate-100">
        {(data || []).map((o) => (
          <li key={o.id} className="flex items-center justify-between gap-3 py-2">
            <div className="min-w-0">
              <Link href={`/admin/orders/${o.id}`} className="block truncate text-sm font-semibold text-slate-900 hover:underline">
                {o.order_number}
              </Link>
              <p className="truncate text-[11px] text-slate-500">{o.customer.name}</p>
            </div>
            <div className="text-right">
              <p className="text-sm font-semibold text-slate-900">{formatCurrency(o.total_amount)}</p>
              <p className="text-[11px] uppercase tracking-wider text-slate-500">{o.order_status || "—"}</p>
            </div>
          </li>
        ))}
        {!loading && (data || []).length === 0 && <li className="py-2 text-xs text-slate-400">No orders yet.</li>}
      </ul>
    </PanelShell>
  );
}

// -------- Inventory Alerts --------
export function InventoryAlertsPanel() {
  const { data, loading, error } = useEndpoint("/admin/dashboard/inventory-alerts", { limit: 12 }, []);

  const severityClass = {
    out: "bg-rose-50 text-rose-700",
    critical: "bg-amber-50 text-amber-700",
    low: "bg-sky-50 text-sky-700",
  };

  return (
    <PanelShell title="Inventory alerts" subtitle="At or below low-stock threshold" loading={loading} error={error}>
      <ul className="divide-y divide-slate-100">
        {(data || []).map((row) => (
          <li key={row.variant_id} className="flex items-center justify-between gap-3 py-2">
            <div className="min-w-0">
              <Link href={`/admin/products/${row.product_id}/edit`} className="block truncate text-sm font-semibold text-slate-900 hover:underline">
                {row.product_name}
              </Link>
              <p className="truncate text-[11px] text-slate-500">{row.variant_sku}</p>
            </div>
            <span className={`rounded-full px-2 py-0.5 text-[11px] font-semibold ${severityClass[row.severity] || "bg-slate-100 text-slate-600"}`}>
              {row.available_quantity} / {row.low_stock_threshold}
            </span>
          </li>
        ))}
        {!loading && (data || []).length === 0 && <li className="py-2 text-xs text-slate-400">All variants are healthy.</li>}
      </ul>
    </PanelShell>
  );
}

// -------- Sales By Category --------
const PIE_COLORS = ["#0ea5e9", "#10b981", "#a78bfa", "#f59e0b", "#f43f5e", "#22d3ee", "#fb7185", "#84cc16"];

export function SalesByCategoryPanel() {
  const range = rangeFromPreset("30d");
  const { data, loading, error } = useEndpoint("/admin/dashboard/sales-by-category", range, []);

  const slices = (data || []).slice(0, 8);

  return (
    <PanelShell title="Sales by category" subtitle="Paid orders · last 30 days" loading={loading} error={error}>
      {slices.length === 0 && !loading ? (
        <p className="text-xs text-slate-400">No sales in the period.</p>
      ) : (
        <div className="grid gap-3 md:grid-cols-[180px_1fr] md:items-center">
          <div className="h-44 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={slices} dataKey="revenue" nameKey="category_name" innerRadius={40} outerRadius={70} paddingAngle={2}>
                  {slices.map((_, i) => (
                    <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => formatCurrency(value)} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <ul className="space-y-1.5 text-sm">
            {slices.map((s, i) => (
              <li key={s.category_id || s.category_name} className="flex items-center justify-between gap-2">
                <span className="flex items-center gap-2 truncate">
                  <span className="h-2 w-2 rounded-full" style={{ background: PIE_COLORS[i % PIE_COLORS.length] }} />
                  <span className="truncate text-slate-700">{s.category_name}</span>
                </span>
                <span className="font-semibold text-slate-900">{formatCurrency(s.revenue)}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </PanelShell>
  );
}

// -------- Top Customers --------
export function TopCustomersPanel() {
  const range = rangeFromPreset("90d");
  const { data, loading, error } = useEndpoint("/admin/dashboard/top-customers", { ...range, limit: 8 }, []);

  return (
    <PanelShell title="Top customers" subtitle="Paid spend · last 90 days" loading={loading} error={error}>
      <ul className="divide-y divide-slate-100">
        {(data || []).map((c) => (
          <li key={c.id} className="flex items-center justify-between gap-3 py-2">
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-slate-900">{c.name}</p>
              <p className="truncate text-[11px] text-slate-500">{c.email}</p>
            </div>
            <div className="text-right">
              <p className="text-sm font-semibold text-slate-900">{formatCurrency(c.total_spent)}</p>
              <p className="text-[11px] text-slate-500">{formatNumber(c.order_count)} orders</p>
            </div>
          </li>
        ))}
        {!loading && (data || []).length === 0 && <li className="py-2 text-xs text-slate-400">No paying customers yet.</li>}
      </ul>
    </PanelShell>
  );
}

// -------- Payment Analytics --------
export function PaymentAnalyticsPanel() {
  const range = rangeFromPreset("30d");
  const { data, loading, error } = useEndpoint("/admin/dashboard/payment-analytics", range, []);

  return (
    <PanelShell title="Payment analytics" subtitle="Attempts · last 30 days" loading={loading} error={error}>
      <ul className="space-y-2">
        {(data || []).map((m) => (
          <li key={m.payment_method} className="rounded-xl border border-slate-100 p-3">
            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold capitalize text-slate-900">{m.payment_method}</p>
              <p className="text-sm font-semibold text-slate-900">{formatCurrency(m.amount_processed)}</p>
            </div>
            <div className="mt-2 flex flex-wrap gap-2 text-[11px]">
              <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-emerald-700">✓ {m.succeeded}</span>
              <span className="rounded-full bg-amber-50 px-2 py-0.5 text-amber-700">… {m.pending}</span>
              <span className="rounded-full bg-rose-50 px-2 py-0.5 text-rose-700">✗ {m.failed}</span>
              <span className="rounded-full bg-slate-100 px-2 py-0.5 text-slate-600">↺ {m.refunded}</span>
            </div>
          </li>
        ))}
        {!loading && (data || []).length === 0 && <li className="text-xs text-slate-400">No payment attempts yet.</li>}
      </ul>
    </PanelShell>
  );
}
