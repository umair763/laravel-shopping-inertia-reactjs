import React, { useState } from "react";
import { Link, router, usePage } from "@inertiajs/react";
import ReviewList from "../../reviews/components/review.list.jsx";
import ReviewForm from "../../reviews/components/review.form.jsx";

function getXsrfHeader() {
    const match = document.cookie.match(/XSRF-TOKEN=([^;]+)/);
    return match ? decodeURIComponent(match[1]) : "";
}

async function postJson(url, body) {
    const res = await fetch(url, {
        method: "POST",
        credentials: "same-origin",
        headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            "X-Requested-With": "XMLHttpRequest",
            "X-XSRF-TOKEN": getXsrfHeader(),
        },
        body: JSON.stringify(body),
    });
    if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.message || `Request failed: ${res.status}`);
    }
    return res.json();
}

export default function ProductDetails({ product, reviews: initialReviews = [] }) {
    const { props } = usePage();
    const user = props?.auth?.user;
    const [qty, setQty] = useState(1);
    const [addingToCart, setAddingToCart] = useState(false);
    const [cartMessage, setCartMessage] = useState(null);
    const [cartError, setCartError] = useState(null);
    const [reviews, setReviews] = useState(initialReviews);
    const [activeTab, setActiveTab] = useState("reviews");

    const price = Number(product?.effective_price ?? product?.price ?? 0);
    const hasDiscount =
        product?.discount_price != null &&
        Number(product.discount_price) < Number(product?.price ?? 0);
    const stock = Number(product?.quantity ?? 0);
    const canBuy = Boolean(product?.variant_id) && stock > 0;

    async function addToCart() {
        if (!user) {
            router.visit("/login");
            return;
        }
        if (!product?.variant_id) {
            setCartError("This product cannot be purchased right now.");
            return;
        }
        setAddingToCart(true);
        setCartMessage(null);
        setCartError(null);
        try {
            await postJson("/cart/items", {
                variant_id: product.variant_id,
                quantity: qty,
            });
            setCartMessage("Added to cart successfully.");
        } catch (e) {
            setCartError(e.message);
        } finally {
            setAddingToCart(false);
        }
    }

    function handleReviewSuccess() {
        router.reload({ only: ["reviews"] });
    }

    if (!product) {
        return (
            <div className="p-6 text-sm text-slate-500">Product not found.</div>
        );
    }

    const avgRating =
        reviews.length > 0
            ? reviews.reduce((s, r) => s + Number(r.rating || 0), 0) /
              reviews.length
            : null;

    return (
        <div className="space-y-10">
            <div className="grid gap-8 lg:grid-cols-2">
                <div className="overflow-hidden rounded-[2rem] border border-slate-100 bg-white shadow-sm">
                    {product.image_url ? (
                        <img
                            src={product.image_url}
                            alt={product.name}
                            className="h-full w-full object-cover"
                        />
                    ) : (
                        <div className="aspect-square w-full bg-gradient-to-br from-slate-100 to-slate-50" />
                    )}
                </div>

                <div className="space-y-5">
                    <div>
                        <p className="text-xs uppercase tracking-[0.24em] text-slate-400">
                            {product.brand || product.category_name || "Storefront"}
                        </p>
                        <h1 className="mt-1 text-3xl font-black tracking-tight text-slate-900">
                            {product.name}
                        </h1>
                        {avgRating !== null && (
                            <div className="mt-1.5 flex items-center gap-2">
                                <span className="text-amber-400">
                                    {"★".repeat(Math.round(avgRating))}
                                    {"☆".repeat(5 - Math.round(avgRating))}
                                </span>
                                <span className="text-xs text-slate-400">
                                    {avgRating.toFixed(1)} · {reviews.length} review{reviews.length !== 1 ? "s" : ""}
                                </span>
                            </div>
                        )}
                        {product.short_description && (
                            <p className="mt-3 text-sm leading-6 text-slate-500">
                                {product.short_description}
                            </p>
                        )}
                    </div>

                    <div className="flex items-baseline gap-3">
                        <p className="text-3xl font-black text-slate-900">
                            ${price.toFixed(2)}
                        </p>
                        {hasDiscount && (
                            <p className="text-base text-slate-400 line-through">
                                ${Number(product.price).toFixed(2)}
                            </p>
                        )}
                    </div>

                    <p className="text-xs text-slate-500">
                        {stock > 0
                            ? `In stock (${stock} available)`
                            : "Out of stock"}
                        {product.sku ? (
                            <span className="ml-2">· SKU {product.sku}</span>
                        ) : null}
                    </p>

                    <div className="flex flex-wrap items-center gap-3">
                        <div className="inline-flex items-center rounded-full border border-slate-200">
                            <button
                                type="button"
                                onClick={() => setQty(Math.max(1, qty - 1))}
                                className="px-3 py-2 text-sm text-slate-700 hover:text-slate-900"
                            >
                                −
                            </button>
                            <span className="min-w-[2ch] px-2 text-center text-sm font-medium">
                                {qty}
                            </span>
                            <button
                                type="button"
                                onClick={() => setQty(qty + 1)}
                                className="px-3 py-2 text-sm text-slate-700 hover:text-slate-900"
                            >
                                +
                            </button>
                        </div>
                        <button
                            type="button"
                            onClick={addToCart}
                            disabled={addingToCart || !canBuy}
                            className="rounded-full bg-sky-500 px-6 py-3 text-sm font-semibold text-white transition hover:bg-sky-600 disabled:opacity-60"
                        >
                            {addingToCart
                                ? "Adding…"
                                : canBuy
                                ? "Add to cart"
                                : stock === 0
                                ? "Out of stock"
                                : "Sign in to buy"}
                        </button>
                        <Link
                            href="/cart"
                            className="text-sm font-semibold text-sky-700 hover:underline"
                        >
                            View cart
                        </Link>
                    </div>

                    {cartMessage && (
                        <div className="rounded-2xl border border-emerald-100 bg-emerald-50 px-4 py-2.5 text-sm text-emerald-700">
                            {cartMessage}
                        </div>
                    )}
                    {cartError && (
                        <div className="rounded-2xl border border-rose-100 bg-rose-50 px-4 py-2.5 text-sm text-rose-700">
                            {cartError}
                        </div>
                    )}

                    {product.description &&
                        product.description !== product.short_description && (
                            <div className="space-y-2 border-t border-slate-100 pt-4">
                                <h2 className="text-sm font-semibold text-slate-900">
                                    Product details
                                </h2>
                                <p className="whitespace-pre-line text-sm leading-6 text-slate-600">
                                    {product.description}
                                </p>
                            </div>
                        )}
                </div>
            </div>

            <section className="space-y-5">
                <div className="flex border-b border-slate-100">
                    {[
                        { key: "reviews", label: `Reviews (${reviews.length})` },
                        { key: "write", label: "Write a review" },
                    ].map(({ key, label }) => (
                        <button
                            key={key}
                            type="button"
                            onClick={() => setActiveTab(key)}
                            className={`px-5 py-3 text-sm font-semibold transition-colors ${
                                activeTab === key
                                    ? "border-b-2 border-sky-500 text-sky-700"
                                    : "text-slate-500 hover:text-slate-800"
                            }`}
                        >
                            {label}
                        </button>
                    ))}
                </div>

                {activeTab === "reviews" && (
                    <ReviewList reviews={reviews} />
                )}

                {activeTab === "write" && (
                    <div className="rounded-[2rem] border border-slate-100 bg-white p-6 shadow-sm">
                        <h2 className="text-lg font-semibold text-slate-900">
                            Share your experience
                        </h2>
                        <p className="mt-1 text-sm text-slate-400">
                            Help other shoppers by sharing an honest review.
                        </p>
                        <div className="mt-5">
                            <ReviewForm
                                productId={product.id}
                                onSuccess={() => {
                                    handleReviewSuccess();
                                    setActiveTab("reviews");
                                }}
                            />
                        </div>
                    </div>
                )}
            </section>
        </div>
    );
}
