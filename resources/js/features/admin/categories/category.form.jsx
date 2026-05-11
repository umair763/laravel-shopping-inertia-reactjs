import React, { useMemo } from "react";
import { Link, useForm } from "@inertiajs/react";
import TextInput from "../../../shared/ui/inputs/text.input.jsx";
import PrimaryButton from "../../../shared/ui/buttons/primary.button.jsx";
import FileUploader from "../../../shared/ui/inputs/file.uploader.jsx";

export default function CategoryForm({ category = null, catalogues = [], categories = [], preselected_catalogue_id = null }) {
  const isEdit = Boolean(category?.id);
  const form = useForm({
    catalogue_id: category?.catalogue_id || preselected_catalogue_id || "",
    parent_category_id: category?.parent_category_id || "",
    name: category?.name || "",
    description: category?.description || "",
    image: null, // File | null
    image_remove: false,
    _method: isEdit ? "put" : undefined,
  });
  const { data, setData, processing, errors } = form;

  form.transform((d) => ({
    ...d,
    catalogue_id: d.catalogue_id || null,
    parent_category_id: d.parent_category_id || null,
  }));

  const eligibleParents = useMemo(
    () => (data.catalogue_id ? categories.filter((c) => c.catalogue_id === data.catalogue_id) : []),
    [categories, data.catalogue_id],
  );

  function onSubmit(e) {
    e.preventDefault();
    const url = isEdit ? `/admin/categories/${category.id}` : "/admin/categories";
    form.post(url, { forceFormData: true });
  }

  return (
    <section className="space-y-6">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-xs uppercase tracking-[0.24em] text-slate-400">Admin catalog</p>
          <h1 className="text-2xl font-black tracking-tight text-slate-900">{isEdit ? "Edit category" : "New category"}</h1>
        </div>
        <Link className="rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50" href="/admin/categories">
          Back
        </Link>
      </div>

      <form onSubmit={onSubmit} className="space-y-5 rounded-[2rem] border border-slate-100 bg-white p-6 shadow-sm">
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <label className="text-sm font-medium text-zinc-700">Catalogue</label>
            <select
              className="w-full rounded-2xl border border-zinc-200 bg-white px-4 py-3 text-zinc-900 shadow-sm focus:border-sky-400 focus:outline-none focus:ring-4 focus:ring-sky-100"
              value={data.catalogue_id || ""}
              onChange={(e) => setData("catalogue_id", e.target.value)}
              disabled={processing}
            >
              <option value="">— None —</option>
              {catalogues.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
            {errors.catalogue_id && <p className="text-sm text-rose-600">{errors.catalogue_id}</p>}
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-zinc-700">Parent category (optional)</label>
            <select
              className="w-full rounded-2xl border border-zinc-200 bg-white px-4 py-3 text-zinc-900 shadow-sm focus:border-sky-400 focus:outline-none focus:ring-4 focus:ring-sky-100"
              value={data.parent_category_id || ""}
              onChange={(e) => setData("parent_category_id", e.target.value)}
              disabled={processing || !data.catalogue_id}
            >
              <option value="">— Top-level —</option>
              {eligibleParents.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-zinc-700">Name</label>
          <TextInput value={data.name} onChange={(e) => setData("name", e.target.value)} disabled={processing} />
          <p className="text-xs text-slate-500">A URL slug is generated automatically.</p>
          {errors.name && <p className="text-sm text-rose-600">{errors.name}</p>}
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-zinc-700">Description</label>
          <textarea
            className="w-full rounded-2xl border border-zinc-200 bg-white px-4 py-3 text-zinc-900 shadow-sm focus:border-sky-400 focus:outline-none focus:ring-4 focus:ring-sky-100"
            rows={3}
            value={data.description}
            onChange={(e) => setData("description", e.target.value)}
            disabled={processing}
          />
        </div>

        <FileUploader
          label="Image"
          value={data.image}
          onChange={(file) => {
            setData("image", file);
            setData("image_remove", false);
          }}
          previewUrls={data.image ? null : (data.image_remove ? null : category?.image || null)}
          onRemovePreview={() => setData("image_remove", true)}
          error={errors.image}
          disabled={processing}
        />

        <PrimaryButton type="submit" disabled={processing} className="w-full">
          {processing ? "Saving..." : isEdit ? "Save changes" : "Create category"}
        </PrimaryButton>
      </form>
    </section>
  );
}
