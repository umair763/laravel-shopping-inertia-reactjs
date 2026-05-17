import React, { useState } from "react";
import { useForm, Link } from "@inertiajs/react";
import DashboardLayout from "../../../layouts/dashboard.layout.jsx";
import OrderInvoice from "../../orders/components/order.invoice.jsx";

const STATUS_OPTIONS = [
    "pending",
    "processing",
    "shipped",
    "delivered",
    "cancelled",
    "returned",
];

const STATUS_STYLES = {
    pending: "bg-amber-50 text-amber-700 border-amber-100",
    processing: "bg-sky-50 text-sky-700 border-sky-100",
    shipped: "bg-indigo-50 text-indigo-700 border-indigo-100",
    delivered: "bg-emerald-50 text-emerald-700 border-emerald-100",
    cancelled: "bg-rose-50 text-rose-700 border-rose-100",
    returned: "bg-slate-100 text-slate-600 border-slate-200",
};

const PAYMENT_STYLES = {
    paid: "text-emerald-600",
    pending: "text-amber-600",
    failed: "text-rose-600",
    refunded: "text-violet-600",
};

function formatCurrency(value) {
    return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
        minimumFractionDigits: 2,
    }).format(Number(value || 0));
}

function formatDate(dateStr) {
    if (!dateStr) return "—";
    try {
        return new Date(dateStr).toLocaleDateString(undefined, {
            year: "numeric",
            month: "long",
            day: "numeric",
        });
    } catch {
        return dateStr;
    }
}

