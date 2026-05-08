import React from "react";

export default function SelectInput({ children, className = "", ...props }) {
  return <select className={`w-full rounded-2xl border border-zinc-200 bg-white px-4 py-3 text-zinc-900 shadow-sm transition focus:border-sky-400 focus:outline-none focus:ring-4 focus:ring-sky-100 ${className}`} {...props}>{children}</select>;
}
