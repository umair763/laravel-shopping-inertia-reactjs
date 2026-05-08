import React, { useEffect, useMemo, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import ConfirmModal from "../../../shared/ui/modals/confirm.modal.jsx";
import Drawer from "../../../shared/ui/modals/drawer.jsx";
import OrderAdminDetails from "./order.admin.details.jsx";
import useAdminOrders from "./use.admin.orders.js";
import useAdminOrder from "./use.admin.order.js";
import useUpdateAdminOrderStatus from "./use.update.admin.order.status.js";

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

export default function OrdersTable() {
	const queryClient = useQueryClient();
	const { data, isLoading, isError } = useAdminOrders();
	const [selectedOrderId, setSelectedOrderId] = useState(null);
	const [form, setForm] = useState({ order_status: "pending" });
	const [confirmSaveOpen, setConfirmSaveOpen] = useState(false);
	const [confirmCancelOpen, setConfirmCancelOpen] = useState(false);
	const [notice, setNotice] = useState(null);

	const orders = data?.data?.data || data?.data || [];
	const selectedOrderQuery = useAdminOrder(selectedOrderId, Boolean(selectedOrderId));
	const selectedOrder = selectedOrderQuery.data?.data || null;
	const updateOrderStatus = useUpdateAdminOrderStatus();
	const isReadOnlyCreateMode = true;

	useEffect(() => {
		if (selectedOrder) {
			setForm({ order_status: selectedOrder.order_status || "pending" });
		}
	}, [selectedOrder]);

	const statusSummary = useMemo(() => {
		return orders.reduce((summary, order) => {
			const key = order.order_status || "pending";
			summary[key] = (summary[key] || 0) + 1;
			return summary;
		}, {});
	}, [orders]);

	function openOrder(order) {
		setNotice(null);
		setSelectedOrderId(order.id);
		setForm({ order_status: order.order_status || "pending" });
	}

	function closeDrawer() {
		setSelectedOrderId(null);
		setConfirmSaveOpen(false);
		setConfirmCancelOpen(false);
	}

	function handleSave(event) {
		event.preventDefault();
		setConfirmSaveOpen(true);
	}

	function confirmSave() {
		if (!selectedOrderId) return;

		updateOrderStatus.mutate(
			{ orderId: selectedOrderId, order_status: form.order_status },
			{
				onSuccess: async () => {
					await queryClient.invalidateQueries({ queryKey: ["admin", "orders"] });
					await queryClient.invalidateQueries({ queryKey: ["admin", "orders", selectedOrderId] });
					setNotice({ type: "success", message: `Order status updated to ${form.order_status}.` });
					setConfirmSaveOpen(false);
				},
				onError: (error) => {
					setNotice({ type: "error", message: error?.response?.data?.message || "Unable to update order status." });
					setConfirmSaveOpen(false);
				},
			},
		);
	}

	function askCancel() {
		setForm((previous) => ({ ...previous, order_status: "cancelled" }));
		setConfirmCancelOpen(true);
	}

	function confirmCancel() {
		if (!selectedOrderId) return;

		updateOrderStatus.mutate(
			{ orderId: selectedOrderId, order_status: "cancelled" },
			{
				onSuccess: async () => {
					await queryClient.invalidateQueries({ queryKey: ["admin", "orders"] });
					await queryClient.invalidateQueries({ queryKey: ["admin", "orders", selectedOrderId] });
					setNotice({ type: "success", message: "Order cancelled successfully." });
					setConfirmCancelOpen(false);
				},
				onError: (error) => {
					setNotice({ type: "error", message: error?.response?.data?.message || "Unable to cancel order." });
					setConfirmCancelOpen(false);
				},
			},
		);
	}

	function OrderCard({ order }) {
		const badgeClass = statusLabelClasses[order.order_status] || "border-slate-200 bg-slate-50 text-slate-700";

		return (
			<div className="rounded-[1.75rem] border border-slate-100 bg-white p-4 shadow-sm">
				<div className="flex items-start justify-between gap-3">
					<div>
						<p className="text-xs uppercase tracking-[0.22em] text-slate-400">Order</p>
						<p className="mt-1 text-base font-bold text-slate-900">{order.order_number}</p>
						<p className="mt-1 text-xs text-slate-500">{order.id}</p>
					</div>
					<span className={`inline-flex rounded-full border px-3 py-1 text-xs font-semibold capitalize ${badgeClass}`}>{order.order_status || "pending"}</span>
				</div>

				<div className="mt-4 grid grid-cols-2 gap-3 text-sm">
					<div className="rounded-2xl bg-slate-50 p-3">
						<p className="text-[10px] uppercase tracking-[0.2em] text-slate-400">Customer</p>
						<p className="mt-1 font-medium text-slate-900">{order.user?.name || order.user?.email || "Guest"}</p>
					</div>
					<div className="rounded-2xl bg-slate-50 p-3">
						<p className="text-[10px] uppercase tracking-[0.2em] text-slate-400">Payment</p>
						<p className="mt-1 font-medium capitalize text-slate-900">{order.payment_status || "pending"}</p>
					</div>
					<div className="rounded-2xl bg-slate-50 p-3">
						<p className="text-[10px] uppercase tracking-[0.2em] text-slate-400">Total</p>
						<p className="mt-1 font-medium text-slate-900">{formatCurrency(order.total_amount)}</p>
					</div>
					<div className="rounded-2xl bg-slate-50 p-3">
						<p className="text-[10px] uppercase tracking-[0.2em] text-slate-400">Placed</p>
						<p className="mt-1 font-medium text-slate-900">{formatDate(order.placed_at || order.created_at)}</p>
					</div>
				</div>

				<div className="mt-4 flex flex-wrap gap-2">
					<button type="button" className="rounded-xl border border-slate-200 px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50" onClick={() => openOrder(order)}>
						View / Edit
					</button>
					<button type="button" className="rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-sm font-medium text-rose-700 transition hover:bg-rose-100" onClick={() => openOrder(order)}>
						Cancel
					</button>
				</div>
			</div>
		);
	}

	return (
		<section className="space-y-6">
			<div className="rounded-[2rem] border border-sky-100 bg-white p-6 shadow-sm">
				<div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
					<div className="space-y-2">
						<p className="text-[10px] uppercase tracking-[0.3em] text-sky-500">Admin orders</p>
						<h1 className="text-3xl font-black tracking-tight text-slate-900">Order management</h1>
						<p className="max-w-2xl text-sm leading-6 text-slate-600">Review customer orders, inspect line items, and update fulfillment status using the backend admin API. This module is read/update only because the backend does not expose an admin create-order endpoint.</p>
					</div>
					<div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
						{[
							["Total", orders.length],
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

				{notice ? (
					<div className={`mt-5 rounded-2xl border px-4 py-3 text-sm ${notice.type === "success" ? "border-emerald-200 bg-emerald-50 text-emerald-700" : "border-rose-200 bg-rose-50 text-rose-700"}`}>
						{notice.message}
					</div>
				) : null}
			</div>

			<div className="overflow-hidden rounded-[2rem] border border-slate-100 bg-white shadow-sm">
				<div className="border-b border-slate-100 px-4 py-4 sm:px-6">
					<p className="text-sm font-semibold text-slate-900">Recent orders</p>
					<p className="text-sm text-slate-500">Click an order to open the detail drawer and update status. No create button is shown because the backend does not support manual admin order creation yet.</p>
				</div>

				{isLoading ? (
					<div className="p-6 text-sm text-slate-500">Loading orders...</div>
				) : isError ? (
					<div className="p-6 text-sm text-rose-600">Failed to load admin orders.</div>
				) : orders.length ? (
					<div className="p-4 sm:p-6">
						<div className="grid gap-4 md:hidden">
							{orders.map((order) => <OrderCard key={order.id} order={order} />)}
						</div>

						<div className="hidden overflow-x-auto md:block">
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
								{orders.map((order) => (
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
												<button type="button" className="rounded-xl border border-slate-200 px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50" onClick={() => openOrder(order)}>
													View / Edit
												</button>
												<button type="button" className="rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-sm font-medium text-rose-700 transition hover:bg-rose-100" onClick={() => openOrder(order)}>
													Cancel
												</button>
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

			<Drawer open={Boolean(selectedOrderId)} title={selectedOrder?.order_number ? `Order ${selectedOrder.order_number}` : "Order details"} onClose={closeDrawer}>
				<OrderAdminDetails
					order={selectedOrder}
					form={form}
					setForm={setForm}
					onSave={handleSave}
					onCancel={askCancel}
					saving={updateOrderStatus.isPending}
				/>
			</Drawer>

			<ConfirmModal
				open={confirmSaveOpen}
				title="Save order status"
				message={`Apply the status change to ${form.order_status} for the selected order?`}
				onConfirm={confirmSave}
				onCancel={() => setConfirmSaveOpen(false)}
			/>

			<ConfirmModal
				open={confirmCancelOpen}
				title="Cancel order"
				message="This will mark the order as cancelled. Continue?"
				onConfirm={confirmCancel}
				onCancel={() => setConfirmCancelOpen(false)}
			/>
		</section>
	);
}
