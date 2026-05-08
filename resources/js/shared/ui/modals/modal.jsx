import React from "react";

export default function Modal({ title, children, onClose }) {
  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/60 p-4">
      <div className="w-full max-w-lg rounded-xl border border-zinc-700 bg-zinc-950 p-4">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-zinc-100">{title}</h2>
          <button onClick={onClose} className="text-zinc-400">x</button>
        </div>
        {children}
      </div>
    </div>
  );
}
