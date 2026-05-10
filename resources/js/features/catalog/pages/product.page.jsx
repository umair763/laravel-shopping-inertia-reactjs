import React from "react";
import ProductDetails from "../components/product.details.jsx";
import Container from "../../../shared/ui/layout/container.jsx";
import StoreLayout from "../../../layouts/store.layout.jsx";

export default function ProductPage({ product }) {
  return <Container><ProductDetails product={product} /></Container>;
}

ProductPage.layout = (page) => <StoreLayout>{page}</StoreLayout>;

