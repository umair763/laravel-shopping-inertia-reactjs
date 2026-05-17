import React, { useState } from "react";
import { usePage, router } from "@inertiajs/react";
import { Star, StarOff, Pencil, Trash2, MessageSquare, Package } from "lucide-react";

function StarRating({ value, onChange, size = 20 }) {
    const [hover, setHover] = useState(0);
    const effective = hover || value;
    return (
        <div className="flex gap-0.5">
            {[1, 2, 3, 4, 5].map((s) => (
                <button
                    key={s}
                    type="button"
                    className="transition"
                    onMouseEnter={() => onChange && setHover(s)}
                    onMouseLeave={() => onChange && setHover(0)}
                    onClick={() => onChange?.(s)}
                >
                    <Star
                        size={size}
                        className={effective >= s ? "fill-amber-400 text-amber-400" : "text-slate-200"}
                    />
                </button>
            ))}
        </div>
    );
}

function ReviewCard({ review, onDelete }) {
    return (
        <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
            <div className="flex items-start justify-between gap-3">
                <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-bold text-slate-900">{review.product_name}</p>
                    <div className="mt-1 flex items-center gap-2">
                        <StarRating value={review.rating} />
                        <span className="text-xs text-slate-400">
                            {new Date(review.created_at).toLocaleDateString("en-US", {
                                month: "short", day: "numeric", year: "numeric",
                            })}
                        </span>
                    </div>
                </div>
                <button
                    onClick={() => onDelete(review.id)}
                    className="rounded-xl p-2 text-slate-400 transition hover:bg-rose-50 hover:text-rose-500"
                    title="Delete review"
                >
                    <Trash2 size={15} />
                </button>
            </div>
            {review.title && (
                <p className="mt-3 text-sm font-semibold text-slate-800">{review.title}</p>
            )}
            {review.comment && (
                <p className="mt-1 text-sm leading-6 text-slate-500">{review.comment}</p>
            )}
        </div>
    );
}

