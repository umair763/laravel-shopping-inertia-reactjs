import React from "react";
import ProductGrid from "../components/product.grid.jsx";
import ProductFilters from "../components/product.filters.jsx";
import Container from "../../../shared/ui/layout/container.jsx";

export default function ProductListPage() {
  return (
    <Container className="space-y-4">
      <ProductFilters />
      <ProductGrid />
    </Container>
  );
}
