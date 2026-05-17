import React, { useMemo, useState } from "react";
import { Link } from "@inertiajs/react";
import OrderCard from "../components/order.card.jsx";
import StoreLayout from "../../../layouts/store.layout.jsx";
import Container from "../../../shared/ui/layout/container.jsx";

const STATUS_FILTERS = [
    { key: "all", label: "All orders" },
    { key: "pending", label: "Pending" },
    { key: "processing", label: "Processing" },
    { key: "shipped", label: "Shipped" },
    { key: "delivered", label: "Delivered" },
    { key: "cancelled", label: "Cancelled" },
];

function EmptyState({ filter }) {
    return (
        <div className="flex flex-col items-center justify-center rounded-[2rem] border border-dashed border-slate-200 bg-white px-6 py-16 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-sky-50 text-3xl">
                📦
            </div>
            <h3 className="mt-4 text-base font-semibold text-slate-800">
                {filter === "all" ? "No orders yet" : `No ${filter} orders`}
            </h3>
            <p className="mt-1 max-w-xs text-sm text-slate-400">
                {filter === "all"
                    ? "Start shopping and your orders will appear here."
                    : `You don't have any ${filter} orders right now.`}
            </p>
            {filter === "all" && (
                <Link
                    href="/"
                    className="mt-6 rounded-full bg-sky-500 px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-sky-600"
                >
                    Browse products
                </Link>
            )}
        </div>
    );
}

export default function MyOrdersPage({ orders }) {
    const [activeFilter, setActiveFilter] = useState("all");
    const [search, setSearch] = useState("");

    const allItems = useMemo(() => {
        const raw = orders?.data || orders || [];
        return Array.isArray(raw) ? raw : [];
    }, [orders]);

    const filtered = useMemo(() => {
        return allItems.filter((order) => {
            const matchStatus =
                activeFilter === "all" || order.order_status === activeFilter;
            const matchSearch =
                !search ||
                (order.order_number || "")
                    .toLowerCase()
                    .includes(search.toLowerCase()) ||
                (order.id || "").toLowerCase().includes(search.toLowerCase());
            return matchStatus && matchSearch;
        });
    }, [allItems, activeFilter, search]);

    const statusCounts = useMemo(() => {
        return allItems.reduce((acc, o) => {
            const s = o.order_status || "pending";
            acc[s] = (acc[s] || 0) + 1;
            return acc;
        }, {});
    }, [allItems]);

    return (
        <Container>
            <section className="space-y-6">
                <header className="flex flex-col gap-1">
                    <p className="text-[10px] uppercase tracking-[0.34em] text-slate-400">
                        My account
                    </p>
                    <h1 className="text-3xl font-black tracking-tight text-slate-900">
                        My orders
                    </h1>
                    <p className="text-sm text-slate-500">
                        {allItems.length === 0
                            ? "No orders placed yet."
                            : `${allItems.length} order${allItems.length !== 1 ? "s" : ""} total`}
                    </p>
                </header>

                {allItems.length > 0 && (
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                        <div className="flex flex-wrap gap-1.5">
                            {STATUS_FILTERS.map(({ key, label }) => {
                                const count =
                                    key === "all"
                                        ? allItems.length
                                        : statusCounts[key] || 0;
                                if (key !== "all" && count === 0) return null;
                                return (
                                    <button
                                        key={key}
                                        type="button"
                                        onClick={() => setActiveFilter(key)}
                                        className={`rounded-full px-3 py-1.5 text-xs font-medium transition ${
                                            activeFilter === key
                                                ? "bg-slate-900 text-white"
                                                : "border border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
                                        }`}
                                    >
                                        {label}
                                        {count > 0 && (
                                            <span
                                                className={`ml-1.5 rounded-full px-1.5 py-0.5 text-[10px] ${
                                                    activeFilter === key
                                                        ? "bg-white/20 text-white"
                                                        : "bg-slate-100 text-slate-500"
                                                }`}
                                            >
                                                {count}
                                            </span>
                                        )}
                                    </button>
                                );
                            })}
                        </div>

                        <input
                            type="search"
                            placeholder="Search by order number…"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full rounded-full border border-slate-200 bg-white px-4 py-2 text-sm outline-none focus:border-sky-300 focus:ring-2 focus:ring-sky-100 sm:w-56"
                        />
                    </div>
                )}

                {filtered.length === 0 ? (
                    <EmptyState filter={activeFilter} />
                ) : (
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                        {filtered.map((order) => (
                            <OrderCard key={order.id} order={order} />
                        ))}
                    </div>
                )}

                {orders?.meta && orders.meta.last_page > 1 && (
                    <div className="flex items-center justify-center gap-2 pt-2">
                        {orders.meta.current_page > 1 && (
                            <Link
                                href={`/orders?page=${orders.meta.current_page - 1}`}
                                className="rounded-full border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50"
                            >
                                ← Previous
                            </Link>
                        )}
                        <span className="text-sm text-slate-400">
                            Page {orders.meta.current_page} of{" "}
                            {orders.meta.last_page}
                        </span>
                        {orders.meta.current_page < orders.meta.last_page && (
                            <Link
                                href={`/orders?page=${orders.meta.current_page + 1}`}
                                className="rounded-full border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50"
                            >
                                Next →
                            </Link>
                        )}
                    </div>
                )}
            </section>
        </Container>
    );
}

MyOrdersPage.layout = (page) => <StoreLayout>{page}</StoreLayout>;
