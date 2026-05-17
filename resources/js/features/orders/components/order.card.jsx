import React from "react";
import { Link } from "@inertiajs/react";

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
        maximumFractionDigits: 2,
    }).format(Number(value || 0));
}

function formatDate(dateStr) {
    if (!dateStr) return "—";
    try {
        return new Date(dateStr).toLocaleDateString(undefined, {
            year: "numeric",
            month: "short",
            day: "numeric",
        });
    } catch {
        return dateStr;
    }
}

export default function OrderCard({ order }) {
    const statusStyle =
        STATUS_STYLES[order?.order_status] ||
        "bg-slate-50 text-slate-600 border-slate-100";
    const paymentClass =
        PAYMENT_STYLES[order?.payment_status] || "text-slate-500";

    const itemCount = order?.items?.length ?? 0;
    const total = Number(order?.total_amount ?? order?.total ?? 0);
    const orderNumber = order?.order_number || `#${order?.id?.slice(0, 8) ?? "—"}`;

    return (
        <article className="overflow-hidden rounded-[1.75rem] border border-slate-100 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
            <div className="flex items-start justify-between gap-3 border-b border-slate-50 p-5">
                <div className="space-y-0.5">
                    <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-slate-400">
                        Order
                    </p>
                    <p className="text-lg font-black tracking-tight text-slate-900">
                        {orderNumber}
                    </p>
                    <p className="text-xs text-slate-400">
                        {formatDate(order?.placed_at || order?.created_at)}
                    </p>
                </div>
                <span
                    className={`shrink-0 rounded-full border px-3 py-1 text-xs font-semibold capitalize ${statusStyle}`}
                >
                    {order?.order_status ?? "unknown"}
                </span>
            </div>

            <div className="space-y-2 p-5">
                <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-500">Items</span>
                    <span className="font-medium text-slate-900">
                        {itemCount} {itemCount === 1 ? "item" : "items"}
                    </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-500">Payment</span>
                    <span className={`font-semibold capitalize ${paymentClass}`}>
                        {order?.payment_status ?? "pending"}
                    </span>
                </div>
                <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-500">Total</span>
                    <span className="text-base font-black text-slate-900">
                        {formatCurrency(total)}
                    </span>
                </div>
            </div>

            <div className="px-5 pb-5">
                <Link
                    href={`/orders/${order?.id}`}
                    className="block w-full rounded-2xl bg-sky-500 px-4 py-2.5 text-center text-sm font-semibold text-white transition hover:bg-sky-600"
                >
                    View details
                </Link>
            </div>
        </article>
    );
}
