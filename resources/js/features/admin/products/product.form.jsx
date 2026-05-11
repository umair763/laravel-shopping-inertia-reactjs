import React, { useMemo } from "react";
import { Link, useForm } from "@inertiajs/react";
import TextInput from "../../../shared/ui/inputs/text.input.jsx";
import PrimaryButton from "../../../shared/ui/buttons/primary.button.jsx";
import FileUploader from "../../../shared/ui/inputs/file.uploader.jsx";

function defaultVariant(product) {
  const variant = product?.variants?.[0] || {};
  const inventory = variant?.inventory || {};
  // Each existing image becomes a retain-row { existing_url, is_primary, sort_order }.
  const images = (variant?.images || []).map((img) => ({
    image_file: null,
    existing_url: img.image_url || "",
    is_primary: Boolean(img.is_primary),
    sort_order: img.sort_order ?? 0,
  }));

  return {
    variant: {
      name: variant.name || "",
      sku: variant.sku || "",
      price: variant.price ?? "",
      discount_price: variant.discount_price ?? "",
      stock_quantity: variant.stock_quantity ?? 0,
      weight: variant.weight ?? "",
      barcode: variant.barcode || "",
      status: variant.status || "active",
    },
    inventory: {
      available_quantity: inventory.available_quantity ?? "",
      reserved_quantity: inventory.reserved_quantity ?? 0,
      low_stock_threshold: inventory.low_stock_threshold ?? 5,
    },
    images,
  };
}

