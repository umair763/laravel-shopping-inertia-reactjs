import React, { useState } from "react";
import { usePage, Link } from "@inertiajs/react";
import { ShoppingBag, ChevronDown, ChevronUp, Package, ExternalLink, ArrowLeft, ArrowRight } from "lucide-react";

const statusColors = {
    pending:    "bg-amber-50 text-amber-700 ring-1 ring-amber-200",
    processing: "bg-blue-50 text-blue-700 ring-1 ring-blue-200",
    shipped:    "bg-indigo-50 text-indigo-700 ring-1 ring-indigo-200",
    delivered:  "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200",
    completed:  "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200",
    cancelled:  "bg-rose-50 text-rose-700 ring-1 ring-rose-200",
};

const paymentColors = {
    paid:    "text-emerald-600",
    pending: "text-amber-600",
    failed:  "text-rose-600",
    refunded: "text-violet-600",
};

function formatCurrency(v) {
    return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(v || 0);
}

function formatDate(d) {
    if (!d) return "—";
    return new Date(d).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

function OrderRow({ order }) {
    const [expanded, setExpanded] = useState(false);

    return (
        <div className="rounded-2xl border border-slate-100 bg-white shadow-sm transition hover:shadow-md">
            <button
                onClick={() => setExpanded((e) => !e)}
                className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left"
            >
                <div className="flex items-center gap-4 min-w-0">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-50">
                        <ShoppingBag size={18} className="text-slate-400" />
                    </div>
                    <div className="min-w-0">
                        <p className="text-sm font-bold text-slate-900">#{order.order_number}</p>
                        <p className="text-xs text-slate-400">
                            {formatDate(order.placed_at)} · {order.items?.length ?? 0} item{order.items?.length !== 1 ? "s" : ""}
                        </p>
                    </div>
                </div>
                <div className="flex shrink-0 items-center gap-3">
                    <span className={`hidden rounded-full px-2.5 py-1 text-xs font-semibold capitalize sm:inline-flex ${statusColors[order.order_status] || statusColors.pending}`}>
                        {order.order_status || "pending"}
                    </span>
                    <span className="text-sm font-black text-slate-900">{formatCurrency(order.total_amount)}</span>
                    {expanded ? <ChevronUp size={16} className="text-slate-400" /> : <ChevronDown size={16} className="text-slate-400" />}
                </div>
            </button>

            {expanded && (
                <div className="border-t border-slate-100 px-5 pb-4 pt-4">
                    <div className="grid gap-3 sm:grid-cols-3 mb-4 text-xs">
                        <div className="rounded-xl bg-slate-50 p-3">
                            <p className="uppercase tracking-[0.2em] text-slate-400 mb-1">Status</p>
                            <span className={`rounded-full px-2.5 py-1 text-xs font-semibold capitalize ${statusColors[order.order_status] || statusColors.pending}`}>
                                {order.order_status || "pending"}
                            </span>
                        </div>
                        <div className="rounded-xl bg-slate-50 p-3">
                            <p className="uppercase tracking-[0.2em] text-slate-400 mb-1">Payment</p>
                            <p className={`font-semibold capitalize ${paymentColors[order.payment?.payment_status] || "text-slate-700"}`}>
                                {order.payment?.payment_status || order.payment_status || "—"}
                            </p>
                        </div>
                        <div className="rounded-xl bg-slate-50 p-3">
                            <p className="uppercase tracking-[0.2em] text-slate-400 mb-1">Total</p>
                            <p className="font-black text-slate-900">{formatCurrency(order.total_amount)}</p>
                        </div>
                    </div>

                    {order.items?.length > 0 && (
                        <div className="space-y-2">
                            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400 mb-2">
                                Items
                            </p>
                            {order.items.map((item) => (
                                <div key={item.id} className="flex items-center justify-between gap-3 rounded-xl border border-slate-100 px-4 py-3">
                                    <div className="flex items-center gap-3 min-w-0">
                                        <Package size={15} className="shrink-0 text-slate-300" />
                                        <p className="truncate text-sm text-slate-700">{item.product_name || "Product"}</p>
                                    </div>
                                    <div className="flex shrink-0 items-center gap-3 text-sm">
                                        <span className="text-slate-400">×{item.quantity}</span>
                                        <span className="font-semibold text-slate-900">
                                            {formatCurrency(item.total_price || item.unit_price * item.quantity)}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    <div className="mt-4 flex gap-3">
                        <Link
                            href={`/orders/${order.id}`}
                            className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-700 transition hover:bg-slate-50"
                        >
                            <ExternalLink size={13} />
                            Full order details
                        </Link>
                    </div>
                </div>
            )}
        </div>
    );
}

export default function PurchaseHistoryPage() {
    const { props } = usePage();
    const { orders = {} } = props;
    const { data = [], current_page = 1, last_page = 1, total = 0 } = orders;

    return (
        <div className="space-y-8">
            <div>
                <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-sky-500">
                    Customer Portal
                </p>
                <h1 className="text-3xl font-black tracking-tight text-slate-900">Purchase History</h1>
                <p className="mt-1 text-sm text-slate-500">
                    Complete record of all your orders — {total} total.
                </p>
            </div>

            {data.length === 0 ? (
                <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-slate-200 py-20 text-center">
                    <ShoppingBag size={40} className="text-slate-300" />
                    <p className="mt-4 text-sm font-semibold text-slate-500">No purchase history yet</p>
                    <p className="mt-1 text-xs text-slate-400">
                        Your completed orders will appear here.
                    </p>
                    <Link
                        href="/"
                        className="mt-5 rounded-full bg-sky-500 px-6 py-2.5 text-sm font-bold text-white transition hover:bg-sky-600"
                    >
                        Start shopping
                    </Link>
                </div>
            ) : (
                <>
                    <div className="space-y-3">
                        {data.map((order) => (
                            <OrderRow key={order.id} order={order} />
                        ))}
                    </div>

                    {last_page > 1 && (
                        <div className="flex items-center justify-between rounded-2xl border border-slate-100 bg-white px-5 py-4 shadow-sm">
                            <p className="text-sm text-slate-500">
                                Page {current_page} of {last_page}
                            </p>
                            <div className="flex gap-2">
                                <Link
                                    href={`?page=${current_page - 1}`}
                                    className={`flex items-center gap-1.5 rounded-xl border border-slate-200 px-3.5 py-2 text-xs font-medium transition ${
                                        current_page <= 1
                                            ? "cursor-not-allowed opacity-40"
                                            : "hover:bg-slate-50 text-slate-700"
                                    }`}
                                >
                                    <ArrowLeft size={13} /> Prev
                                </Link>
                                <Link
                                    href={`?page=${current_page + 1}`}
                                    className={`flex items-center gap-1.5 rounded-xl border border-slate-200 px-3.5 py-2 text-xs font-medium transition ${
                                        current_page >= last_page
                                            ? "cursor-not-allowed opacity-40"
                                            : "hover:bg-slate-50 text-slate-700"
                                    }`}
                                >
                                    Next <ArrowRight size={13} />
                                </Link>
                            </div>
                        </div>
                    )}
                </>
            )}
        </div>
    );
}