export default function AdminOrderDetail({ order }) {
    const [showInvoice, setShowInvoice] = useState(false);

    const { data, setData, put, processing, errors, recentlySuccessful } =
        useForm({
            status: order?.order_status ?? "pending",
        });

    function handleSubmit(event) {
        event.preventDefault();
        put(`/admin/orders/${order.id}`);
    }

    if (!order) {
        return (
            <div className="rounded-2xl border border-slate-100 bg-white p-6 text-sm text-slate-500">
                Order not found.{" "}
                <Link
                    href="/admin/orders"
                    className="font-semibold text-sky-600 hover:underline"
                >
                    Back to orders
                </Link>
            </div>
        );
    }

    const statusStyle =
        STATUS_STYLES[order.order_status] ||
        "bg-slate-50 text-slate-600 border-slate-100";
    const paymentClass =
        PAYMENT_STYLES[order.payment_status] || "text-slate-500";
    const items = order.items ?? [];
    const orderNumber =
        order.order_number || `#${order.id?.slice(0, 8)?.toUpperCase() ?? "—"}`;
    const addr = order.shipping_address;

    const subtotal = Number(order.subtotal_amount ?? order.total_amount ?? 0);
    const tax = Number(order.tax_amount ?? 0);
    const shipping = Number(order.shipping_amount ?? 0);
    const discount = Number(order.discount_amount ?? 0);
    const total = Number(order.total_amount ?? 0);

    const customerName = [order.user?.first_name, order.user?.last_name]
        .filter(Boolean)
        .join(" ") || order.user?.email || order.user?.name || "—";

    return (
        <section className="space-y-6">
            <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                    <p className="text-[10px] uppercase tracking-[0.34em] text-slate-400">
                        Admin workspace
                    </p>
                    <h1 className="mt-1 text-3xl font-black tracking-tight text-slate-900">
                        {orderNumber}
                    </h1>
                    <p className="mt-1 text-sm text-slate-500">
                        Placed {formatDate(order.placed_at || order.created_at)}
                    </p>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                    <span
                        className={`rounded-full border px-4 py-1.5 text-sm font-semibold capitalize ${statusStyle}`}
                    >
                        {order.order_status}
                    </span>
                    <button
                        type="button"
                        onClick={() => setShowInvoice(true)}
                        className="rounded-full border border-slate-200 bg-white px-4 py-1.5 text-sm font-semibold text-slate-700 transition hover:border-sky-200 hover:bg-sky-50"
                    >
                        🧾 Invoice
                    </button>
                </div>
            </div>

            <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
                <div className="space-y-5">
                    <div className="overflow-hidden rounded-[1.75rem] border border-slate-100 bg-white shadow-sm">
                        <div className="border-b border-slate-50 px-5 py-4">
                            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-slate-400">
                                Items
                            </p>
                        </div>
                        {items.length > 0 ? (
                            <>
                                <ul className="divide-y divide-slate-50">
                                    {items.map((item, i) => (
                                        <li
                                            key={item.id ?? i}
                                            className="flex items-center justify-between gap-4 px-5 py-4"
                                        >
                                            <div className="min-w-0">
                                                <p className="truncate text-sm font-semibold text-slate-900">
                                                    {item.product?.name ??
                                                        `Product #${item.product_id?.slice(0, 8) ?? i}`}
                                                </p>
                                                <div className="mt-0.5 flex flex-wrap gap-2 text-xs text-slate-400">
                                                    <span>Qty: {item.quantity}</span>
                                                    {item.variant?.sku && (
                                                        <span>· SKU: {item.variant.sku}</span>
                                                    )}
                                                </div>
                                            </div>
                                            <div className="shrink-0 text-right">
                                                <p className="text-sm font-bold text-slate-900">
                                                    {formatCurrency(item.total_price ?? item.unit_price ?? item.price)}
                                                </p>
                                                {item.quantity > 1 && (
                                                    <p className="text-xs text-slate-400">
                                                        {formatCurrency(item.unit_price ?? item.price)} each
                                                    </p>
                                                )}
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                                <div className="border-t border-slate-100 px-5 py-4 space-y-2">
                                    {subtotal > 0 && (
                                        <div className="flex justify-between text-xs text-slate-500">
                                            <span>Subtotal</span>
                                            <span>{formatCurrency(subtotal)}</span>
                                        </div>
                                    )}
                                    {shipping > 0 && (
                                        <div className="flex justify-between text-xs text-slate-500">
                                            <span>Shipping</span>
                                            <span>{formatCurrency(shipping)}</span>
                                        </div>
                                    )}
                                    {tax > 0 && (
                                        <div className="flex justify-between text-xs text-slate-500">
                                            <span>Tax</span>
                                            <span>{formatCurrency(tax)}</span>
                                        </div>
                                    )}
                                    {discount > 0 && (
                                        <div className="flex justify-between text-xs text-emerald-600">
                                            <span>Discount</span>
                                            <span>−{formatCurrency(discount)}</span>
                                        </div>
                                    )}
                                    <div className="flex items-center justify-between border-t border-slate-100 pt-3">
                                        <span className="text-sm font-semibold text-slate-700">
                                            Total
                                        </span>
                                        <span className="text-lg font-black text-sky-700">
                                            {formatCurrency(total)}
                                        </span>
                                    </div>
                                </div>
                            </>
                        ) : (
                            <p className="px-5 py-6 text-xs text-slate-400">
                                No items.
                            </p>
                        )}
                    </div>

                    {order.user && (
                        <div className="rounded-[1.75rem] border border-slate-100 bg-white p-5 shadow-sm">
                            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-slate-400">
                                Customer
                            </p>
                            <div className="mt-3 flex items-center gap-3">
                                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-sky-100 text-sm font-bold text-sky-700">
                                    {customerName.charAt(0).toUpperCase()}
                                </div>
                                <div>
                                    <p className="text-sm font-semibold text-slate-900">
                                        {customerName}
                                    </p>
                                    <p className="text-xs text-slate-400">
                                        {order.user.email}
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}

                    {addr && (
                        <div className="rounded-[1.75rem] border border-slate-100 bg-white p-5 shadow-sm">
                            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-slate-400">
                                Shipping address
                            </p>
                            <div className="mt-3 space-y-0.5 text-sm leading-6 text-slate-700">
                                {addr.address_line_1 && <p>{addr.address_line_1}</p>}
                                {addr.address_line_2 && <p>{addr.address_line_2}</p>}
                                {[addr.city, addr.state, addr.postal_code]
                                    .filter(Boolean)
                                    .join(", ") && (
                                    <p>
                                        {[addr.city, addr.state, addr.postal_code]
                                            .filter(Boolean)
                                            .join(", ")}
                                    </p>
                                )}
                                {addr.country && <p>{addr.country}</p>}
                            </div>
                        </div>
                    )}

                    {order.payment && (
                        <div className="rounded-[1.75rem] border border-slate-100 bg-white p-5 shadow-sm">
                            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-slate-400">
                                Payment
                            </p>
                            <div className="mt-3 space-y-2 text-sm">
                                <div className="flex justify-between">
                                    <span className="text-slate-500">Method</span>
                                    <span className="font-medium capitalize text-slate-900">
                                        {order.payment.payment_method || "—"}
                                    </span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-slate-500">Status</span>
                                    <span className={`font-semibold capitalize ${paymentClass}`}>
                                        {order.payment_status || order.payment.payment_status || "—"}
                                    </span>
                                </div>
                                {order.payment.transaction_id && (
                                    <div className="flex justify-between">
                                        <span className="text-slate-500">Txn ID</span>
                                        <span className="font-mono text-xs text-slate-600">
                                            {order.payment.transaction_id}
                                        </span>
                                    </div>
                                )}
                                <div className="flex justify-between">
                                    <span className="text-slate-500">Amount</span>
                                    <span className="font-semibold text-slate-900">
                                        {formatCurrency(order.payment.amount)}
                                    </span>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                <div className="space-y-4">
                    <form
                        onSubmit={handleSubmit}
                        className="rounded-[1.75rem] border border-slate-100 bg-white p-6 shadow-sm space-y-4"
                    >
                        <p className="text-xs font-semibold uppercase tracking-[0.28em] text-slate-400">
                            Update status
                        </p>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-700">
                                Order status
                            </label>
                            <select
                                value={data.status}
                                onChange={(e) =>
                                    setData("status", e.target.value)
                                }
                                className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none focus:border-sky-300 focus:ring-2 focus:ring-sky-100"
                            >
                                {STATUS_OPTIONS.map((s) => (
                                    <option key={s} value={s}>
                                        {s.charAt(0).toUpperCase() + s.slice(1)}
                                    </option>
                                ))}
                            </select>
                            {errors.status && (
                                <p className="text-xs text-rose-600">
                                    {errors.status}
                                </p>
                            )}
                        </div>

                        {recentlySuccessful && (
                            <div className="rounded-xl bg-emerald-50 px-3 py-2 text-xs font-semibold text-emerald-700">
                                ✓ Status updated successfully.
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={processing}
                            className="w-full rounded-2xl bg-sky-500 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-sky-600 disabled:opacity-60"
                        >
                            {processing ? "Saving…" : "Save status"}
                        </button>
                    </form>

                    <Link
                        href="/admin/orders"
                        className="block rounded-2xl border border-slate-200 px-5 py-3 text-center text-sm font-semibold text-slate-700 transition hover:border-sky-200 hover:bg-sky-50"
                    >
                        ← Back to orders
                    </Link>
                </div>
            </div>

            {showInvoice && (
                <OrderInvoice
                    order={order}
                    onClose={() => setShowInvoice(false)}
                />
            )}
        </section>
    );
}

AdminOrderDetail.layout = (page) => <DashboardLayout>{page}</DashboardLayout>;
