import React from "react";
import { Link, useForm, router } from "@inertiajs/react";
import TextInput from "../../../shared/ui/inputs/text.input.jsx";
import PrimaryButton from "../../../shared/ui/buttons/primary.button.jsx";
import FileUploader from "../../../shared/ui/inputs/file.uploader.jsx";

export default function CatalogueForm({ catalogue = null }) {
  const isEdit = Boolean(catalogue?.id);
  const { data, setData, post, processing, errors } = useForm({
    name: catalogue?.name || "",
    description: catalogue?.description || "",
    icon: null, // File | null (new upload)
    cover_image: null, // File | null
    icon_remove: false,
    cover_image_remove: false,
    is_featured: Boolean(catalogue?.is_featured),
    sort_order: catalogue?.sort_order ?? 0,
    status: catalogue?.status || "active",
    _method: isEdit ? "put" : undefined, // Laravel method spoofing for multipart updates
  });

  function onSubmit(e) {
    e.preventDefault();
    const url = isEdit ? `/admin/catalogues/${catalogue.id}` : "/admin/catalogues";
    // Always POST + forceFormData so files travel as multipart. For edits we
    // rely on Laravel's _method=put spoofing (set above) since browsers can't
    // PUT multipart natively.
    post(url, { forceFormData: true });
  }

  return (
    <section className="space-y-6">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-xs uppercase tracking-[0.24em] text-slate-400">Admin catalog</p>
          <h1 className="text-2xl font-black tracking-tight text-slate-900">{isEdit ? "Edit catalogue" : "New catalogue"}</h1>
        </div>
        <Link className="rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50" href="/admin/catalogues">
          Back
        </Link>
      </div>

      <form onSubmit={onSubmit} className="space-y-5 rounded-[2rem] border border-slate-100 bg-white p-6 shadow-sm">
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <label className="text-sm font-medium text-zinc-700">Name</label>
            <TextInput value={data.name} onChange={(e) => setData("name", e.target.value)} disabled={processing} />
            <p className="text-xs text-slate-500">A URL slug is generated automatically.</p>
            {errors.name && <p className="text-sm text-rose-600">{errors.name}</p>}
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-zinc-700">Sort order</label>
            <TextInput type="number" value={data.sort_order} onChange={(e) => setData("sort_order", e.target.value)} disabled={processing} />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-zinc-700">Description</label>
          <textarea
            className="w-full rounded-2xl border border-zinc-200 bg-white px-4 py-3 text-zinc-900 shadow-sm focus:border-sky-400 focus:outline-none focus:ring-4 focus:ring-sky-100"
            rows={4}
            value={data.description}
            onChange={(e) => setData("description", e.target.value)}
            disabled={processing}
          />
          {errors.description && <p className="text-sm text-rose-600">{errors.description}</p>}
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <FileUploader
            label="Icon"
            value={data.icon}
            onChange={(file) => {
              setData("icon", file);
              setData("icon_remove", false);
            }}
            previewUrls={data.icon ? null : (data.icon_remove ? null : catalogue?.icon || null)}
            onRemovePreview={() => setData("icon_remove", true)}
            hint="Small square icon (PNG/SVG recommended)."
            error={errors.icon}
            disabled={processing}
          />
          <FileUploader
            label="Cover image"
            value={data.cover_image}
            onChange={(file) => {
              setData("cover_image", file);
              setData("cover_image_remove", false);
            }}
            previewUrls={data.cover_image ? null : (data.cover_image_remove ? null : catalogue?.cover_image || null)}
            onRemovePreview={() => setData("cover_image_remove", true)}
            hint="Wide banner image for catalogue header."
            error={errors.cover_image}
            disabled={processing}
          />
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <label className="text-sm font-medium text-zinc-700">Status</label>
            <select
              className="w-full rounded-2xl border border-zinc-200 bg-white px-4 py-3 text-zinc-900 shadow-sm focus:border-sky-400 focus:outline-none focus:ring-4 focus:ring-sky-100"
              value={data.status}
              onChange={(e) => setData("status", e.target.value)}
              disabled={processing}
            >
              <option value="active">Active</option>
              <option value="draft">Draft</option>
              <option value="archived">Archived</option>
            </select>
          </div>
          <label className="flex items-center gap-2 text-sm text-zinc-700">
            <input
              type="checkbox"
              checked={Boolean(data.is_featured)}
              onChange={(e) => setData("is_featured", e.target.checked)}
              disabled={processing}
            />
            Featured
          </label>
        </div>

        <PrimaryButton type="submit" disabled={processing} className="w-full">
          {processing ? "Saving..." : isEdit ? "Save changes" : "Create catalogue"}
        </PrimaryButton>
      </form>
    </section>
  );
}
