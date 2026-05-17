import React, { useState } from "react";

function SettingRow({ label, description, children }) {
    return (
        <div className="flex flex-col gap-3 py-5 sm:flex-row sm:items-start sm:justify-between">
            <div className="max-w-sm">
                <p className="text-sm font-semibold text-slate-900">{label}</p>
                {description && (
                    <p className="mt-0.5 text-xs text-slate-500">{description}</p>
                )}
            </div>
            <div className="shrink-0">{children}</div>
        </div>
    );
}

function Toggle({ checked, onChange, disabled }) {
    return (
        <button
            type="button"
            role="switch"
            aria-checked={checked}
            disabled={disabled}
            onClick={() => onChange(!checked)}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                checked ? "bg-sky-500" : "bg-slate-200"
            } disabled:opacity-50`}
        >
            <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${
                    checked ? "translate-x-6" : "translate-x-1"
                }`}
            />
        </button>
    );
}

export default function AdminSettings({ settings: serverSettings }) {
    const [saved, setSaved] = useState(false);
    const [saving, setSaving] = useState(false);

    const [general, setGeneral] = useState({
        storeName: serverSettings?.store_name || "BazaarDeck",
        storeEmail: serverSettings?.store_email || "",
        storeUrl: serverSettings?.store_url || "",
        currency: serverSettings?.currency || "USD",
        timezone: serverSettings?.timezone || "UTC",
    });

    const [commerce, setCommerce] = useState({
        allowGuestCheckout: serverSettings?.allow_guest_checkout ?? false,
        autoFulfillOrders: serverSettings?.auto_fulfill_orders ?? false,
        taxEnabled: serverSettings?.tax_enabled ?? false,
        taxRate: serverSettings?.tax_rate ?? 0,
        lowStockThreshold: serverSettings?.low_stock_threshold ?? 5,
    });

    const [notifications, setNotifications] = useState({
        orderCreated: serverSettings?.notify_order_created ?? true,
        orderShipped: serverSettings?.notify_order_shipped ?? true,
        lowStock: serverSettings?.notify_low_stock ?? true,
        newReview: serverSettings?.notify_new_review ?? false,
    });

    async function handleSave(e) {
        e.preventDefault();
        setSaving(true);
        setSaved(false);
        await new Promise((r) => setTimeout(r, 600));
        setSaving(false);
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
    }

    return (
        <section className="space-y-6">
            <header>
                <p className="text-[10px] uppercase tracking-[0.34em] text-slate-400">
                    Admin workspace
                </p>
                <h1 className="text-3xl font-black tracking-tight text-slate-900">
                    Settings
                </h1>
                <p className="mt-1 text-sm text-slate-500">
                    Configure your store preferences, commerce rules, and notification settings.
                </p>
            </header>

            <form onSubmit={handleSave} className="space-y-4">
                <div className="overflow-hidden rounded-[2rem] border border-slate-100 bg-white shadow-sm">
                    <div className="border-b border-slate-100 px-6 py-4">
                        <h2 className="text-base font-semibold text-slate-900">
                            General
                        </h2>
                        <p className="text-xs text-slate-500">
                            Basic store identity and regional settings.
                        </p>
                    </div>
                    <div className="divide-y divide-slate-50 px-6">
                        <SettingRow label="Store name" description="Displayed in the browser title and emails.">
                            <input
                                type="text"
                                value={general.storeName}
                                onChange={(e) =>
                                    setGeneral((g) => ({ ...g, storeName: e.target.value }))
                                }
                                className="w-56 rounded-2xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-100"
                            />
                        </SettingRow>
                        <SettingRow label="Store email" description="Used as the reply-to for transactional emails.">
                            <input
                                type="email"
                                value={general.storeEmail}
                                onChange={(e) =>
                                    setGeneral((g) => ({ ...g, storeEmail: e.target.value }))
                                }
                                placeholder="hello@yourstore.com"
                                className="w-56 rounded-2xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-100"
                            />
                        </SettingRow>
                        <SettingRow label="Currency" description="Default currency shown on the storefront.">
                            <select
                                value={general.currency}
                                onChange={(e) =>
                                    setGeneral((g) => ({ ...g, currency: e.target.value }))
                                }
                                className="w-40 rounded-2xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-100"
                            >
                                {["USD", "EUR", "GBP", "PKR", "AED", "SAR"].map((c) => (
                                    <option key={c} value={c}>{c}</option>
                                ))}
                            </select>
                        </SettingRow>
                        <SettingRow label="Timezone" description="Used for order timestamps and reports.">
                            <select
                                value={general.timezone}
                                onChange={(e) =>
                                    setGeneral((g) => ({ ...g, timezone: e.target.value }))
                                }
                                className="w-48 rounded-2xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-100"
                            >
                                {[
                                    "UTC",
                                    "America/New_York",
                                    "America/Los_Angeles",
                                    "Europe/London",
                                    "Asia/Karachi",
                                    "Asia/Dubai",
                                    "Asia/Riyadh",
                                ].map((tz) => (
                                    <option key={tz} value={tz}>{tz}</option>
                                ))}
                            </select>
                        </SettingRow>
                    </div>
                </div>

                <div className="overflow-hidden rounded-[2rem] border border-slate-100 bg-white shadow-sm">
                    <div className="border-b border-slate-100 px-6 py-4">
                        <h2 className="text-base font-semibold text-slate-900">Commerce</h2>
                        <p className="text-xs text-slate-500">
                            Order flow, tax, and inventory behaviour.
                        </p>
                    </div>
                    <div className="divide-y divide-slate-50 px-6">
                        <SettingRow
                            label="Allow guest checkout"
                            description="Let unauthenticated visitors place orders."
                        >
                            <Toggle
                                checked={commerce.allowGuestCheckout}
                                onChange={(v) =>
                                    setCommerce((c) => ({ ...c, allowGuestCheckout: v }))
                                }
                            />
                        </SettingRow>
                        <SettingRow
                            label="Tax calculations"
                            description="Apply tax to all orders at checkout."
                        >
                            <Toggle
                                checked={commerce.taxEnabled}
                                onChange={(v) =>
                                    setCommerce((c) => ({ ...c, taxEnabled: v }))
                                }
                            />
                        </SettingRow>
                        {commerce.taxEnabled && (
                            <SettingRow label="Tax rate (%)" description="Percentage applied to the subtotal.">
                                <input
                                    type="number"
                                    min={0}
                                    max={100}
                                    step={0.1}
                                    value={commerce.taxRate}
                                    onChange={(e) =>
                                        setCommerce((c) => ({
                                            ...c,
                                            taxRate: parseFloat(e.target.value) || 0,
                                        }))
                                    }
                                    className="w-24 rounded-2xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-100"
                                />
                            </SettingRow>
                        )}
                        <SettingRow
                            label="Low stock threshold"
                            description="Alert when available quantity drops to or below this number."
                        >
                            <input
                                type="number"
                                min={0}
                                value={commerce.lowStockThreshold}
                                onChange={(e) =>
                                    setCommerce((c) => ({
                                        ...c,
                                        lowStockThreshold: parseInt(e.target.value) || 0,
                                    }))
                                }
                                className="w-24 rounded-2xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-100"
                            />
                        </SettingRow>
                    </div>
                </div>

                <div className="overflow-hidden rounded-[2rem] border border-slate-100 bg-white shadow-sm">
                    <div className="border-b border-slate-100 px-6 py-4">
                        <h2 className="text-base font-semibold text-slate-900">
                            Notifications
                        </h2>
                        <p className="text-xs text-slate-500">
                            Choose which events trigger admin email notifications.
                        </p>
                    </div>
                    <div className="divide-y divide-slate-50 px-6">
                        {[
                            {
                                key: "orderCreated",
                                label: "New order placed",
                                description: "Notify when a customer completes checkout.",
                            },
                            {
                                key: "orderShipped",
                                label: "Order shipped",
                                description: "Notify when an order status is updated to shipped.",
                            },
                            {
                                key: "lowStock",
                                label: "Low stock alert",
                                description: "Notify when a variant falls below the threshold.",
                            },
                            {
                                key: "newReview",
                                label: "New product review",
                                description: "Notify when a customer posts a review.",
                            },
                        ].map(({ key, label, description }) => (
                            <SettingRow key={key} label={label} description={description}>
                                <Toggle
                                    checked={notifications[key]}
                                    onChange={(v) =>
                                        setNotifications((n) => ({ ...n, [key]: v }))
                                    }
                                />
                            </SettingRow>
                        ))}
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <button
                        type="submit"
                        disabled={saving}
                        className="rounded-full bg-sky-500 px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-sky-600 disabled:opacity-60"
                    >
                        {saving ? "Saving…" : "Save settings"}
                    </button>
                    {saved && (
                        <span className="text-sm font-semibold text-emerald-600">
                            ✓ Settings saved
                        </span>
                    )}
                </div>
            </form>
        </section>
    );
}
