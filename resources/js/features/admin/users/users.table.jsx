import React, { useState } from "react";
import ConfirmModal from "../../../shared/ui/modals/confirm.modal.jsx";

export default function UsersTable() {
	const [deleting, setDeleting] = useState(false);

	function handleDelete() {
		setDeleting(false);
		// TODO: call delete user API and refresh
	}

	return (
		<div className="space-y-4">
			<div className="rounded-2xl border border-slate-100 bg-white p-4">
				<div className="flex items-center justify-between">
					<div>
						<p className="text-sm font-semibold">Umair Admin</p>
						<p className="text-xs text-slate-500">umairadmin@gmail.com</p>
					</div>
					<div className="flex gap-2">
						<button className="rounded-xl border border-slate-200 px-3 py-2 text-sm" onClick={() => alert('Edit user - implement form')}>Edit</button>
						<button className="rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700" onClick={() => setDeleting(true)}>Delete</button>
					</div>
				</div>
			</div>

			<ConfirmModal open={deleting} title="Delete user" message="This will permanently delete the user. Continue?" onConfirm={handleDelete} onCancel={() => setDeleting(false)} />
		</div>
	);
}
