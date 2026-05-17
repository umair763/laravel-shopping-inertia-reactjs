import React from "react";

const STEPS = [
    {
        key: "pending",
        label: "Order placed",
        description: "Your order has been received and is awaiting processing.",
        icon: "📋",
    },
    {
        key: "processing",
        label: "Processing",
        description: "We are preparing your items for shipment.",
        icon: "⚙️",
    },
    {
        key: "shipped",
        label: "Shipped",
        description: "Your order is on the way.",
        icon: "🚚",
    },
    {
        key: "delivered",
        label: "Delivered",
        description: "Your order has been successfully delivered.",
        icon: "✅",
    },
];

const CANCELLED_STEP = {
    key: "cancelled",
    label: "Cancelled",
    description: "This order was cancelled.",
    icon: "❌",
};

const STATUS_ORDER = ["pending", "processing", "shipped", "delivered"];

function getStepState(stepKey, currentStatus) {
    if (currentStatus === "cancelled") {
        return stepKey === "pending" ? "complete" : "inactive";
    }
    const currentIdx = STATUS_ORDER.indexOf(currentStatus);
    const stepIdx = STATUS_ORDER.indexOf(stepKey);
    if (stepIdx < currentIdx) return "complete";
    if (stepIdx === currentIdx) return "active";
    return "inactive";
}

export default function OrderTimeline({ status }) {
    const isCancelled = status === "cancelled";
    const steps = isCancelled
        ? [STEPS[0], CANCELLED_STEP]
        : STEPS;

    return (
        <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-slate-400">
                Order progress
            </p>
            <div className="mt-4">
                <ol className="relative">
                    {steps.map((step, idx) => {
                        const state = isCancelled
                            ? step.key === "cancelled"
                                ? "cancelled"
                                : step.key === "pending"
                                ? "complete"
                                : "inactive"
                            : getStepState(step.key, status);

                        const isLast = idx === steps.length - 1;

                        return (
                            <li key={step.key} className="flex gap-3">
                                <div className="flex flex-col items-center">
                                    <div
                                        className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-base transition-all ${
                                            state === "complete"
                                                ? "bg-emerald-100 text-emerald-700 shadow-sm shadow-emerald-100"
                                                : state === "active"
                                                ? "bg-sky-500 text-white shadow-md shadow-sky-200"
                                                : state === "cancelled"
                                                ? "bg-rose-100 text-rose-700"
                                                : "bg-slate-100 text-slate-400"
                                        }`}
                                    >
                                        {state === "complete" ? "✓" : step.icon}
                                    </div>
                                    {!isLast && (
                                        <div
                                            className={`mt-1 w-0.5 flex-1 min-h-[24px] rounded-full ${
                                                state === "complete"
                                                    ? "bg-emerald-200"
                                                    : "bg-slate-100"
                                            }`}
                                        />
                                    )}
                                </div>
                                <div className={`pb-5 pt-1 ${isLast ? "pb-0" : ""}`}>
                                    <p
                                        className={`text-sm font-semibold ${
                                            state === "active"
                                                ? "text-sky-700"
                                                : state === "cancelled"
                                                ? "text-rose-700"
                                                : state === "complete"
                                                ? "text-slate-900"
                                                : "text-slate-400"
                                        }`}
                                    >
                                        {step.label}
                                        {state === "active" && (
                                            <span className="ml-2 inline-flex items-center rounded-full bg-sky-50 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-sky-700">
                                                Current
                                            </span>
                                        )}
                                    </p>
                                    <p
                                        className={`mt-0.5 text-xs ${
                                            state === "inactive"
                                                ? "text-slate-300"
                                                : "text-slate-500"
                                        }`}
                                    >
                                        {step.description}
                                    </p>
                                </div>
                            </li>
                        );
                    })}
                </ol>
            </div>
        </div>
    );
}
