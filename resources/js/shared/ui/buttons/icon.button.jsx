import React from "react";

export default function IconButton({ icon, label, className = "", ...props }) {
  return (
    <button className={`inline-flex items-center gap-2 rounded-full bg-zinc-900 p-2 text-zinc-100 ${className}`} {...props}>
      <span>{icon}</span>
      {label ? <span className="text-xs">{label}</span> : null}
    </button>
  );
}
