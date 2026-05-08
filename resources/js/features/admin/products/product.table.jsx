import React, { useState } from "react";
import ConfirmModal from "../../../shared/ui/modals/confirm.modal.jsx";

export default function ProductTable() {
	const [deleting, setDeleting] = useState(false);

	function handleDelete() {
		// placeholder for delete API call
		setDeleting(false);
		// TODO: call API and refresh list
	}

	return (
		<div className="space-y-4">
			<div className="rounded-2xl border border-slate-100 bg-white p-4">
				<div className="flex items-center justify-between">
					<div>
						<p className="text-sm font-semibold">Sample product</p>
						<p className="text-xs text-slate-500">SKU: SAMPLE-001</p>
					</div>
					<div className="flex gap-2">
						<button className="rounded-xl border border-slate-200 px-3 py-2 text-sm" onClick={() => alert('Edit product - implement form')}>Edit</button>
						<button className="rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700" onClick={() => setDeleting(true)}>Delete</button>
					</div>
				</div>
			</div>

			<ConfirmModal open={deleting} title="Delete product" message="This will permanently delete the product. Continue?" onConfirm={handleDelete} onCancel={() => setDeleting(false)} />
		</div>
	);
}