export default function ProductForm({ product = null, catalogues = [], categories = [] }) {
  const isEdit = Boolean(product?.id);
  const initialVariant = useMemo(() => defaultVariant(product), [product]);

  const form = useForm({
    catalogue_id: product?.catalogue_id || "",
    category_id: product?.category_id || "",
    name: product?.name || "",
    short_description: product?.short_description || "",
    description: product?.description || "",
    brand: product?.brand || "",
    sku: product?.sku || "",
    status: product?.status || "draft",
    is_featured: Boolean(product?.is_featured),
    seo_title: product?.seo_title || "",
    seo_description: product?.seo_description || "",
    variant: initialVariant.variant,
    inventory: initialVariant.inventory,
    images: initialVariant.images,
    _method: isEdit ? "put" : undefined,
  });
  const { data, setData, processing, errors } = form;

  form.transform((d) => ({
    ...d,
    catalogue_id: d.catalogue_id || null,
    category_id: d.category_id || null,
    // Drop empty image rows (neither a new file nor an existing url).
    images: (d.images || []).filter((img) => img.image_file || (img.existing_url && img.existing_url.trim() !== "")),
  }));

  const filteredCategories = useMemo(
    () => (data.catalogue_id ? categories.filter((c) => c.catalogue_id === data.catalogue_id) : categories),
    [categories, data.catalogue_id],
  );

  function setVariantField(field, value) {
    setData("variant", { ...data.variant, [field]: value });
  }
  function setInventoryField(field, value) {
    setData("inventory", { ...data.inventory, [field]: value });
  }
  function setImageRow(idx, patch) {
    const next = [...data.images];
    next[idx] = { ...next[idx], ...patch };
    if (patch.is_primary) {
      next.forEach((img, i) => (next[i] = { ...img, is_primary: i === idx }));
    }
    setData("images", next);
  }
  function addImageRow() {
    setData("images", [
      ...data.images,
      { image_file: null, existing_url: "", is_primary: data.images.length === 0, sort_order: data.images.length },
    ]);
  }
  function removeImageRow(idx) {
    const next = data.images.filter((_, i) => i !== idx);
    // Ensure at least one row is marked primary if any rows remain.
    if (next.length && !next.some((img) => img.is_primary)) {
      next[0] = { ...next[0], is_primary: true };
    }
    setData("images", next);
  }

  function onSubmit(e) {
    e.preventDefault();
    const url = isEdit ? `/admin/products/${product.id}` : "/admin/products";
    form.post(url, { forceFormData: true });
  }

  const fieldErr = (path) => errors?.[path];

  return (
    <section className="space-y-6">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-xs uppercase tracking-[0.24em] text-slate-400">Admin catalog</p>
          <h1 className="text-2xl font-black tracking-tight text-slate-900">{isEdit ? "Edit product" : "New product"}</h1>
          <p className="mt-1 text-sm text-slate-500">Capture catalogue, category, core product details, default variant, inventory, and images in one step.</p>
        </div>
        <Link className="rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50" href="/admin/products">
          Back
        </Link>
      </div>

      <form onSubmit={onSubmit} className="space-y-6">
        {/* Placement */}
        <section className="space-y-4 rounded-[2rem] border border-slate-100 bg-white p-6 shadow-sm">
          <header className="space-y-1">
            <h2 className="text-base font-semibold text-slate-900">Placement</h2>
            <p className="text-sm text-slate-500">Pick the catalogue and category this product lives in.</p>
          </header>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <label className="text-sm font-medium text-zinc-700">Catalogue</label>
              <select
                className="w-full rounded-2xl border border-zinc-200 bg-white px-4 py-3 text-zinc-900 shadow-sm focus:border-sky-400 focus:outline-none focus:ring-4 focus:ring-sky-100"
                value={data.catalogue_id || ""}
                onChange={(e) => { setData("catalogue_id", e.target.value); setData("category_id", ""); }}
                disabled={processing}
              >
                <option value="">— None —</option>
                {catalogues.map((c) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
              {fieldErr("catalogue_id") && <p className="text-sm text-rose-600">{fieldErr("catalogue_id")}</p>}
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-zinc-700">Category</label>
              <select
                className="w-full rounded-2xl border border-zinc-200 bg-white px-4 py-3 text-zinc-900 shadow-sm focus:border-sky-400 focus:outline-none focus:ring-4 focus:ring-sky-100"
                value={data.category_id || ""}
                onChange={(e) => setData("category_id", e.target.value)}
                disabled={processing}
              >
                <option value="">— None —</option>
                {filteredCategories.map((c) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
              {fieldErr("category_id") && <p className="text-sm text-rose-600">{fieldErr("category_id")}</p>}
            </div>
          </div>
        </section>

        {/* Details */}
        <section className="space-y-4 rounded-[2rem] border border-slate-100 bg-white p-6 shadow-sm">
          <header className="space-y-1">
            <h2 className="text-base font-semibold text-slate-900">Product details</h2>
          </header>

          <div className="space-y-2">
            <label className="text-sm font-medium text-zinc-700">Name</label>
            <TextInput value={data.name} onChange={(e) => setData("name", e.target.value)} disabled={processing} />
            <p className="text-xs text-slate-500">A URL slug is generated automatically from the name.</p>
            {fieldErr("name") && <p className="text-sm text-rose-600">{fieldErr("name")}</p>}
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <label className="text-sm font-medium text-zinc-700">Brand</label>
              <TextInput value={data.brand} onChange={(e) => setData("brand", e.target.value)} disabled={processing} />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-zinc-700">SKU (product-level)</label>
              <TextInput value={data.sku} onChange={(e) => setData("sku", e.target.value)} disabled={processing} />
              {fieldErr("sku") && <p className="text-sm text-rose-600">{fieldErr("sku")}</p>}
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-zinc-700">Short description</label>
            <TextInput value={data.short_description} onChange={(e) => setData("short_description", e.target.value)} disabled={processing} />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-zinc-700">Description</label>
            <textarea
              className="w-full rounded-2xl border border-zinc-200 bg-white px-4 py-3 text-zinc-900 shadow-sm focus:border-sky-400 focus:outline-none focus:ring-4 focus:ring-sky-100"
              rows={5}
              value={data.description}
              onChange={(e) => setData("description", e.target.value)}
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
                <option value="draft">Draft</option>
                <option value="active">Active</option>
                <option value="archived">Archived</option>
              </select>
            </div>
            <label className="flex items-center gap-2 self-end text-sm text-zinc-700">
              <input type="checkbox" checked={Boolean(data.is_featured)} onChange={(e) => setData("is_featured", e.target.checked)} disabled={processing} />
              Feature this product
            </label>
          </div>
        </section>

        {/* Default variant */}
        <section className="space-y-4 rounded-[2rem] border border-slate-100 bg-white p-6 shadow-sm">
          <header className="space-y-1">
            <h2 className="text-base font-semibold text-slate-900">Default variant</h2>
            <p className="text-sm text-slate-500">Price, SKU and stock for the primary buyable variant.</p>
          </header>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <label className="text-sm font-medium text-zinc-700">Variant name (optional)</label>
              <TextInput value={data.variant.name} onChange={(e) => setVariantField("name", e.target.value)} disabled={processing} />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-zinc-700">Variant SKU</label>
              <TextInput value={data.variant.sku} onChange={(e) => setVariantField("sku", e.target.value)} disabled={processing} />
              {fieldErr("variant.sku") && <p className="text-sm text-rose-600">{fieldErr("variant.sku")}</p>}
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <div className="space-y-2">
              <label className="text-sm font-medium text-zinc-700">Price</label>
              <TextInput type="number" step="0.01" value={data.variant.price} onChange={(e) => setVariantField("price", e.target.value)} disabled={processing} />
              {fieldErr("variant.price") && <p className="text-sm text-rose-600">{fieldErr("variant.price")}</p>}
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-zinc-700">Discount price</label>
              <TextInput type="number" step="0.01" value={data.variant.discount_price} onChange={(e) => setVariantField("discount_price", e.target.value)} disabled={processing} />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-zinc-700">Stock quantity</label>
              <TextInput type="number" value={data.variant.stock_quantity} onChange={(e) => setVariantField("stock_quantity", e.target.value)} disabled={processing} />
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <div className="space-y-2">
              <label className="text-sm font-medium text-zinc-700">Weight</label>
              <TextInput type="number" step="0.01" value={data.variant.weight} onChange={(e) => setVariantField("weight", e.target.value)} disabled={processing} />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-zinc-700">Barcode</label>
              <TextInput value={data.variant.barcode} onChange={(e) => setVariantField("barcode", e.target.value)} disabled={processing} />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-zinc-700">Variant status</label>
              <select
                className="w-full rounded-2xl border border-zinc-200 bg-white px-4 py-3 text-zinc-900 shadow-sm focus:border-sky-400 focus:outline-none focus:ring-4 focus:ring-sky-100"
                value={data.variant.status}
                onChange={(e) => setVariantField("status", e.target.value)}
                disabled={processing}
              >
                <option value="active">Active</option>
                <option value="draft">Draft</option>
                <option value="archived">Archived</option>
              </select>
            </div>
          </div>
        </section>

        {/* Inventory */}
        <section className="space-y-4 rounded-[2rem] border border-slate-100 bg-white p-6 shadow-sm">
          <header className="space-y-1">
            <h2 className="text-base font-semibold text-slate-900">Inventory</h2>
            <p className="text-sm text-slate-500">Defaults to the variant stock quantity if left blank.</p>
          </header>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="space-y-2">
              <label className="text-sm font-medium text-zinc-700">Available quantity</label>
              <TextInput type="number" value={data.inventory.available_quantity} onChange={(e) => setInventoryField("available_quantity", e.target.value)} disabled={processing} />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-zinc-700">Reserved quantity</label>
              <TextInput type="number" value={data.inventory.reserved_quantity} onChange={(e) => setInventoryField("reserved_quantity", e.target.value)} disabled={processing} />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-zinc-700">Low stock threshold</label>
              <TextInput type="number" value={data.inventory.low_stock_threshold} onChange={(e) => setInventoryField("low_stock_threshold", e.target.value)} disabled={processing} />
            </div>
          </div>
        </section>

        {/* Images */}
        <section className="space-y-4 rounded-[2rem] border border-slate-100 bg-white p-6 shadow-sm">
          <header className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-semibold text-slate-900">Images</h2>
              <p className="text-sm text-slate-500">Upload product photos. Mark one as primary for the storefront.</p>
            </div>
            <button type="button" onClick={addImageRow} className="rounded-2xl border border-slate-200 px-3 py-2 text-sm">+ Add image</button>
          </header>
          <div className="space-y-4">
            {data.images.length === 0 && (
              <p className="text-sm text-slate-500">No images yet. Click "+ Add image" to upload one.</p>
            )}
            {data.images.map((img, idx) => (
              <div key={idx} className="space-y-3 rounded-2xl border border-slate-100 p-4">
                <FileUploader
                  value={img.image_file || null}
                  onChange={(file) => setImageRow(idx, { image_file: file })}
                  previewUrls={img.image_file ? null : (img.existing_url || null)}
                  onRemovePreview={() => setImageRow(idx, { existing_url: "" })}
                  hint="Drop or choose a single image for this slot."
                  disabled={processing}
                />
                <div className="flex items-center justify-between gap-3">
                  <label className="flex items-center gap-1 text-xs text-slate-600">
                    <input
                      type="radio"
                      name="primary_image"
                      checked={Boolean(img.is_primary)}
                      onChange={() => setImageRow(idx, { is_primary: true })}
                      disabled={processing}
                    />
                    Primary image
                  </label>
                  <button
                    type="button"
                    onClick={() => removeImageRow(idx)}
                    className="rounded-xl border border-rose-200 bg-rose-50 px-3 py-1.5 text-xs text-rose-700"
                  >
                    Remove slot
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>

        <PrimaryButton type="submit" disabled={processing} className="w-full">
          {processing ? "Saving..." : isEdit ? "Save changes" : "Create product"}
        </PrimaryButton>
      </form>
    </section>
  );
}
