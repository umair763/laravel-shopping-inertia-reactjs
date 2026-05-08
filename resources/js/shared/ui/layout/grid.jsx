import React from "react";

export default function Grid({ children, className = "" }) {
  return <div className={`grid gap-4 sm:grid-cols-2 lg:grid-cols-4 ${className}`}>{children}</div>;
}
