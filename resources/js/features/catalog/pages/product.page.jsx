import React from "react";
import { useParams } from "react-router-dom";
import useProduct from "../hooks/use.product.js";
import ProductDetails from "../components/product.details.jsx";
import Container from "../../../shared/ui/layout/container.jsx";

export default function ProductPage() {
  const { slug } = useParams();
  const { data, isLoading } = useProduct(slug);
  const product = data?.data || data;

  return <Container>{isLoading ? <p>Loading...</p> : <ProductDetails product={product} />}</Container>;
}

