import React, { useEffect, useState } from "react";
import { Link } from "@inertiajs/react";
import { getJson, rangeFromPreset, formatCurrency, formatNumber } from "./fetch.js";

const LIMITS = [
  { id: 5, label: "Top 5" },
  { id: 10, label: "Top 10" },
  { id: 20, label: "Top 20" },
];

const SORTS = [
  { id: "best_selling", label: "Best selling" },
  { id: "most_reviewed", label: "Most reviewed" },
  { id: "most_viewed", label: "Most viewed", coming: true },
  { id: "most_wishlisted", label: "Most wishlisted", coming: true },
];

const PERIODS = [
  { id: "7d", label: "Daily (7d)" },
  { id: "30d", label: "Weekly (30d)" },
  { id: "90d", label: "Monthly (90d)" },
  { id: "1y", label: "Yearly" },
  { id: "custom", label: "Custom" },
];

export default function TrendingProducts() {
  const [limit, setLimit] = useState(10);
  const [customLimit, setCustomLimit] = useState(10);
  const [sort, setSort] = useState("best_selling");
  const [period, setPeriod] = useState("30d");
  const [custom, setCustom] = useState({ start: "", end: "" });
  const [rows, setRows] = useState([]);
  const [meta, setMeta] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    const range = period === "custom" && custom.start && custom.end
      ? { startDate: custom.start, endDate: custom.end }
      : rangeFromPreset(period);

    getJson("/admin/dashboard/trending-products", { ...range, limit, sort })
      .then((r) => {
        if (cancelled) return;
        setRows(r.data || []);
        setMeta(r.meta || null);
      })
      .catch((e) => !cancelled && setError(e.message))
      .finally(() => !cancelled && setLoading(false));

    return () => {
      cancelled = true;
    };
  }, [limit, sort, period, custom.start, custom.end]);

  return (
    <section className="space-y-3 rounded-[2rem] border border-slate-100 bg-white p-5 shadow-sm">
      <header className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-base font-semibold text-slate-900">Trending products</h2>
          <p className="text-xs text-slate-500">
            {meta?.unsupported_sort
              ? "This sort is coming soon — showing best-selling as a fallback."
              : "Live from completed orders & reviews."}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <select value={sort} onChange={(e) => setSort(e.target.value)} className="rounded-full border border-slate-200 bg-white px-3 py-1">
            {SORTS.map((s) => (
              <option key={s.id} value={s.id}>
                {s.label}{s.coming ? " (soon)" : ""}
              </option>
            ))}
          </select>
          <select value={period} onChange={(e) => setPeriod(e.target.value)} className="rounded-full border border-slate-200 bg-white px-3 py-1">
            {PERIODS.map((p) => (
              <option key={p.id} value={p.id}>{p.label}</option>
            ))}
          </select>
          <div className="inline-flex rounded-full border border-slate-200 bg-white p-0.5">
            {LIMITS.map((l) => (
              <button
                key={l.id}
                type="button"
                onClick={() => setLimit(l.id)}
                className={`rounded-full px-3 py-1 transition ${
                  limit === l.id ? "bg-slate-900 text-white" : "text-slate-600 hover:bg-slate-100"
                }`}
              >
                {l.label}
              </button>
            ))}
            <label className="flex items-center gap-1 px-2 text-slate-600">
              N
              <input
                type="number"
                min={1}
                max={100}
                value={customLimit}
                onChange={(e) => setCustomLimit(Math.max(1, Math.min(100, Number(e.target.value || 1))))}
                onBlur={() => setLimit(customLimit)}
                className="w-12 rounded-md border border-slate-200 px-1 py-0.5 text-center"
              />
            </label>
          </div>
        </div>
      </header>

      {period === "custom" && (
        <div className="flex flex-wrap items-center gap-2 text-xs text-slate-600">
          <label>
            From
            <input type="date" value={custom.start} onChange={(e) => setCustom({ ...custom, start: e.target.value })} className="ml-1 rounded-md border border-slate-200 px-2 py-1" />
          </label>
          <label>
            To
            <input type="date" value={custom.end} onChange={(e) => setCustom({ ...custom, end: e.target.value })} className="ml-1 rounded-md border border-slate-200 px-2 py-1" />
          </label>
        </div>
      )}

      {error && <p className="text-sm text-rose-600">{error}</p>}

      <div className="overflow-hidden rounded-2xl border border-slate-100">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 text-[11px] uppercase tracking-wider text-slate-500">
            <tr>
              <th className="px-3 py-2 text-left">Product</th>
              <th className="px-3 py-2 text-left">Category</th>
              <th className="px-3 py-2 text-right">Stock</th>
              <th className="px-3 py-2 text-right">Sold</th>
              <th className="px-3 py-2 text-right">Revenue</th>
              <th className="px-3 py-2 text-right">Rating</th>
              <th className="px-3 py-2 text-right">Trend</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {loading && rows.length === 0 ? (
              <tr><td colSpan={7} className="px-3 py-6 text-center text-xs text-slate-400">Loading…</td></tr>
            ) : rows.length === 0 ? (
              <tr><td colSpan={7} className="px-3 py-6 text-center text-xs text-slate-400">No products in this period.</td></tr>
            ) : (
              rows.map((p) => (
                <tr key={p.id} className="hover:bg-slate-50">
                  <td className="px-3 py-2">
                    <Link href={`/admin/products/${p.id}/edit`} className="flex items-center gap-3">
                      {p.image_url ? (
                        <img src={p.image_url} alt={p.name} className="h-10 w-10 rounded-lg object-cover" />
                      ) : (
                        <div className="h-10 w-10 rounded-lg bg-slate-100" />
                      )}
                      <div>
                        <p className="font-semibold text-slate-900">{p.name}</p>
                        <p className="text-[11px] text-slate-500">SKU: {p.sku}</p>
                      </div>
                    </Link>
                  </td>
                  <td className="px-3 py-2 text-slate-600">{p.category || "—"}</td>
                  <td className={`px-3 py-2 text-right ${p.stock <= 0 ? "text-rose-600 font-semibold" : "text-slate-700"}`}>
                    {formatNumber(p.stock)}
                  </td>
                  <td className="px-3 py-2 text-right text-slate-700">{formatNumber(p.units_sold)}</td>
                  <td className="px-3 py-2 text-right font-semibold text-slate-900">{formatCurrency(p.revenue)}</td>
                  <td className="px-3 py-2 text-right text-slate-700">
                    {p.review_count > 0 ? `${p.rating.toFixed(1)} ★ (${p.review_count})` : "—"}
                  </td>
                  <td className="px-3 py-2 text-right">
                    <span
                      className={`inline-flex rounded-full px-2 py-0.5 text-[11px] font-semibold ${
                        p.trend_percentage > 0
                          ? "bg-emerald-50 text-emerald-700"
                          : p.trend_percentage < 0
                            ? "bg-rose-50 text-rose-700"
                            : "bg-slate-100 text-slate-600"
                      }`}
                    >
                      {p.trend_percentage > 0 ? "▲" : p.trend_percentage < 0 ? "▼" : "·"}{" "}
                      {Math.abs(p.trend_percentage).toFixed(1)}%
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}
