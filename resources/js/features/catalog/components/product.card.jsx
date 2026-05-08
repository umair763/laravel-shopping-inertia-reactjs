import React from "react";
import formatPrice from "../../../shared/utils/format.price.js";

export default function ProductCard({ product }) {
  return (
    <article className="group overflow-hidden rounded-[1.75rem] border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
      <div className="aspect-square bg-gradient-to-br from-sky-50 via-white to-stone-50 p-4">
        <div className="flex h-full items-center justify-center rounded-[1.25rem] border border-slate-100 bg-white shadow-inner">
          <div className="h-20 w-20 rounded-full bg-gradient-to-br from-sky-400 via-sky-300 to-cyan-200 opacity-80 blur-0 transition group-hover:scale-105" />
        </div>
      </div>
      <div className="space-y-2 p-4">
        <h3 className="line-clamp-2 text-sm font-semibold text-slate-900">{product?.name}</h3>
        <p className="text-xs text-slate-500">{product?.brand || "Generic"}</p>
        <p className="text-base font-bold text-sky-700">{formatPrice(product?.price || product?.min_price || 0)}</p>
      </div>
    </article>
  );
}

