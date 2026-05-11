import React, { useState } from "react";
import { Link, router } from "@inertiajs/react";
import ConfirmModal from "../../../shared/ui/modals/confirm.modal.jsx";

export default function CataloguesTable({ catalogues = [] }) {
  const [deleting, setDeleting] = useState(false);
  const [selected, setSelected] = useState(null);

  function confirmDelete(catalogue) {
    setSelected(catalogue);
    setDeleting(true);
  }

  function handleDelete() {
    if (!selected?.id) return;
    router.delete(`/admin/catalogues/${selected.id}`, {
      onFinish: () => {
        setDeleting(false);
        setSelected(null);
      },
    });
  }

  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-xs uppercase tracking-[0.24em] text-slate-400">Admin catalog</p>
          <h1 className="text-2xl font-black tracking-tight text-slate-900">Catalogues</h1>
          <p className="mt-1 text-sm text-slate-500">Top-level groupings that organize categories and products.</p>
        </div>
        <Link
          className="rounded-full bg-sky-500 px-4 py-2 text-sm font-semibold text-white hover:bg-sky-600"
          href="/admin/catalogues/create"
        >
          New catalogue
        </Link>
      </div>

      <div className="overflow-hidden rounded-[2rem] border border-slate-100 bg-white shadow-sm">
        {catalogues.length ? (
          <div className="divide-y divide-slate-100">
            {catalogues.map((c) => (
              <div key={c.id} className="flex flex-col gap-3 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
                <div>
                  <p className="text-sm font-semibold text-slate-900">{c.name}</p>
                  <p className="text-xs text-slate-500">
                    /{c.slug}
                    {c.status ? <span className="ml-2 rounded-full bg-slate-100 px-2 py-0.5 text-[10px] uppercase tracking-wider text-slate-600">{c.status}</span> : null}
                    {c.is_featured ? <span className="ml-2 rounded-full bg-amber-50 px-2 py-0.5 text-[10px] uppercase tracking-wider text-amber-700">Featured</span> : null}
                  </p>
                </div>
                <div className="flex gap-2">
                  <Link className="rounded-xl border border-slate-200 px-3 py-2 text-sm" href={`/admin/categories/create?catalogue_id=${c.id}`}>
                    Add category
                  </Link>
                  <Link className="rounded-xl border border-slate-200 px-3 py-2 text-sm" href={`/admin/catalogues/${c.id}/edit`}>
                    Edit
                  </Link>
                  <button
                    type="button"
                    onClick={() => confirmDelete(c)}
                    className="rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-6 text-sm text-slate-500">No catalogues yet. Create your first one to start building the catalog.</div>
        )}
      </div>

      <ConfirmModal
        open={deleting}
        title="Delete catalogue"
        message={selected?.name ? `Permanently delete ${selected.name}? Categories and products under it may be affected.` : "Permanently delete this catalogue?"}
        onConfirm={handleDelete}
        onCancel={() => {
          setDeleting(false);
          setSelected(null);
        }}
      />
    </section>
  );
}
