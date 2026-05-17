import React from "react";

function StarDisplay({ rating, size = "sm" }) {
    const filled = Math.round(Number(rating || 0));
    const sizeClass = size === "lg" ? "text-2xl" : "text-sm";
    return (
        <span className={`inline-flex gap-0.5 ${sizeClass}`} aria-label={`${filled} out of 5 stars`}>
            {[1, 2, 3, 4, 5].map((n) => (
                <span key={n} className={n <= filled ? "text-amber-400" : "text-slate-200"}>★</span>
            ))}
        </span>
    );
}

function RatingBar({ label, count, total }) {
    const pct = total > 0 ? Math.round((count / total) * 100) : 0;
    return (
        <div className="flex items-center gap-2 text-xs text-slate-600">
            <span className="w-6 shrink-0 text-right">{label}★</span>
            <div className="h-2 flex-1 overflow-hidden rounded-full bg-slate-100">
                <div
                    className="h-full rounded-full bg-amber-400 transition-all duration-500"
                    style={{ width: `${pct}%` }}
                />
            </div>
            <span className="w-8 shrink-0 text-slate-400">{count}</span>
        </div>
    );
}

function formatDate(dateStr) {
    if (!dateStr) return "";
    try {
        return new Date(dateStr).toLocaleDateString(undefined, {
            year: "numeric",
            month: "short",
            day: "numeric",
        });
    } catch {
        return dateStr;
    }
}

function getInitials(name, email) {
    const src = name || email || "?";
    return src
        .trim()
        .split(/\s+/)
        .slice(0, 2)
        .map((p) => p[0]?.toUpperCase() || "")
        .join("");
}

const AVATAR_COLORS = [
    "bg-sky-100 text-sky-700",
    "bg-violet-100 text-violet-700",
    "bg-emerald-100 text-emerald-700",
    "bg-amber-100 text-amber-700",
    "bg-rose-100 text-rose-700",
];

function colorForName(name) {
    if (!name) return AVATAR_COLORS[0];
    return AVATAR_COLORS[name.charCodeAt(0) % AVATAR_COLORS.length];
}

export default function ReviewList({ reviews = [] }) {
    if (!Array.isArray(reviews) || reviews.length === 0) {
        return (
            <div className="rounded-2xl border border-slate-100 bg-slate-50 px-6 py-10 text-center">
                <p className="text-4xl">✍️</p>
                <p className="mt-3 text-sm font-semibold text-slate-700">No reviews yet</p>
                <p className="mt-1 text-xs text-slate-400">
                    Be the first to share your experience with this product.
                </p>
            </div>
        );
    }

    const totalCount = reviews.length;
    const avgRating =
        reviews.reduce((sum, r) => sum + Number(r.rating || 0), 0) / totalCount;

    const distribution = [5, 4, 3, 2, 1].map((star) => ({
        star,
        count: reviews.filter((r) => Math.round(Number(r.rating)) === star).length,
    }));

    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-5 rounded-2xl border border-slate-100 bg-white p-5 shadow-sm sm:flex-row sm:items-center">
                <div className="flex flex-col items-center sm:min-w-[100px] sm:items-start">
                    <p className="text-5xl font-black tracking-tight text-slate-900">
                        {avgRating.toFixed(1)}
                    </p>
                    <StarDisplay rating={avgRating} size="lg" />
                    <p className="mt-1 text-xs text-slate-500">
                        {totalCount} review{totalCount !== 1 ? "s" : ""}
                    </p>
                </div>
                <div className="flex-1 space-y-2">
                    {distribution.map(({ star, count }) => (
                        <RatingBar key={star} label={star} count={count} total={totalCount} />
                    ))}
                </div>
            </div>

            <ul className="space-y-4">
                {reviews.map((review, idx) => {
                    const name =
                        review.user?.name ||
                        review.user?.email ||
                        "Anonymous";
                    const initials = getInitials(
                        review.user?.name,
                        review.user?.email
                    );
                    const color = colorForName(name);

                    return (
                        <li
                            key={review.id || idx}
                            className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm"
                        >
                            <div className="flex items-start gap-3">
                                <div
                                    className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-sm font-bold ${color}`}
                                >
                                    {initials || "?"}
                                </div>
                                <div className="min-w-0 flex-1">
                                    <div className="flex flex-wrap items-center justify-between gap-2">
                                        <p className="text-sm font-semibold text-slate-900">
                                            {name}
                                        </p>
                                        <span className="text-xs text-slate-400">
                                            {formatDate(review.created_at)}
                                        </span>
                                    </div>
                                    <div className="mt-0.5">
                                        <StarDisplay rating={review.rating} />
                                    </div>
                                    {review.title && (
                                        <p className="mt-2 text-sm font-semibold text-slate-800">
                                            {review.title}
                                        </p>
                                    )}
                                    {review.comment && (
                                        <p className="mt-1 whitespace-pre-line text-sm leading-6 text-slate-600">
                                            {review.comment}
                                        </p>
                                    )}
                                </div>
                            </div>
                        </li>
                    );
                })}
            </ul>
        </div>
    );
}
