import React, { useState } from "react";
import { Link, router, usePage } from "@inertiajs/react";

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

function StarPicker({ value, onChange }) {
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((n) => (
        <button
          key={n}
          type="button"
          aria-label={`${n} star`}
          onClick={() => onChange(n)}
          className={`text-2xl leading-none ${n <= value ? "text-amber-400" : "text-slate-300"}`}
        >
          ★
        </button>
      ))}
    </div>
  );
}

export default function ProductDetails({ product }) {
  const { props } = usePage();
  const user = props?.auth?.user;
  const [qty, setQty] = useState(1);
  const [addingToCart, setAddingToCart] = useState(false);
  const [cartMessage, setCartMessage] = useState(null);
  const [cartError, setCartError] = useState(null);

  const [review, setReview] = useState({ rating: 5, title: "", comment: "" });
  const [submittingReview, setSubmittingReview] = useState(false);
  const [reviewMessage, setReviewMessage] = useState(null);
  const [reviewError, setReviewError] = useState(null);

  const price = Number(product?.effective_price ?? product?.price ?? 0);
  const hasDiscount = product?.discount_price != null && Number(product.discount_price) < Number(product?.price ?? 0);
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
      await postJson("/cart/items", { variant_id: product.variant_id, quantity: qty });
      setCartMessage("Added to cart.");
    } catch (e) {
      setCartError(e.message);
    } finally {
      setAddingToCart(false);
    }
  }

  async function submitReview(e) {
    e.preventDefault();
    if (!user) {
      router.visit("/login");
      return;
    }
    setSubmittingReview(true);
    setReviewMessage(null);
    setReviewError(null);
    try {
      await postJson("/reviews", {
        product_id: product.id,
        rating: review.rating,
        title: review.title || null,
        comment: review.comment || null,
      });
      setReviewMessage("Thanks for your review.");
      setReview({ rating: 5, title: "", comment: "" });
    } catch (e) {
      setReviewError(e.message);
    } finally {
      setSubmittingReview(false);
    }
  }

  if (!product) {
    return <div className="p-6 text-sm text-slate-500">Product not found.</div>;
  }

  return (
    <div className="space-y-8">
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="overflow-hidden rounded-[2rem] border border-slate-100 bg-white shadow-sm">
          {product.image_url ? (
            <img src={product.image_url} alt={product.name} className="h-full w-full object-cover" />
          ) : (
            <div className="aspect-square w-full bg-slate-100" />
          )}
        </div>

        <div className="space-y-5">
          <div>
            <p className="text-xs uppercase tracking-[0.24em] text-slate-400">{product.brand || product.category_name || "Storefront"}</p>
            <h1 className="mt-1 text-3xl font-black tracking-tight text-slate-900">{product.name}</h1>
            <p className="mt-2 text-sm text-slate-500">{product.short_description || product.description}</p>
          </div>

          <div className="flex items-baseline gap-3">
            <p className="text-3xl font-black text-slate-900">${price.toFixed(2)}</p>
            {hasDiscount && (
              <p className="text-base text-slate-400 line-through">${Number(product.price).toFixed(2)}</p>
            )}
          </div>

          <p className="text-xs text-slate-500">
            {stock > 0 ? `In stock (${stock} available)` : "Out of stock"}
            {product.sku ? <span className="ml-2">· SKU {product.sku}</span> : null}
          </p>

          <div className="flex flex-wrap items-center gap-3">
            <div className="inline-flex items-center rounded-full border border-slate-200">
              <button type="button" onClick={() => setQty(Math.max(1, qty - 1))} className="px-3 py-2 text-sm">−</button>
              <span className="min-w-[2ch] px-2 text-center text-sm">{qty}</span>
              <button type="button" onClick={() => setQty(qty + 1)} className="px-3 py-2 text-sm">+</button>
            </div>
            <button
              type="button"
              onClick={addToCart}
              disabled={addingToCart || !canBuy}
              className="rounded-full bg-sky-500 px-6 py-3 text-sm font-semibold text-white hover:bg-sky-600 disabled:opacity-60"
            >
              {addingToCart ? "Adding..." : user ? "Add to cart" : "Sign in to buy"}
            </button>
            <Link href="/cart" className="text-sm font-semibold text-sky-700 hover:underline">View cart</Link>
          </div>

          {cartMessage && <p className="text-sm text-emerald-600">{cartMessage}</p>}
          {cartError && <p className="text-sm text-rose-600">{cartError}</p>}

          {product.description && product.description !== product.short_description && (
            <div className="space-y-2 pt-4">
              <h2 className="text-sm font-semibold text-slate-900">Details</h2>
              <p className="whitespace-pre-line text-sm text-slate-600">{product.description}</p>
            </div>
          )}
        </div>
      </div>

      {/* Review form (auth-aware) */}
      <section className="rounded-[2rem] border border-slate-100 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-900">Write a review</h2>
        {user ? (
          <form onSubmit={submitReview} className="mt-4 space-y-3">
            <div className="space-y-1">
              <label className="text-xs uppercase tracking-[0.2em] text-slate-500">Rating</label>
              <StarPicker value={review.rating} onChange={(rating) => setReview({ ...review, rating })} />
            </div>
            <div className="space-y-1">
              <label className="text-xs uppercase tracking-[0.2em] text-slate-500">Title</label>
              <input
                value={review.title}
                onChange={(e) => setReview({ ...review, title: e.target.value })}
                className="w-full rounded-2xl border border-zinc-200 bg-white px-4 py-2 text-sm shadow-sm focus:border-sky-400 focus:outline-none focus:ring-4 focus:ring-sky-100"
                placeholder="Summarize your experience"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs uppercase tracking-[0.2em] text-slate-500">Comment</label>
              <textarea
                value={review.comment}
                onChange={(e) => setReview({ ...review, comment: e.target.value })}
                rows={3}
                className="w-full rounded-2xl border border-zinc-200 bg-white px-4 py-2 text-sm shadow-sm focus:border-sky-400 focus:outline-none focus:ring-4 focus:ring-sky-100"
                placeholder="What did you think?"
              />
            </div>
            {reviewMessage && <p className="text-sm text-emerald-600">{reviewMessage}</p>}
            {reviewError && <p className="text-sm text-rose-600">{reviewError}</p>}
            <button
              type="submit"
              disabled={submittingReview}
              className="rounded-full bg-sky-500 px-5 py-2 text-sm font-semibold text-white hover:bg-sky-600 disabled:opacity-60"
            >
              {submittingReview ? "Posting..." : "Post review"}
            </button>
          </form>
        ) : (
          <p className="mt-3 text-sm text-slate-500">
            <Link href="/login" className="font-semibold text-sky-700 hover:underline">Sign in</Link> to leave a review.
          </p>
        )}
      </section>
    </div>
  );
}
