import React from "react";
import { Link } from "@inertiajs/react";

const STATUS_STYLES = {
    pending: "bg-amber-50 text-amber-700 border-amber-100",
    processing: "bg-sky-50 text-sky-700 border-sky-100",
    shipped: "bg-indigo-50 text-indigo-700 border-indigo-100",
    delivered: "bg-emerald-50 text-emerald-700 border-emerald-100",
    cancelled: "bg-red-50 text-red-700 border-red-100",
};

export default function OrderDetails({ order }) {
    if (!order) {
        return <p className="text-sm text-slate-500">Order not found.</p>;
    }

    const statusStyle =
        STATUS_STYLES[order.order_status] ||
        "bg-slate-50 text-slate-600 border-slate-100";
    const items = order.items ?? [];

    return (
        <div className="space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                    <p className="text-[10px] uppercase tracking-[0.28em] text-slate-400">
                        Order details
                    </p>
                    <h1 className="mt-1 text-3xl font-black tracking-tight text-slate-900">
                        #{order.id}
                    </h1>
                    {order.created_at && (
                        <p className="mt-1 text-sm text-slate-500">
                            Placed on{" "}
                            {new Date(order.created_at).toLocaleDateString()}
                        </p>
                    )}
                </div>
                <span
                    className={`rounded-full border px-4 py-2 text-sm font-semibold ${statusStyle}`}
                >
                    {order.order_status}
                </span>
            </div>

            {items.length > 0 && (
                <div className="rounded-[1.75rem] border border-slate-100 bg-white p-6 shadow-sm">
                    <p className="text-xs uppercase tracking-[0.28em] text-slate-400">
                        Items ordered
                    </p>
                    <ul className="mt-4 divide-y divide-slate-100">
                        {items.map((item, i) => (
                            <li
                                key={item.id ?? i}
                                className="flex items-center justify-between gap-3 py-3"
                            >
                                <div>
                                    <p className="text-sm font-semibold text-slate-900">
                                        {item.product?.name ??
                                            `Product #${item.product_id}`}
                                    </p>
                                    <p className="text-xs text-slate-500">
                                        Qty: {item.quantity}
                                    </p>
                                </div>
                                <p className="text-sm font-bold text-sky-700">
                                    ${Number(item.price ?? 0).toFixed(2)}
                                </p>
                            </li>
                        ))}
                    </ul>
                    <div className="mt-4 flex items-center justify-between rounded-2xl bg-sky-50 px-4 py-3">
                        <span className="text-sm font-semibold text-slate-700">
                            Total
                        </span>
                        <span className="text-lg font-black text-sky-800">
                            ${Number(order.total ?? 0).toFixed(2)}
                        </span>
                    </div>
                </div>
            )}

            {order.shipping_address && (
                <div className="rounded-[1.75rem] border border-slate-100 bg-white p-6 shadow-sm">
                    <p className="text-xs uppercase tracking-[0.28em] text-slate-400">
                        Shipping address
                    </p>
                    <p className="mt-3 text-sm leading-6 text-slate-700 whitespace-pre-line">
                        {typeof order.shipping_address === "string"
                            ? order.shipping_address
                            : JSON.stringify(order.shipping_address, null, 2)}
                    </p>
                </div>
            )}

            <Link
                href="/orders"
                className="inline-block rounded-full border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:border-sky-200 hover:bg-sky-50"
            >
                ← Back to orders
            </Link>
        </div>
    );
}
