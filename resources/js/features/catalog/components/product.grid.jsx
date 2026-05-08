import React from "react";
import useProducts from "../hooks/use.products.js";
import ProductCard from "./product.card.jsx";
import Container from "../../../shared/ui/layout/container.jsx";

export default function ProductGrid() {
  const { data, isLoading } = useProducts();
  const items = data?.data || data?.products || [];

  return (
    <Container>
      {isLoading ? <p className="text-zinc-400">Loading products...</p> : null}
      <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-5">
        {items.map((p) => <ProductCard key={p.id || p.slug} product={p} />)}
      </div>
    </Container>
  );
}

