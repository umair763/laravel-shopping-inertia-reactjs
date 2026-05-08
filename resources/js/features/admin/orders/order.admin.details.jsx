import React, { useMemo } from "react";
import SelectInput from "../../../shared/ui/inputs/select.input.jsx";
import PrimaryButton from "../../../shared/ui/buttons/primary.button.jsx";

const statusOptions = ["pending", "processing", "shipped", "delivered", "cancelled", "returned"];

function formatCurrency(value) {
	const amount = Number(value || 0);
	return new Intl.NumberFormat("en-PK", { style: "currency", currency: "PKR", maximumFractionDigits: 2 }).format(amount);
}

function formatDate(value) {
	if (!value) return "—";
	const date = new Date(value);
	return Number.isNaN(date.getTime()) ? value : date.toLocaleString();
}

export default function OrderAdminDetails({ order, form, setForm, onSave, onCancel, saving = false }) {
	const items = order?.items || [];

	const addressLines = useMemo(() => {
		const shippingAddress = order?.shipping_address || order?.shippingAddress || {};
		return [
			shippingAddress.address_line_1,
			shippingAddress.address_line_2,
			shippingAddress.city,
			shippingAddress.state,
			shippingAddress.postal_code,
			shippingAddress.country,
		].filter(Boolean);
	}, [order?.shippingAddress, order?.shipping_address]);

	if (!order) {
		return <div className="rounded-3xl border border-slate-100 bg-slate-50 p-8 text-sm text-slate-500">Select an order to view details and update the status.</div>;
	}

	return (
		<div className="space-y-6">
			<div className="grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
				<div className="rounded-3xl border border-slate-100 bg-slate-50 p-5">
					<p className="text-xs uppercase tracking-[0.28em] text-slate-400">Order identity</p>
					<h3 className="mt-2 text-2xl font-black tracking-tight text-slate-900">{order.order_number}</h3>
					<div className="mt-4 grid gap-3 sm:grid-cols-2">
						<div>
							<p className="text-xs uppercase tracking-[0.22em] text-slate-400">Customer</p>
							<p className="mt-1 font-semibold text-slate-900">{order.user?.name || order.user?.email || "—"}</p>
							<p className="text-sm text-slate-500">{order.user?.email || "No email"}</p>
						</div>
						<div>
							<p className="text-xs uppercase tracking-[0.22em] text-slate-400">Placed at</p>
							<p className="mt-1 font-semibold text-slate-900">{formatDate(order.placed_at || order.created_at)}</p>
						</div>
						<div>
							<p className="text-xs uppercase tracking-[0.22em] text-slate-400">Payment status</p>
							<p className="mt-1 font-semibold text-slate-900 capitalize">{order.payment_status || "pending"}</p>
						</div>
						<div>
							<p className="text-xs uppercase tracking-[0.22em] text-slate-400">Order status</p>
							<p className="mt-1 font-semibold text-slate-900 capitalize">{order.order_status || "pending"}</p>
						</div>
					</div>
				</div>

				<div className="space-y-3 rounded-3xl border border-slate-100 bg-white p-5">
					<p className="text-xs uppercase tracking-[0.28em] text-slate-400">Totals</p>
					<div className="grid gap-3 text-sm text-slate-600">
						<div className="flex items-center justify-between"><span>Subtotal</span><span className="font-semibold text-slate-900">{formatCurrency(order.subtotal_amount)}</span></div>
						<div className="flex items-center justify-between"><span>Tax</span><span className="font-semibold text-slate-900">{formatCurrency(order.tax_amount)}</span></div>
						<div className="flex items-center justify-between"><span>Shipping</span><span className="font-semibold text-slate-900">{formatCurrency(order.shipping_amount)}</span></div>
						<div className="flex items-center justify-between"><span>Discount</span><span className="font-semibold text-slate-900">{formatCurrency(order.discount_amount)}</span></div>
						<div className="flex items-center justify-between border-t border-slate-100 pt-3 text-base"><span className="font-semibold text-slate-900">Total</span><span className="font-bold text-slate-900">{formatCurrency(order.total_amount)}</span></div>
					</div>
				</div>
			</div>

			<div className="grid gap-4 lg:grid-cols-[1fr_0.9fr]">
				<form className="rounded-3xl border border-slate-100 bg-white p-5" onSubmit={onSave}>
					<div className="space-y-4">
						<div>
							<p className="text-xs uppercase tracking-[0.28em] text-slate-400">Update order</p>
							<h4 className="mt-2 text-xl font-black tracking-tight text-slate-900">Status management</h4>
							<p className="mt-1 text-sm text-slate-500">Use the admin API to move the order through the fulfillment lifecycle.</p>
						</div>

						<label className="block space-y-2">
							<span className="text-sm font-medium text-slate-700">Order status</span>
							<SelectInput value={form.order_status} onChange={(event) => setForm((previous) => ({ ...previous, order_status: event.target.value }))}>
								{statusOptions.map((status) => <option key={status} value={status}>{status}</option>)}
							</SelectInput>
						</label>

						<div className="grid gap-3 sm:grid-cols-2">
							<div className="rounded-2xl bg-slate-50 p-4 text-sm text-slate-600">
								<p className="text-xs uppercase tracking-[0.22em] text-slate-400">Shipping address</p>
								<div className="mt-3 space-y-1 text-slate-700">
									{addressLines.length ? addressLines.map((line) => <p key={line}>{line}</p>) : <p>No shipping address attached.</p>}
								</div>
							</div>
							<div className="rounded-2xl bg-slate-50 p-4 text-sm text-slate-600">
								<p className="text-xs uppercase tracking-[0.22em] text-slate-400">Customer note</p>
								<p className="mt-3 text-slate-700">{order.shippingAddress?.type || order.shipping_address_id ? "This order is linked to a saved address record." : "This order was created without a separate address relation."}</p>
							</div>
						</div>
					</div>

					<div className="mt-6 flex flex-wrap gap-3">
						<PrimaryButton type="submit" disabled={saving}>{saving ? "Saving..." : "Save status"}</PrimaryButton>
						<button type="button" onClick={onCancel} className="rounded-full border border-rose-200 bg-rose-50 px-5 py-3 font-semibold text-rose-700 transition hover:bg-rose-100">Decline / Cancel</button>
					</div>
				</form>

				<div className="rounded-3xl border border-slate-100 bg-slate-50 p-5">
					<p className="text-xs uppercase tracking-[0.28em] text-slate-400">Order items</p>
					<div className="mt-4 overflow-hidden rounded-2xl border border-slate-200 bg-white">
						<table className="min-w-full divide-y divide-slate-100 text-sm">
							<thead className="bg-slate-50 text-left text-xs uppercase tracking-[0.2em] text-slate-400">
								<tr>
									<th className="px-4 py-3">Product</th>
									<th className="px-4 py-3">Variant</th>
									<th className="px-4 py-3">Qty</th>
									<th className="px-4 py-3">Price</th>
								</tr>
							</thead>
							<tbody className="divide-y divide-slate-100">
								{items.length ? items.map((item) => (
									<tr key={item.id}>
										<td className="px-4 py-3 font-medium text-slate-900">{item.product?.name || item.product_id || "—"}</td>
										<td className="px-4 py-3 text-slate-600">{item.variant?.name || item.variant_id || "—"}</td>
										<td className="px-4 py-3 text-slate-600">{item.quantity}</td>
										<td className="px-4 py-3 text-slate-600">{formatCurrency(item.total_price)}</td>
									</tr>
								)) : (
									<tr><td className="px-4 py-6 text-center text-slate-500" colSpan={4}>No order items loaded.</td></tr>
								)}
							</tbody>
						</table>
					</div>
					<div className="mt-4 rounded-2xl bg-white p-4 text-sm text-slate-600">
						<div className="flex items-center justify-between"><span>Order ID</span><span className="font-semibold text-slate-900">{order.id}</span></div>
						<div className="mt-2 flex items-center justify-between"><span>Shipping address ID</span><span className="font-semibold text-slate-900">{order.shipping_address_id || "—"}</span></div>
					</div>
				</div>
			</div>
		</div>
	);
}
