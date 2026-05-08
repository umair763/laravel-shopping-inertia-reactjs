import React from "react";

export default function PrimaryButton({ children, className = "", ...props }) {
  return (
    <button
      className={`inline-flex items-center justify-center rounded-full bg-gradient-to-r from-sky-500 via-sky-400 to-cyan-400 px-5 py-3 font-semibold text-white shadow-lg shadow-sky-500/20 transition hover:brightness-105 focus:outline-none focus:ring-4 focus:ring-sky-200 disabled:cursor-not-allowed disabled:opacity-60 ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
