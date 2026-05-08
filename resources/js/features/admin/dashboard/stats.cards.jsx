import React from "react";

export default function StatsCards() {
  return <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">{["Revenue", "Orders", "Users", "AOV"].map((x) => <div key={x} className="rounded-xl border border-zinc-800 bg-zinc-900 p-4">{x}</div>)}</div>;
}
