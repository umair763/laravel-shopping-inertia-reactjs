import React from "react";

export default function CartItem({ item }) {
  return <div className="rounded-lg border border-zinc-800 p-3 text-sm">{item?.name || "Cart item"}</div>;
}
