import React, { useMemo } from "react";
import { Link } from "@inertiajs/react";

const statusLabelClasses = {
	pending: "bg-amber-50 text-amber-700 border-amber-200",
	processing: "bg-sky-50 text-sky-700 border-sky-200",
	shipped: "bg-indigo-50 text-indigo-700 border-indigo-200",
	delivered: "bg-emerald-50 text-emerald-700 border-emerald-200",
	cancelled: "bg-rose-50 text-rose-700 border-rose-200",
	returned: "bg-zinc-100 text-zinc-700 border-zinc-200",
};

function formatCurrency(value) {
	const amount = Number(value || 0);
	return new Intl.NumberFormat("en-PK", { style: "currency", currency: "PKR", maximumFractionDigits: 2 }).format(amount);
}

function formatDate(value) {
	if (!value) return "—";
	const date = new Date(value);
	return Number.isNaN(date.getTime()) ? value : date.toLocaleString();
}

export default function OrdersTable({ orders }) {
	const items = orders?.data || orders || [];

	const statusSummary = useMemo(() => {
		return items.reduce((summary, order) => {
			const key = order.order_status || "pending";
			summary[key] = (summary[key] || 0) + 1;
			return summary;
		}, {});
	}, [items]);

	return (
		<section className="space-y-6">
			<div className="rounded-[2rem] border border-sky-100 bg-white p-6 shadow-sm">
				<div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
					<div className="space-y-2">
						<p className="text-[10px] uppercase tracking-[0.3em] text-sky-500">Admin orders</p>
						<h1 className="text-3xl font-black tracking-tight text-slate-900">Order management</h1>
						<p className="max-w-2xl text-sm leading-6 text-slate-600">Review customer orders and open a single order to update its status. This uses standard Laravel web routes + Inertia pages (no separate SPA/API layer).</p>
					</div>
					<div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
						{[
							["Total", items.length],
							["Pending", statusSummary.pending || 0],
							["Processing", statusSummary.processing || 0],
							["Delivered", statusSummary.delivered || 0],
						].map(([label, value]) => (
							<div key={label} className="rounded-2xl bg-slate-50 px-4 py-3 text-center">
								<p className="text-xs uppercase tracking-[0.24em] text-slate-400">{label}</p>
								<p className="mt-1 text-lg font-black text-slate-900">{value}</p>
							</div>
						))}
					</div>
				</div>
				<div className="mt-5 inline-flex rounded-full border border-sky-100 bg-sky-50 px-3 py-1 text-xs font-semibold tracking-[0.18em] text-sky-700">
					READ / UPDATE ONLY
				</div>
			</div>

			<div className="overflow-hidden rounded-[2rem] border border-slate-100 bg-white shadow-sm">
				<div className="border-b border-slate-100 px-4 py-4 sm:px-6">
					<p className="text-sm font-semibold text-slate-900">Recent orders</p>
					<p className="text-sm text-slate-500">Click an order to open the detail drawer and update status. No create button is shown because the backend does not support manual admin order creation yet.</p>
				</div>

				{items.length ? (
					<div className="p-4 sm:p-6">
						<div className="overflow-x-auto">
						<table className="min-w-full divide-y divide-slate-100 text-sm">
							<thead className="bg-slate-50 text-left text-xs uppercase tracking-[0.2em] text-slate-400">
								<tr>
									<th className="px-6 py-4">Order</th>
									<th className="px-6 py-4">Customer</th>
									<th className="px-6 py-4">Status</th>
									<th className="px-6 py-4">Payment</th>
									<th className="px-6 py-4">Total</th>
									<th className="px-6 py-4">Placed</th>
									<th className="px-6 py-4 text-right">Actions</th>
								</tr>
							</thead>
							<tbody className="divide-y divide-slate-100 bg-white">
								{items.map((order) => (
									<tr key={order.id} className="hover:bg-slate-50/70">
										<td className="px-6 py-4">
											<p className="font-semibold text-slate-900">{order.order_number}</p>
											<p className="text-xs text-slate-500">{order.id}</p>
										</td>
										<td className="px-6 py-4">
											<p className="font-medium text-slate-900">{order.user?.name || order.user?.email || "Guest"}</p>
											<p className="text-xs text-slate-500">{order.user?.email || "No email"}</p>
										</td>
										<td className="px-6 py-4">
											<span className={`inline-flex rounded-full border px-3 py-1 text-xs font-semibold capitalize ${statusLabelClasses[order.order_status] || "border-slate-200 bg-slate-50 text-slate-700"}`}>
												{order.order_status || "pending"}
											</span>
										</td>
										<td className="px-6 py-4 capitalize text-slate-600">{order.payment_status || "pending"}</td>
										<td className="px-6 py-4 font-semibold text-slate-900">{formatCurrency(order.total_amount)}</td>
										<td className="px-6 py-4 text-slate-600">{formatDate(order.placed_at || order.created_at)}</td>
										<td className="px-6 py-4 text-right">
											<div className="flex justify-end gap-2">
												<Link className="rounded-xl border border-slate-200 px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50" href={`/admin/orders/${order.id}`}>
													Open
												</Link>
											</div>
										</td>
									</tr>
								))}
							</tbody>
						</table>
						</div>
					</div>
				) : (
					<div className="p-6 text-sm text-slate-500">No orders found.</div>
				)}
			</div>
		</section>
	);
}
