import React from "react";

export default function SecondaryButton({ children, className = "", ...props }) {
  return (
    <button
      className={`rounded-lg border border-zinc-700 bg-zinc-900 px-4 py-2 font-semibold text-zinc-100 transition hover:bg-zinc-800 ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
