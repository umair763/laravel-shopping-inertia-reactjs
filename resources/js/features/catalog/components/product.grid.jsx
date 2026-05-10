import React from "react";
import ProductCard from "./product.card.jsx";
import Container from "../../../shared/ui/layout/container.jsx";

export default function ProductGrid({ products }) {
  const items = products?.data || products || [];

  return (
    <Container>
      <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-5">
        {items.map((p) => <ProductCard key={p.id || p.slug} product={p} />)}
      </div>
    </Container>
  );
}

