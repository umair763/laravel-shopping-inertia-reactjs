import React, { useEffect } from "react";
import { Link, router } from "@inertiajs/react";

function getXsrfHeader() {
    const match = document.cookie.match(/XSRF-TOKEN=([^;]+)/);
    return match ? decodeURIComponent(match[1]) : "";
}

async function request(url, method, body) {
    const res = await fetch(url, {
        method,
        credentials: "same-origin",
        headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            "X-Requested-With": "XMLHttpRequest",
            "X-XSRF-TOKEN": getXsrfHeader(),
        },
        body: body ? JSON.stringify(body) : undefined,
    });
    if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.message || `Request failed: ${res.status}`);
    }
    return res.json();
}

function formatCurrency(value) {
    return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
        minimumFractionDigits: 2,
    }).format(Number(value || 0));
}

export default function CartDrawer({ open, onClose, cart, onCartChange }) {
    const items = cart?.items || [];
    const total = cart?.total_amount || 0;

    useEffect(() => {
        function onKey(e) {
            if (e.key === "Escape" && open) onClose?.();
        }
        document.addEventListener("keydown", onKey);
        return () => document.removeEventListener("keydown", onKey);
    }, [open, onClose]);

    async function removeItem(item) {
        try {
            await request(`/cart/items/${item.id}`, "DELETE");
            onCartChange?.();
        } catch {
            /* silently fail */
        }
    }

    async function updateQty(item, qty) {
        if (qty < 1) return removeItem(item);
        try {
            await request(`/cart/items/${item.id}`, "PUT", { quantity: qty });
            onCartChange?.();
        } catch {
            /* silently fail */
        }
    }

    if (!open) return null;

    return (
        <>
            <div
                className="fixed inset-0 z-40 bg-black/30 backdrop-blur-sm"
                onClick={onClose}
            />
            <div className="fixed inset-y-0 right-0 z-50 flex w-full max-w-sm flex-col bg-white shadow-2xl">
                <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
                    <div>
                        <p className="text-[10px] uppercase tracking-[0.3em] text-slate-400">
                            Shopping
                        </p>
                        <h2 className="text-lg font-black text-slate-900">
                            Cart
                            {items.length > 0 && (
                                <span className="ml-2 rounded-full bg-sky-100 px-2 py-0.5 text-xs font-semibold text-sky-700">
                                    {items.length}
                                </span>
                            )}
                        </h2>
                    </div>
                    <button
                        type="button"
                        onClick={onClose}
                        className="rounded-full border border-slate-200 p-2 text-slate-400 transition hover:bg-slate-50"
                    >
                        ✕
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto p-4">
                    {items.length === 0 ? (
                        <div className="flex h-full flex-col items-center justify-center gap-3 text-center">
                            <p className="text-4xl">🛒</p>
                            <p className="text-sm font-semibold text-slate-700">
                                Your cart is empty
                            </p>
                            <p className="text-xs text-slate-400">
                                Add items from the storefront.
                            </p>
                            <Link
                                href="/"
                                onClick={onClose}
                                className="rounded-full bg-sky-500 px-4 py-2 text-sm font-semibold text-white hover:bg-sky-600"
                            >
                                Browse products
                            </Link>
                        </div>
                    ) : (
                        <ul className="space-y-3">
                            {items.map((item) => {
                                const variant = item.variant || {};
                                const product = item.product || {};
                                const price = Number(
                                    variant.discount_price ?? variant.price ?? 0
                                );
                                const image =
                                    variant.images?.find((img) => img.is_primary) ||
                                    variant.images?.[0];
                                return (
                                    <li
                                        key={item.id}
                                        className="flex gap-3 rounded-2xl border border-slate-100 bg-slate-50 p-3"
                                    >
                                        {image?.image_url ? (
                                            <img
                                                src={image.image_url}
                                                alt={product.name || "Product"}
                                                className="h-16 w-16 rounded-xl object-cover"
                                            />
                                        ) : (
                                            <div className="h-16 w-16 rounded-xl bg-slate-200" />
                                        )}
                                        <div className="flex-1 min-w-0">
                                            <p className="truncate text-sm font-semibold text-slate-900">
                                                {product.name || variant.name || "Item"}
                                            </p>
                                            <p className="text-sm font-bold text-sky-700">
                                                {formatCurrency(price)}
                                            </p>
                                            <div className="mt-1.5 flex items-center gap-1">
                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        updateQty(
                                                            item,
                                                            Number(item.quantity) - 1
                                                        )
                                                    }
                                                    className="flex h-6 w-6 items-center justify-center rounded-full border border-slate-200 text-xs text-slate-600 hover:bg-slate-100"
                                                >
                                                    −
                                                </button>
                                                <span className="min-w-[1.5ch] text-center text-xs font-medium">
                                                    {item.quantity}
                                                </span>
                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        updateQty(
                                                            item,
                                                            Number(item.quantity) + 1
                                                        )
                                                    }
                                                    className="flex h-6 w-6 items-center justify-center rounded-full border border-slate-200 text-xs text-slate-600 hover:bg-slate-100"
                                                >
                                                    +
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() => removeItem(item)}
                                                    className="ml-2 text-xs text-slate-400 hover:text-rose-600"
                                                >
                                                    Remove
                                                </button>
                                            </div>
                                        </div>
                                    </li>
                                );
                            })}
                        </ul>
                    )}
                </div>

                {items.length > 0 && (
                    <div className="border-t border-slate-100 p-4 space-y-3">
                        <div className="flex items-center justify-between text-sm">
                            <span className="text-slate-500">Subtotal</span>
                            <span className="font-black text-slate-900">
                                {formatCurrency(total)}
                            </span>
                        </div>
                        <p className="text-xs text-slate-400">
                            Shipping and taxes calculated at checkout.
                        </p>
                        <Link
                            href="/cart"
                            onClick={onClose}
                            className="block w-full rounded-full bg-sky-500 py-3 text-center text-sm font-semibold text-white transition hover:bg-sky-600"
                        >
                            Go to checkout
                        </Link>
                        <button
                            type="button"
                            onClick={onClose}
                            className="block w-full rounded-full border border-slate-200 py-3 text-sm font-medium text-slate-600 hover:bg-slate-50"
                        >
                            Continue shopping
                        </button>
                    </div>
                )}
            </div>
        </>
    );
}
