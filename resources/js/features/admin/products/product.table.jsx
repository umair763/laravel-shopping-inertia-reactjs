import React, { useState } from "react";
import { Link, router } from "@inertiajs/react";
import ConfirmModal from "../../../shared/ui/modals/confirm.modal.jsx";

export default function ProductTable({ products }) {
	const [deleting, setDeleting] = useState(false);
	const [selected, setSelected] = useState(null);
	const items = products?.data || products || [];

	function confirmDelete(product) {
		setSelected(product);
		setDeleting(true);
	}

	function handleDelete() {
		if (!selected?.id) return;
		router.delete(`/admin/products/${selected.id}`, {
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
					<h1 className="text-2xl font-black tracking-tight text-slate-900">Products</h1>
				</div>
				<Link className="rounded-full bg-sky-500 px-4 py-2 text-sm font-semibold text-white hover:bg-sky-600" href="/admin/products/create">
					Add product
				</Link>
			</div>

			<div className="overflow-hidden rounded-[2rem] border border-slate-100 bg-white shadow-sm">
				<div className="border-b border-slate-100 px-4 py-4 sm:px-6">
					<p className="text-sm font-semibold text-slate-900">Manage products</p>
					<p className="text-sm text-slate-500">Create, edit, or delete products using standard Laravel + Inertia flows.</p>
				</div>

				{items.length ? (
					<div className="divide-y divide-slate-100">
						{items.map((product) => {
							const variant = product.variants?.[0];
							const price = variant?.discount_price ?? variant?.price;
							const stock = variant?.inventory?.available_quantity ?? variant?.stock_quantity;
							return (
								<div key={product.id} className="flex flex-col gap-3 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
									<div className="min-w-0">
										<p className="text-sm font-semibold text-slate-900">{product.name}</p>
										<p className="mt-0.5 text-xs text-slate-500">
											SKU: {product.sku}
											{product.catalogue?.name ? <span className="ml-2 rounded-full bg-sky-50 px-2 py-0.5 text-[10px] uppercase tracking-wider text-sky-700">{product.catalogue.name}</span> : null}
											{product.category?.name ? <span className="ml-2 rounded-full bg-slate-100 px-2 py-0.5 text-[10px] uppercase tracking-wider text-slate-600">{product.category.name}</span> : null}
											<span className="ml-2 rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] uppercase tracking-wider text-emerald-700">{product.status}</span>
										</p>
									</div>
									<div className="flex items-center gap-4">
										<div className="hidden text-right text-xs text-slate-600 sm:block">
											<p className="font-semibold text-slate-900">{price != null ? `$${Number(price).toFixed(2)}` : "—"}</p>
											<p>Stock: {stock ?? 0}</p>
										</div>
										<div className="flex gap-2">
											<Link className="rounded-xl border border-slate-200 px-3 py-2 text-sm" href={`/admin/products/${product.id}/edit`}>
												Edit
											</Link>
											<button className="rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700" type="button" onClick={() => confirmDelete(product)}>
												Delete
											</button>
										</div>
									</div>
								</div>
							);
						})}
					</div>
				) : (
					<div className="p-6 text-sm text-slate-500">No products yet. <Link href="/admin/products/create" className="font-semibold text-sky-600">Create your first product</Link>.</div>
				)}
			</div>

			<ConfirmModal
				open={deleting}
				title="Delete product"
				message={selected?.name ? `This will permanently delete ${selected.name}. Continue?` : "This will permanently delete the product. Continue?"}
				onConfirm={handleDelete}
				onCancel={() => {
					setDeleting(false);
					setSelected(null);
				}}
			/>
		</section>
	);
}
