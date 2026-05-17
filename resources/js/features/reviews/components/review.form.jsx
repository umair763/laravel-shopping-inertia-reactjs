import React, { useState } from "react";
import { router, usePage } from "@inertiajs/react";

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

function StarPicker({ value, onChange, disabled }) {
    const [hovered, setHovered] = useState(0);
    const display = hovered || value;
    const labels = ["Poor", "Fair", "Good", "Very good", "Excellent"];

    return (
        <div className="space-y-1">
            <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((n) => (
                    <button
                        key={n}
                        type="button"
                        disabled={disabled}
                        aria-label={`${n} star${n > 1 ? "s" : ""} — ${labels[n - 1]}`}
                        onClick={() => onChange(n)}
                        onMouseEnter={() => setHovered(n)}
                        onMouseLeave={() => setHovered(0)}
                        className={`text-3xl leading-none transition-transform ${
                            n <= display ? "scale-110 text-amber-400" : "text-slate-200"
                        } disabled:cursor-not-allowed`}
                    >
                        ★
                    </button>
                ))}
            </div>
            {display > 0 && (
                <p className="text-xs font-medium text-amber-600">
                    {labels[display - 1]}
                </p>
            )}
        </div>
    );
}

export default function ReviewForm({ productId, onSuccess }) {
    const { props } = usePage();
    const user = props?.auth?.user;

    const [form, setForm] = useState({ rating: 5, title: "", comment: "" });
    const [submitting, setSubmitting] = useState(false);
    const [message, setMessage] = useState(null);
    const [error, setError] = useState(null);

    if (!user) {
        return (
            <div className="rounded-2xl border border-slate-100 bg-slate-50 p-5 text-center">
                <p className="text-sm text-slate-600">
                    <button
                        type="button"
                        onClick={() => router.visit("/login")}
                        className="font-semibold text-sky-700 hover:underline"
                    >
                        Sign in
                    </button>{" "}
                    to leave a review.
                </p>
            </div>
        );
    }

    async function handleSubmit(e) {
        e.preventDefault();
        setSubmitting(true);
        setMessage(null);
        setError(null);
        try {
            await postJson("/reviews", {
                product_id: productId,
                rating: form.rating,
                title: form.title || null,
                comment: form.comment || null,
            });
            setMessage("Thanks for your review! It has been posted.");
            setForm({ rating: 5, title: "", comment: "" });
            if (onSuccess) onSuccess();
        } catch (err) {
            setError(err.message || "Failed to post review. Please try again.");
        } finally {
            setSubmitting(false);
        }
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
                <label className="block text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                    Your rating
                </label>
                <StarPicker
                    value={form.rating}
                    onChange={(rating) => setForm((f) => ({ ...f, rating }))}
                    disabled={submitting}
                />
            </div>

            <div className="space-y-1.5">
                <label
                    htmlFor="review-title"
                    className="block text-xs font-semibold uppercase tracking-[0.2em] text-slate-500"
                >
                    Title <span className="text-slate-300">(optional)</span>
                </label>
                <input
                    id="review-title"
                    type="text"
                    value={form.title}
                    onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
                    disabled={submitting}
                    maxLength={255}
                    placeholder="Summarize your experience"
                    className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-sm shadow-sm outline-none transition focus:border-sky-400 focus:ring-4 focus:ring-sky-100 disabled:opacity-60"
                />
            </div>

            <div className="space-y-1.5">
                <label
                    htmlFor="review-comment"
                    className="block text-xs font-semibold uppercase tracking-[0.2em] text-slate-500"
                >
                    Comment <span className="text-slate-300">(optional)</span>
                </label>
                <textarea
                    id="review-comment"
                    value={form.comment}
                    onChange={(e) => setForm((f) => ({ ...f, comment: e.target.value }))}
                    disabled={submitting}
                    rows={3}
                    placeholder="Tell us what you liked or disliked, and why…"
                    className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-sm shadow-sm outline-none transition focus:border-sky-400 focus:ring-4 focus:ring-sky-100 disabled:opacity-60"
                />
            </div>

            {message && (
                <div className="rounded-2xl border border-emerald-100 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
                    {message}
                </div>
            )}
            {error && (
                <div className="rounded-2xl border border-rose-100 bg-rose-50 px-4 py-3 text-sm text-rose-700">
                    {error}
                </div>
            )}

            <button
                type="submit"
                disabled={submitting}
                className="rounded-full bg-sky-500 px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-sky-600 disabled:opacity-60"
            >
                {submitting ? "Posting…" : "Post review"}
            </button>
        </form>
    );
}
