import React from "react";
import { Link, useForm } from "@inertiajs/react";
import TextInput from "../../../shared/ui/inputs/text.input.jsx";
import PrimaryButton from "../../../shared/ui/buttons/primary.button.jsx";

export default function ProductEdit({ product, categories = [] }) {
	const { data, setData, put, processing, errors } = useForm({
		name: product?.name || "",
		description: product?.description || "",
		price: product?.price ?? "",
		quantity: product?.quantity ?? "0",
		sku: product?.sku || "",
		category: product?.category || categories[0] || "general",
		image_url: product?.image_url || "",
		is_active: Boolean(product?.is_active),
	});

	function onSubmit(event) {
		event.preventDefault();
		if (!product?.id) return;
		put(`/admin/products/${product.id}`);
	}

	return (
		<section className="space-y-6">
			<div className="flex items-center justify-between gap-3">
				<div>
					<p className="text-xs uppercase tracking-[0.24em] text-slate-400">Admin catalog</p>
					<h1 className="text-2xl font-black tracking-tight text-slate-900">Update product</h1>
				</div>
				<Link className="rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50" href="/admin/products">
					Back
				</Link>
			</div>

			<form onSubmit={onSubmit} className="rounded-[2rem] border border-slate-100 bg-white p-6 shadow-sm space-y-5">
				<div className="space-y-2">
					<label className="text-sm font-medium text-zinc-700">Name</label>
					<TextInput value={data.name} onChange={(e) => setData("name", e.target.value)} disabled={processing} />
					{errors.name ? <p className="text-sm text-rose-600">{errors.name}</p> : null}
				</div>

				<div className="space-y-2">
					<label className="text-sm font-medium text-zinc-700">Description</label>
					<textarea className="w-full rounded-2xl border border-zinc-200 bg-white px-4 py-3 text-zinc-900 shadow-sm transition placeholder:text-zinc-400 focus:border-sky-400 focus:outline-none focus:ring-4 focus:ring-sky-100" rows={5} value={data.description} onChange={(e) => setData("description", e.target.value)} disabled={processing} />
					{errors.description ? <p className="text-sm text-rose-600">{errors.description}</p> : null}
				</div>

				<div className="grid gap-4 md:grid-cols-2">
					<div className="space-y-2">
						<label className="text-sm font-medium text-zinc-700">Price</label>
						<TextInput type="number" step="0.01" value={data.price} onChange={(e) => setData("price", e.target.value)} disabled={processing} />
						{errors.price ? <p className="text-sm text-rose-600">{errors.price}</p> : null}
					</div>
					<div className="space-y-2">
						<label className="text-sm font-medium text-zinc-700">Quantity</label>
						<TextInput type="number" value={data.quantity} onChange={(e) => setData("quantity", e.target.value)} disabled={processing} />
						{errors.quantity ? <p className="text-sm text-rose-600">{errors.quantity}</p> : null}
					</div>
				</div>

				<div className="grid gap-4 md:grid-cols-2">
					<div className="space-y-2">
						<label className="text-sm font-medium text-zinc-700">SKU</label>
						<TextInput value={data.sku} onChange={(e) => setData("sku", e.target.value)} disabled={processing} />
						{errors.sku ? <p className="text-sm text-rose-600">{errors.sku}</p> : null}
					</div>
					<div className="space-y-2">
						<label className="text-sm font-medium text-zinc-700">Category</label>
						<select className="w-full rounded-2xl border border-zinc-200 bg-white px-4 py-3 text-zinc-900 shadow-sm focus:border-sky-400 focus:outline-none focus:ring-4 focus:ring-sky-100" value={data.category} onChange={(e) => setData("category", e.target.value)} disabled={processing}>
							{(categories.length ? categories : ["general"]).map((c) => (
								<option key={c} value={c}>{c}</option>
							))}
						</select>
						{errors.category ? <p className="text-sm text-rose-600">{errors.category}</p> : null}
					</div>
				</div>

				<div className="space-y-2">
					<label className="text-sm font-medium text-zinc-700">Image URL</label>
					<TextInput value={data.image_url} onChange={(e) => setData("image_url", e.target.value)} disabled={processing} />
					{errors.image_url ? <p className="text-sm text-rose-600">{errors.image_url}</p> : null}
				</div>

				<label className="flex items-center gap-2 text-sm text-zinc-600">
					<input type="checkbox" checked={Boolean(data.is_active)} onChange={(e) => setData("is_active", e.target.checked)} disabled={processing} />
					Active
				</label>

				<PrimaryButton type="submit" disabled={processing} className="w-full">
					{processing ? "Saving..." : "Update product"}
				</PrimaryButton>
			</form>
		</section>
	);
}
