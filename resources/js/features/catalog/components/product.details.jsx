import React from "react";

export default function ProductDetails({ product }) {
  return (
    <div className="space-y-2">
      <h1 className="text-3xl font-bold">{product?.name}</h1>
      <p className="text-zinc-400">{product?.description}</p>
    </div>
  );
}
