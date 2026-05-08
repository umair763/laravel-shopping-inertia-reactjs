import React from "react";

export default function Drawer({ title, children, open = true, onClose }) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/40 p-0 sm:p-4">
      <aside className="flex h-full w-full max-w-full flex-col border-slate-200 bg-white shadow-2xl sm:max-w-2xl sm:rounded-l-[2rem] sm:border-l">
        <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
          <h2 className="text-lg font-semibold text-slate-900">{title}</h2>
          {onClose ? (
            <button type="button" onClick={onClose} className="rounded-full border border-slate-200 px-3 py-1.5 text-sm font-medium text-slate-600 transition hover:bg-slate-50">
              Close
            </button>
          ) : null}
        </div>
        <div className="min-h-0 flex-1 overflow-y-auto p-6">{children}</div>
      </aside>
    </div>
  );
}