function WriteReviewModal({ product, onClose, onSubmit }) {
    const [form, setForm] = useState({ rating: 0, title: "", comment: "" });
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");

    async function handleSubmit(e) {
        e.preventDefault();
        if (!form.rating) { setError("Please select a rating."); return; }
        setSaving(true);
        setError("");
        try {
            const res = await fetch("/reviews", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "X-Requested-With": "XMLHttpRequest",
                    "X-CSRF-TOKEN": document.querySelector('meta[name="csrf-token"]')?.content || "",
                },
                credentials: "include",
                body: JSON.stringify({ product_id: product.id, ...form }),
            });
            if (res.ok) {
                onSubmit();
            } else {
                const data = await res.json();
                setError(data.message || "Failed to submit review.");
            }
        } catch {
            setError("Network error. Please try again.");
        } finally {
            setSaving(false);
        }
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
            <div className="relative w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl">
                <h2 className="text-lg font-black text-slate-900">Write a Review</h2>
                <p className="mt-1 text-sm text-slate-500">
                    Reviewing: <strong>{product.name}</strong>
                </p>
                <form onSubmit={handleSubmit} className="mt-5 space-y-4">
                    {error && (
                        <p className="rounded-xl bg-rose-50 px-4 py-2 text-sm text-rose-600">{error}</p>
                    )}
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-700">Your rating</label>
                        <StarRating value={form.rating} onChange={(r) => setForm((p) => ({ ...p, rating: r }))} size={24} />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-700">Review title (optional)</label>
                        <input
                            type="text"
                            placeholder="Summarize your experience"
                            value={form.title}
                            onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))}
                            className="w-full rounded-2xl border border-zinc-200 bg-white px-4 py-3 text-sm text-zinc-900 placeholder:text-zinc-400 focus:border-sky-400 focus:outline-none focus:ring-4 focus:ring-sky-100"
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-700">Your review (optional)</label>
                        <textarea
                            rows={3}
                            placeholder="Tell others what you think about this product…"
                            value={form.comment}
                            onChange={(e) => setForm((p) => ({ ...p, comment: e.target.value }))}
                            className="w-full resize-none rounded-2xl border border-zinc-200 bg-white px-4 py-3 text-sm text-zinc-900 placeholder:text-zinc-400 focus:border-sky-400 focus:outline-none focus:ring-4 focus:ring-sky-100"
                        />
                    </div>
                    <div className="flex gap-3">
                        <button
                            type="submit"
                            disabled={saving}
                            className="flex-1 rounded-2xl bg-sky-500 py-3 text-sm font-bold text-white transition hover:bg-sky-600 disabled:opacity-70"
                        >
                            {saving ? "Submitting…" : "Submit Review"}
                        </button>
                        <button
                            type="button"
                            onClick={onClose}
                            className="rounded-2xl border border-slate-200 px-5 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
                        >
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default function CustomerReviewsPage() {
    const { props } = usePage();
    const { reviews = [], pending_review_products = [] } = props;
    const [writeFor, setWriteFor] = useState(null);

    async function handleDelete(reviewId) {
        if (!confirm("Delete this review?")) return;
        await fetch(`/reviews/${reviewId}`, {
            method: "DELETE",
            headers: {
                "X-Requested-With": "XMLHttpRequest",
                "X-CSRF-TOKEN": document.querySelector('meta[name="csrf-token"]')?.content || "",
            },
            credentials: "include",
        });
        router.reload();
    }

    function handleReviewSubmit() {
        setWriteFor(null);
        router.reload();
    }

    return (
        <div className="space-y-8">
            {writeFor && (
                <WriteReviewModal
                    product={writeFor}
                    onClose={() => setWriteFor(null)}
                    onSubmit={handleReviewSubmit}
                />
            )}

            <div>
                <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-sky-500">
                    Customer Portal
                </p>
                <h1 className="text-3xl font-black tracking-tight text-slate-900">My Reviews</h1>
                <p className="mt-1 text-sm text-slate-500">
                    Reviews you've written and products waiting for your feedback.
                </p>
            </div>

            {pending_review_products.length > 0 && (
                <div className="rounded-3xl border border-amber-100 bg-amber-50/60 p-6">
                    <div className="flex items-center gap-2 mb-4">
                        <StarOff size={18} className="text-amber-600" />
                        <h2 className="text-base font-bold text-amber-900">
                            Pending Reviews ({pending_review_products.length})
                        </h2>
                    </div>
                    <p className="text-sm text-amber-700 mb-4">
                        You've purchased these products but haven't reviewed them yet.
                    </p>
                    <div className="grid gap-3 sm:grid-cols-2">
                        {pending_review_products.map((product) => (
                            <div
                                key={product.id}
                                className="flex items-center justify-between gap-3 rounded-2xl border border-amber-100 bg-white px-4 py-3"
                            >
                                <div className="flex items-center gap-3 min-w-0">
                                    <Package size={18} className="shrink-0 text-amber-400" />
                                    <p className="truncate text-sm font-medium text-slate-800">{product.name}</p>
                                </div>
                                <button
                                    onClick={() => setWriteFor(product)}
                                    className="shrink-0 rounded-xl bg-amber-500 px-3.5 py-1.5 text-xs font-bold text-white transition hover:bg-amber-600"
                                >
                                    Write review
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            <div>
                <div className="flex items-center gap-2 mb-4">
                    <MessageSquare size={18} className="text-slate-400" />
                    <h2 className="text-base font-bold text-slate-900">
                        Your Reviews ({reviews.length})
                    </h2>
                </div>

                {reviews.length === 0 ? (
                    <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-slate-200 py-16 text-center">
                        <Star size={36} className="text-slate-300" />
                        <p className="mt-3 text-sm font-medium text-slate-500">No reviews yet</p>
                        <p className="mt-1 text-xs text-slate-400">
                            Buy a product and share your experience with others.
                        </p>
                    </div>
                ) : (
                    <div className="grid gap-4 sm:grid-cols-2">
                        {reviews.map((review) => (
                            <ReviewCard key={review.id} review={review} onDelete={handleDelete} />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
