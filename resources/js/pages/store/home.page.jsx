import React from "react";
import ProductGrid from "../../features/catalog/components/product.grid.jsx";

export default function HomePage() {
  return (
    <section className="space-y-6">
      <div className="mx-auto max-w-7xl rounded-[2rem] border border-slate-200 bg-gradient-to-r from-sky-500 via-sky-400 to-cyan-400 p-8 text-white shadow-sm lg:p-10">
        <h1 className="text-3xl font-black tracking-tight sm:text-4xl">Modern shopping, simplified.</h1>
        <p className="mt-2 max-w-xl text-sm leading-6 text-white/90">Browse a cleaner storefront with a modern SaaS feel, faster navigation, and fewer distractions.</p>
      </div>
      <ProductGrid />
    </section>
  );
}
