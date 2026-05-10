import React from "react";
import { useForm, Link } from "@inertiajs/react";
import DashboardLayout from "../../../layouts/dashboard.layout.jsx";

const STATUS_OPTIONS = [
    "pending",
    "processing",
    "shipped",
    "delivered",
    "cancelled",
];

const STATUS_STYLES = {
    pending: "bg-amber-50 text-amber-700 border-amber-100",
    processing: "bg-sky-50 text-sky-700 border-sky-100",
    shipped: "bg-indigo-50 text-indigo-700 border-indigo-100",
    delivered: "bg-emerald-50 text-emerald-700 border-emerald-100",
    cancelled: "bg-red-50 text-red-700 border-red-100",
};

export default function AdminOrderDetail({ order }) {
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
            <div className="p-6 text-sm text-slate-500">
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
    const items = order.items ?? [];

    return (
        <section className="space-y-6">
            <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                    <p className="text-[10px] uppercase tracking-[0.34em] text-slate-400">
                        Admin workspace
                    </p>
                    <h1 className="mt-1 text-3xl font-black tracking-tight text-slate-900">
                        Order #{order.id}
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

            <div className="grid gap-6 lg:grid-cols-[1fr_340px]">
                <div className="space-y-6">
                    {items.length > 0 && (
                        <div className="rounded-[1.75rem] border border-slate-100 bg-white p-6 shadow-sm">
                            <p className="text-xs uppercase tracking-[0.28em] text-slate-400">
                                Items
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
                                            $
                                            {Number(item.price ?? 0).toFixed(2)}
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

                    {order.user && (
                        <div className="rounded-[1.75rem] border border-slate-100 bg-white p-6 shadow-sm">
                            <p className="text-xs uppercase tracking-[0.28em] text-slate-400">
                                Customer
                            </p>
                            <p className="mt-3 text-sm font-semibold text-slate-900">
                                {order.user.name || order.user.email}
                            </p>
                            <p className="text-xs text-slate-500">
                                {order.user.email}
                            </p>
                        </div>
                    )}
                </div>

                <div className="space-y-4">
                    <form
                        onSubmit={handleSubmit}
                        className="rounded-[1.75rem] border border-slate-100 bg-white p-6 shadow-sm space-y-4"
                    >
                        <p className="text-xs uppercase tracking-[0.28em] text-slate-400">
                            Update status
                        </p>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-700">
                                Order status
                            </label>
                            <select
                                value={data.status}
                                onChange={(e) => setData("status", e.target.value)}
                                className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none focus:border-sky-300 focus:ring-2 focus:ring-sky-100"
                            >
                                {STATUS_OPTIONS.map((s) => (
                                    <option key={s} value={s}>
                                        {s.charAt(0).toUpperCase() + s.slice(1)}
                                    </option>
                                ))}
                            </select>
                            {errors.status && (
                                <p className="text-xs text-red-600">{errors.status}</p>
                            )}
                        </div>

                        {recentlySuccessful && (
                            <p className="text-xs font-semibold text-emerald-600">
                                Status updated successfully.
                            </p>
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
        </section>
    );
}

AdminOrderDetail.layout = (page) => <DashboardLayout>{page}</DashboardLayout>;
