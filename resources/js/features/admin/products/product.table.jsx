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
						{items.map((product) => (
							<div key={product.id} className="flex flex-col gap-3 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
								<div>
									<p className="text-sm font-semibold text-slate-900">{product.name}</p>
									<p className="text-xs text-slate-500">SKU: {product.sku}</p>
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
						))}
					</div>
				) : (
					<div className="p-6 text-sm text-slate-500">No products found.</div>
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
