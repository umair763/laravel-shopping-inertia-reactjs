import React from "react";
import useCategories from "../hooks/use.categories.js";

export default function CategorySidebar() {
  const { data } = useCategories();
  const categories = data?.data || [];
  return (
    <aside className="rounded-xl border border-zinc-800 bg-zinc-900 p-4">
      <h3 className="mb-3 text-sm font-semibold">Categories</h3>
      <ul className="space-y-2 text-sm text-zinc-300">{categories.map((c) => <li key={c.id}>{c.name}</li>)}</ul>
    </aside>
  );
}

