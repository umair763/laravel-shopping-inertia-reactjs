import React from "react";
import { Link } from "@inertiajs/react";

const STATUS_STYLES = {
    pending: "bg-amber-50 text-amber-700 border-amber-100",
    processing: "bg-sky-50 text-sky-700 border-sky-100",
    shipped: "bg-indigo-50 text-indigo-700 border-indigo-100",
    delivered: "bg-emerald-50 text-emerald-700 border-emerald-100",
    cancelled: "bg-red-50 text-red-700 border-red-100",
};

export default function OrderCard({ order }) {
    const style =
        STATUS_STYLES[order?.order_status] ||
        "bg-slate-50 text-slate-600 border-slate-100";

    return (
        <article className="rounded-[1.75rem] border border-slate-100 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
            <div className="flex items-start justify-between gap-3">
                <div className="space-y-1">
                    <p className="text-xs uppercase tracking-[0.28em] text-slate-400">
                        Order
                    </p>
                    <p className="text-lg font-black tracking-tight text-slate-900">
                        #{order?.id}
                    </p>
                </div>
                <span
                    className={`rounded-full border px-3 py-1 text-xs font-semibold ${style}`}
                >
                    {order?.order_status ?? "unknown"}
                </span>
            </div>

            <div className="mt-4 space-y-2 text-sm text-slate-600">
                <div className="flex items-center justify-between">
                    <span>Items</span>
                    <span className="font-medium text-slate-900">
                        {order?.items?.length ?? 0}
                    </span>
                </div>
                <div className="flex items-center justify-between">
                    <span>Total</span>
                    <span className="font-bold text-sky-700">
                        ${Number(order?.total ?? 0).toFixed(2)}
                    </span>
                </div>
                {order?.created_at && (
                    <div className="flex items-center justify-between">
                        <span>Placed</span>
                        <span className="font-medium text-slate-900">
                            {new Date(order.created_at).toLocaleDateString()}
                        </span>
                    </div>
                )}
            </div>

            <Link
                href={`/orders/${order?.id}`}
                className="mt-4 block rounded-2xl bg-sky-500 px-4 py-2 text-center text-sm font-semibold text-white transition hover:bg-sky-600"
            >
                View details
            </Link>
        </article>
    );
}
