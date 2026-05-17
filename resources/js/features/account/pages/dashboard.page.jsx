import React from "react";
import { Link, usePage } from "@inertiajs/react";
import { ShoppingBag, Star, ShoppingCart, DollarSign, ArrowRight, Package, Clock } from "lucide-react";

const statusColors = {
    pending:    "bg-amber-50 text-amber-700 ring-1 ring-amber-200",
    processing: "bg-blue-50 text-blue-700 ring-1 ring-blue-200",
    shipped:    "bg-indigo-50 text-indigo-700 ring-1 ring-indigo-200",
    delivered:  "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200",
    completed:  "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200",
    cancelled:  "bg-rose-50 text-rose-700 ring-1 ring-rose-200",
};

function formatCurrency(amount) {
    return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(amount || 0);
}

function formatDate(dateStr) {
    if (!dateStr) return "—";
    return new Date(dateStr).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

export default function CustomerDashboardPage() {
    const { props } = usePage();
    const user = props?.auth?.user;
    const { stats = {}, recent_orders = [] } = props;

    const displayName = user?.first_name
        ? `${user.first_name} ${user.last_name || ""}`.trim()
        : user?.email?.split("@")[0] || "there";

    const statCards = [
        {
            label: "Total Orders",
            value: stats.orders_count ?? 0,
            icon: ShoppingBag,
            tone: "bg-sky-50 text-sky-700 ring-1 ring-sky-100",
            href: "/orders",
        },
        {
            label: "Total Spent",
            value: formatCurrency(stats.total_spent),
            icon: DollarSign,
            tone: "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-100",
            href: "/account/history",
        },
        {
            label: "Reviews Written",
            value: stats.reviews_count ?? 0,
            icon: Star,
            tone: "bg-amber-50 text-amber-700 ring-1 ring-amber-100",
            href: "/account/reviews",
        },
        {
            label: "Cart Items",
            value: stats.cart_items_count ?? 0,
            icon: ShoppingCart,
            tone: "bg-violet-50 text-violet-700 ring-1 ring-violet-100",
            href: "/cart",
        },
    ];

    return (
        <div className="space-y-8">
            <div className="overflow-hidden rounded-3xl bg-gradient-to-br from-sky-500 to-sky-700 p-6 text-white shadow-lg shadow-sky-200 lg:p-8">
                <p className="text-xs font-semibold uppercase tracking-[0.3em] text-sky-200">Customer Dashboard</p>
                <h1 className="mt-2 text-3xl font-black tracking-tight lg:text-4xl">
                    Welcome back, {displayName}.
                </h1>
                <p className="mt-2 max-w-lg text-sm leading-6 text-sky-100">
                    Manage your orders, track deliveries, write reviews, and update your profile — all in one place.
                </p>
                <div className="mt-5 flex flex-wrap gap-3">
                    <Link
                        href="/orders"
                        className="rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-sky-700 shadow transition hover:bg-sky-50"
                    >
                        View orders
                    </Link>
                    <Link
                        href="/account/profile"
                        className="rounded-full border border-white/25 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-white/15"
                    >
                        Edit profile
                    </Link>
                </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                {statCards.map((card) => {
                    const Icon = card.icon;
                    return (
                        <Link
                            key={card.label}
                            href={card.href}
                            className={`group rounded-2xl p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md ${card.tone}`}
                        >
                            <div className="flex items-start justify-between gap-3">
                                <div>
                                    <p className="text-xs font-semibold uppercase tracking-[0.22em] opacity-70">
                                        {card.label}
                                    </p>
                                    <p className="mt-3 text-2xl font-black tracking-tight">{card.value}</p>
                                </div>
                                <Icon size={22} className="opacity-60 mt-0.5" />
                            </div>
                        </Link>
                    );
                })}
            </div>

            <div className="rounded-3xl border border-slate-100 bg-white shadow-sm">
                <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
                    <div className="flex items-center gap-2">
                        <Clock size={18} className="text-slate-400" />
                        <h2 className="text-base font-bold text-slate-900">Recent Orders</h2>
                    </div>
                    <Link
                        href="/orders"
                        className="flex items-center gap-1 text-sm font-medium text-sky-600 transition hover:text-sky-700"
                    >
                        View all <ArrowRight size={15} />
                    </Link>
                </div>

                {recent_orders.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-16 text-center">
                        <Package size={36} className="text-slate-300" />
                        <p className="mt-3 text-sm font-medium text-slate-500">No orders yet</p>
                        <p className="mt-1 text-xs text-slate-400">Your recent orders will appear here.</p>
                        <Link
                            href="/"
                            className="mt-4 rounded-full bg-sky-500 px-5 py-2 text-sm font-semibold text-white transition hover:bg-sky-600"
                        >
                            Start shopping
                        </Link>
                    </div>
                ) : (
                    <div className="divide-y divide-slate-50">
                        {recent_orders.map((order) => (
                            <Link
                                key={order.id}
                                href={`/orders/${order.id}`}
                                className="flex items-center justify-between gap-4 px-6 py-4 transition hover:bg-slate-50/70"
                            >
                                <div className="min-w-0 flex-1">
                                    <p className="truncate text-sm font-semibold text-slate-900">
                                        #{order.order_number}
                                    </p>
                                    <p className="mt-0.5 text-xs text-slate-400">
                                        {order.items_count ?? 0} item{order.items_count !== 1 ? "s" : ""} ·{" "}
                                        {formatDate(order.placed_at)}
                                    </p>
                                </div>
                                <div className="flex items-center gap-3">
                                    <span className={`rounded-full px-2.5 py-1 text-xs font-semibold capitalize ${statusColors[order.order_status] || statusColors.pending}`}>
                                        {order.order_status || "pending"}
                                    </span>
                                    <span className="text-sm font-bold text-slate-900">
                                        {formatCurrency(order.total_amount)}
                                    </span>
                                    <ArrowRight size={15} className="text-slate-300" />
                                </div>
                            </Link>
                        ))}
                    </div>
                )}
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
                {[
                    { href: "/account/reviews", label: "Reviews", desc: "View and write product reviews", icon: Star, color: "amber" },
                    { href: "/account/history", label: "Purchase History", desc: "See all your past orders", icon: ShoppingBag, color: "sky" },
                    { href: "/account/settings", label: "Account Settings", desc: "Update password and email", icon: Package, color: "violet" },
                ].map((card) => {
                    const Icon = card.icon;
                    return (
                        <Link
                            key={card.href}
                            href={card.href}
                            className="group rounded-2xl border border-slate-100 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
                        >
                            <div className={`mb-3 inline-flex rounded-xl bg-${card.color}-50 p-2.5`}>
                                <Icon size={20} className={`text-${card.color}-600`} />
                            </div>
                            <h3 className="text-sm font-bold text-slate-900">{card.label}</h3>
                            <p className="mt-1 text-xs text-slate-500">{card.desc}</p>
                        </Link>
                    );
                })}
            </div>
        </div>
    );
}
