import React, { useState } from "react";
import { Link, router } from "@inertiajs/react";
import ConfirmModal from "../../../shared/ui/modals/confirm.modal.jsx";

export default function CategoriesTable({ categories = [], catalogues = [] }) {
  const [deleting, setDeleting] = useState(false);
  const [selected, setSelected] = useState(null);
  const [filter, setFilter] = useState("");

  const filtered = filter ? categories.filter((c) => c.catalogue_id === filter) : categories;

  function confirmDelete(category) {
    setSelected(category);
    setDeleting(true);
  }

  function handleDelete() {
    if (!selected?.id) return;
    router.delete(`/admin/categories/${selected.id}`, {
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
          <h1 className="text-2xl font-black tracking-tight text-slate-900">Categories</h1>
          <p className="mt-1 text-sm text-slate-500">Subdivisions within a catalogue. Products belong to a category.</p>
        </div>
        <Link
          className="rounded-full bg-sky-500 px-4 py-2 text-sm font-semibold text-white hover:bg-sky-600"
          href="/admin/categories/create"
        >
          New category
        </Link>
      </div>

      {catalogues.length > 0 && (
        <div className="flex items-center gap-3">
          <label className="text-xs uppercase tracking-[0.2em] text-slate-500">Filter by catalogue</label>
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="rounded-2xl border border-slate-200 bg-white px-3 py-2 text-sm"
          >
            <option value="">All catalogues</option>
            {catalogues.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>
      )}

      <div className="overflow-hidden rounded-[2rem] border border-slate-100 bg-white shadow-sm">
        {filtered.length ? (
          <div className="divide-y divide-slate-100">
            {filtered.map((c) => (
              <div key={c.id} className="flex flex-col gap-3 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
                <div>
                  <p className="text-sm font-semibold text-slate-900">{c.name}</p>
                  <p className="text-xs text-slate-500">
                    /{c.slug}
                    {c.catalogue?.name ? (
                      <span className="ml-2 rounded-full bg-sky-50 px-2 py-0.5 text-[10px] uppercase tracking-wider text-sky-700">
                        {c.catalogue.name}
                      </span>
                    ) : null}
                  </p>
                </div>
                <div className="flex gap-2">
                  <Link className="rounded-xl border border-slate-200 px-3 py-2 text-sm" href={`/admin/categories/${c.id}/edit`}>
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
          <div className="p-6 text-sm text-slate-500">
            {categories.length === 0 ? "No categories yet. Create one to organize products." : "No categories match this filter."}
          </div>
        )}
      </div>

      <ConfirmModal
        open={deleting}
        title="Delete category"
        message={selected?.name ? `Permanently delete ${selected.name}?` : "Permanently delete this category?"}
        onConfirm={handleDelete}
        onCancel={() => {
          setDeleting(false);
          setSelected(null);
        }}
      />
    </section>
  );
}
