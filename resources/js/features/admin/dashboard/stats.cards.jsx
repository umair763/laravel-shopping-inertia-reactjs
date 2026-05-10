import React from "react";

function formatCurrency(value) {
  if (value == null) return "—";
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(value);
}

export default function StatsCards({ stats }) {
  const cards = [
    {
      label: "Total Revenue",
      value: formatCurrency(stats?.total_revenue),
      sub: "All time",
      tone: "from-sky-50 to-white border-sky-100 text-sky-700",
    },
    {
      label: "Total Orders",
      value: stats?.total_orders ?? "—",
      sub: "All time",
      tone: "from-indigo-50 to-white border-indigo-100 text-indigo-700",
    },
    {
      label: "Total Users",
      value: stats?.total_users ?? "—",
      sub: "Registered",
      tone: "from-emerald-50 to-white border-emerald-100 text-emerald-700",
    },
    {
      label: "Pending Orders",
      value: stats?.pending_orders ?? "—",
      sub: "Awaiting fulfilment",
      tone: "from-amber-50 to-white border-amber-100 text-amber-700",
    },
  ];

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {cards.map((card) => (
        <article
          key={card.label}
          className={`rounded-[1.75rem] border bg-gradient-to-br p-5 shadow-sm ${card.tone}`}
        >
          <p className="text-xs uppercase tracking-[0.28em] opacity-70">{card.label}</p>
          <p className="mt-3 text-3xl font-black tracking-tight">{card.value}</p>
          <p className="mt-1 text-xs opacity-60">{card.sub}</p>
        </article>
      ))}
    </div>
  );
}
