import React from "react";

export default function ConfirmModal({ open, title = "Confirm action", message = "Are you sure?", onConfirm, onCancel }) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-lg">
        <h3 className="text-lg font-semibold text-slate-900">{title}</h3>
        <p className="mt-3 text-sm text-slate-600">{message}</p>
        <div className="mt-6 flex justify-end gap-3">
          <button type="button" onClick={onCancel} className="rounded-2xl border border-slate-200 bg-white px-4 py-2 text-sm text-slate-700">Cancel</button>
          <button type="button" onClick={onConfirm} className="rounded-2xl bg-rose-600 px-4 py-2 text-sm font-semibold text-white">Confirm</button>
        </div>
      </div>
    </div>
  );
}
