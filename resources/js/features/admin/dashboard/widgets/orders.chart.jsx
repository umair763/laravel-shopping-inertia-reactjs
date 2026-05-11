import React, { useEffect, useMemo, useState } from "react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { getJson, rangeFromPreset, formatCurrency, formatNumber } from "./fetch.js";

const CHART_TYPES = [
  { id: "line", label: "Line" },
  { id: "bar", label: "Bar" },
  { id: "area", label: "Area" },
];

const PRESETS = [
  { id: "7d", label: "7d" },
  { id: "30d", label: "30d" },
  { id: "90d", label: "90d" },
  { id: "ytd", label: "YTD" },
  { id: "1y", label: "1y" },
];

const GRANULARITIES = [
  { id: "day", label: "Daily" },
  { id: "week", label: "Weekly" },
  { id: "month", label: "Monthly" },
  { id: "year", label: "Yearly" },
];

export default function OrdersChart() {
  const [type, setType] = useState("area");
  const [preset, setPreset] = useState("30d");
  const [custom, setCustom] = useState({ start: "", end: "" });
  const [granularity, setGranularity] = useState("day");
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    const range = preset === "custom" && custom.start && custom.end
      ? { startDate: custom.start, endDate: custom.end }
      : rangeFromPreset(preset);

    getJson("/admin/dashboard/orders-chart", { ...range, granularity })
      .then((r) => !cancelled && setData(r.data))
      .catch((e) => !cancelled && setError(e.message))
      .finally(() => !cancelled && setLoading(false));

    return () => {
      cancelled = true;
    };
  }, [preset, custom.start, custom.end, granularity]);

  const series = useMemo(() => {
    if (!data?.labels) return [];
    return data.labels.map((label, i) => ({
      label,
      orders: data.orders?.[i] ?? 0,
      revenue: data.revenue?.[i] ?? 0,
    }));
  }, [data]);

  const Chart = type === "bar" ? BarChart : type === "area" ? AreaChart : LineChart;

  return (
    <section className="space-y-3 rounded-[2rem] border border-slate-100 bg-white p-5 shadow-sm">
      <header className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-base font-semibold text-slate-900">Orders & revenue</h2>
          <p className="text-xs text-slate-500">Aggregated from <code>orders</code> by placement date.</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <div className="inline-flex rounded-full border border-slate-200 bg-white p-0.5 text-xs">
            {CHART_TYPES.map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => setType(t.id)}
                className={`rounded-full px-3 py-1 transition ${
                  type === t.id ? "bg-slate-900 text-white" : "text-slate-600 hover:bg-slate-100"
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>

          <select
            value={granularity}
            onChange={(e) => setGranularity(e.target.value)}
            className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs"
          >
            {GRANULARITIES.map((g) => (
              <option key={g.id} value={g.id}>{g.label}</option>
            ))}
          </select>

          <div className="inline-flex rounded-full border border-slate-200 bg-white p-0.5 text-xs">
            {PRESETS.map((p) => (
              <button
                key={p.id}
                type="button"
                onClick={() => setPreset(p.id)}
                className={`rounded-full px-3 py-1 transition ${
                  preset === p.id ? "bg-slate-900 text-white" : "text-slate-600 hover:bg-slate-100"
                }`}
              >
                {p.label}
              </button>
            ))}
            <button
              type="button"
              onClick={() => setPreset("custom")}
              className={`rounded-full px-3 py-1 transition ${
                preset === "custom" ? "bg-slate-900 text-white" : "text-slate-600 hover:bg-slate-100"
              }`}
            >
              Custom
            </button>
          </div>
        </div>
      </header>

      {preset === "custom" && (
        <div className="flex flex-wrap items-center gap-2 text-xs text-slate-600">
          <label>
            From
            <input
              type="date"
              value={custom.start}
              onChange={(e) => setCustom({ ...custom, start: e.target.value })}
              className="ml-1 rounded-md border border-slate-200 px-2 py-1"
            />
          </label>
          <label>
            To
            <input
              type="date"
              value={custom.end}
              onChange={(e) => setCustom({ ...custom, end: e.target.value })}
              className="ml-1 rounded-md border border-slate-200 px-2 py-1"
            />
          </label>
        </div>
      )}

      <div className="h-[320px] w-full">
        {error ? (
          <div className="grid h-full place-content-center text-sm text-rose-600">{error}</div>
        ) : loading && !data ? (
          <div className="grid h-full place-content-center text-sm text-slate-400">Loading chart…</div>
        ) : series.length === 0 ? (
          <div className="grid h-full place-content-center text-sm text-slate-400">No data in this range.</div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <Chart data={series}>
              <defs>
                <linearGradient id="ordersGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#0ea5e9" stopOpacity={0.4} />
                  <stop offset="100%" stopColor="#0ea5e9" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#10b981" stopOpacity={0.4} />
                  <stop offset="100%" stopColor="#10b981" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="label" tick={{ fontSize: 11, fill: "#475569" }} />
              <YAxis yAxisId="left" tick={{ fontSize: 11, fill: "#475569" }} tickFormatter={formatNumber} />
              <YAxis
                yAxisId="right"
                orientation="right"
                tick={{ fontSize: 11, fill: "#475569" }}
                tickFormatter={(v) => formatCurrency(v).replace(/\.\d+$/, "")}
              />
              <Tooltip
                formatter={(value, key) =>
                  key === "revenue" ? [formatCurrency(value), "Revenue"] : [formatNumber(value), "Orders"]
                }
                contentStyle={{ borderRadius: 12, border: "1px solid #e2e8f0" }}
              />
              <Legend />
              {type === "bar" ? (
                <>
                  <Bar yAxisId="left" dataKey="orders" fill="#0ea5e9" name="Orders" radius={[6, 6, 0, 0]} />
                  <Bar yAxisId="right" dataKey="revenue" fill="#10b981" name="Revenue" radius={[6, 6, 0, 0]} />
                </>
              ) : type === "area" ? (
                <>
                  <Area yAxisId="left" type="monotone" dataKey="orders" stroke="#0ea5e9" fill="url(#ordersGradient)" name="Orders" strokeWidth={2} />
                  <Area yAxisId="right" type="monotone" dataKey="revenue" stroke="#10b981" fill="url(#revenueGradient)" name="Revenue" strokeWidth={2} />
                </>
              ) : (
                <>
                  <Line yAxisId="left" type="monotone" dataKey="orders" stroke="#0ea5e9" strokeWidth={2} name="Orders" dot={false} />
                  <Line yAxisId="right" type="monotone" dataKey="revenue" stroke="#10b981" strokeWidth={2} name="Revenue" dot={false} />
                </>
              )}
            </Chart>
          </ResponsiveContainer>
        )}
      </div>
    </section>
  );
}
