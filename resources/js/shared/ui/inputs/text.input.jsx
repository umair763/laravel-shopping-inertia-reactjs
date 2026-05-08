import React from "react";

export default function TextInput({ className = "", ...props }) {
  return <input className={`w-full rounded-2xl border border-zinc-200 bg-white px-4 py-3 text-zinc-900 shadow-sm transition placeholder:text-zinc-400 focus:border-sky-400 focus:outline-none focus:ring-4 focus:ring-sky-100 ${className}`} {...props} />;
}
