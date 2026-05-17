import React, { useState } from "react";
import { Lock, Mail, ShieldAlert, CheckCircle, XCircle, Eye, EyeOff } from "lucide-react";

function Spinner() {
    return (
        <svg className="h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
    );
}

function Toast({ toast }) {
    if (!toast) return null;
    return (
        <div className={`flex items-center gap-3 rounded-2xl border px-5 py-3.5 text-sm font-medium shadow-sm ${
            toast.type === "success"
                ? "border-emerald-100 bg-emerald-50 text-emerald-700"
                : "border-rose-100 bg-rose-50 text-rose-700"
        }`}>
            {toast.type === "success" ? <CheckCircle size={18} /> : <XCircle size={18} />}
            {toast.message}
        </div>
    );
}

function PasswordField({ label, value, onChange, disabled, placeholder }) {
    const [visible, setVisible] = useState(false);
    return (
        <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700">{label}</label>
            <div className="relative">
                <input
                    type={visible ? "text" : "password"}
                    value={value}
                    onChange={onChange}
                    disabled={disabled}
                    placeholder={placeholder}
                    className="w-full rounded-2xl border border-zinc-200 bg-white px-4 py-3 pr-12 text-sm text-zinc-900 shadow-sm placeholder:text-zinc-400 focus:border-sky-400 focus:outline-none focus:ring-4 focus:ring-sky-100 disabled:opacity-60"
                />
                <button
                    type="button"
                    tabIndex={-1}
                    onClick={() => setVisible((v) => !v)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-700"
                >
                    {visible ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
            </div>
        </div>
    );
}

export default function AccountSettingsPage() {
    const [passwordForm, setPasswordForm] = useState({
        current_password: "", password: "", password_confirmation: "",
    });
    const [passwordSaving, setPasswordSaving] = useState(false);
    const [passwordErrors, setPasswordErrors] = useState({});
    const [passwordToast, setPasswordToast] = useState(null);

    const [deleteConfirm, setDeleteConfirm] = useState("");
    const [showDeleteZone, setShowDeleteZone] = useState(false);

    function showToast(setter, type, message) {
        setter({ type, message });
        setTimeout(() => setter(null), 4500);
    }

    async function handlePasswordChange(e) {
        e.preventDefault();
        setPasswordErrors({});
        if (passwordForm.password !== passwordForm.password_confirmation) {
            setPasswordErrors({ password_confirmation: "Passwords do not match." });
            return;
        }
        setPasswordSaving(true);
        try {
            const res = await fetch("/account/password", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "X-Requested-With": "XMLHttpRequest",
                    "X-CSRF-TOKEN": document.querySelector('meta[name="csrf-token"]')?.content || "",
                },
                credentials: "include",
                body: JSON.stringify(passwordForm),
            });
            const data = await res.json();
            if (res.ok) {
                showToast(setPasswordToast, "success", "Password updated successfully.");
                setPasswordForm({ current_password: "", password: "", password_confirmation: "" });
            } else {
                setPasswordErrors(data.errors || {});
                showToast(setPasswordToast, "error", data.message || "Failed to update password.");
            }
        } catch {
            showToast(setPasswordToast, "error", "Network error. Please try again.");
        } finally {
            setPasswordSaving(false);
        }
    }

    return (
        <div className="space-y-8">
            <div>
                <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-sky-500">
                    Customer Portal
                </p>
                <h1 className="text-3xl font-black tracking-tight text-slate-900">Account Settings</h1>
                <p className="mt-1 text-sm text-slate-500">
                    Manage your security settings and account preferences.
                </p>
            </div>

            <div className="rounded-3xl border border-slate-100 bg-white p-6 shadow-sm">
                <div className="mb-5 flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-sky-50">
                        <Lock size={20} className="text-sky-600" />
                    </div>
                    <div>
                        <h2 className="text-base font-bold text-slate-900">Change Password</h2>
                        <p className="text-xs text-slate-500">Use a strong password to keep your account secure.</p>
                    </div>
                </div>

                <Toast toast={passwordToast} />

                <form onSubmit={handlePasswordChange} className="mt-4 space-y-4">
                    <PasswordField
                        label="Current password"
                        value={passwordForm.current_password}
                        onChange={(e) => setPasswordForm((p) => ({ ...p, current_password: e.target.value }))}
                        disabled={passwordSaving}
                        placeholder="Your current password"
                    />
                    {passwordErrors.current_password && (
                        <p className="text-sm text-rose-600">{passwordErrors.current_password}</p>
                    )}

                    <div className="grid gap-4 sm:grid-cols-2">
                        <PasswordField
                            label="New password"
                            value={passwordForm.password}
                            onChange={(e) => setPasswordForm((p) => ({ ...p, password: e.target.value }))}
                            disabled={passwordSaving}
                            placeholder="Min. 8 characters"
                        />
                        <PasswordField
                            label="Confirm new password"
                            value={passwordForm.password_confirmation}
                            onChange={(e) => setPasswordForm((p) => ({ ...p, password_confirmation: e.target.value }))}
                            disabled={passwordSaving}
                            placeholder="Repeat new password"
                        />
                    </div>
                    {passwordErrors.password_confirmation && (
                        <p className="text-sm text-rose-600">{passwordErrors.password_confirmation}</p>
                    )}
                    {passwordErrors.password && (
                        <p className="text-sm text-rose-600">{passwordErrors.password}</p>
                    )}

                    <div className="rounded-2xl border border-sky-100 bg-sky-50 p-4 text-xs text-sky-700 space-y-1">
                        <p className="font-semibold">Password requirements:</p>
                        <ul className="space-y-0.5 list-disc pl-4">
                            <li className={passwordForm.password.length >= 8 ? "text-emerald-600" : ""}>
                                At least 8 characters
                            </li>
                            <li className={/[A-Z]/.test(passwordForm.password) ? "text-emerald-600" : ""}>
                                One uppercase letter (recommended)
                            </li>
                            <li className={/[0-9]/.test(passwordForm.password) ? "text-emerald-600" : ""}>
                                One number (recommended)
                            </li>
                        </ul>
                    </div>

                    <button
                        type="submit"
                        disabled={passwordSaving || !passwordForm.current_password || !passwordForm.password}
                        className="flex items-center gap-2 rounded-2xl bg-sky-500 px-6 py-3 text-sm font-bold text-white shadow transition hover:bg-sky-600 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                        {passwordSaving && <Spinner />}
                        {passwordSaving ? "Updating…" : "Update password"}
                    </button>
                </form>
            </div>

            <div className="rounded-3xl border border-slate-100 bg-white p-6 shadow-sm">
                <div className="mb-5 flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-50">
                        <Mail size={20} className="text-violet-600" />
                    </div>
                    <div>
                        <h2 className="text-base font-bold text-slate-900">Notification Preferences</h2>
                        <p className="text-xs text-slate-500">Choose which notifications you'd like to receive.</p>
                    </div>
                </div>

                <div className="space-y-3">
                    {[
                        { label: "Order confirmations", desc: "Receive an email when you place an order", defaultChecked: true },
                        { label: "Shipping updates", desc: "Track your delivery progress via email", defaultChecked: true },
                        { label: "Promotions & deals", desc: "Get notified about sales and special offers", defaultChecked: false },
                        { label: "Review reminders", desc: "Reminders to review your purchased products", defaultChecked: true },
                    ].map((pref) => (
                        <label key={pref.label} className="flex cursor-pointer items-center justify-between rounded-2xl border border-slate-100 p-4 transition hover:bg-slate-50">
                            <div>
                                <p className="text-sm font-medium text-slate-800">{pref.label}</p>
                                <p className="text-xs text-slate-400">{pref.desc}</p>
                            </div>
                            <div className="relative ml-4">
                                <input type="checkbox" defaultChecked={pref.defaultChecked} className="peer sr-only" />
                                <div className="h-6 w-11 rounded-full bg-slate-200 peer-checked:bg-sky-500 transition-colors cursor-pointer" />
                                <div className="absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform peer-checked:translate-x-5" />
                            </div>
                        </label>
                    ))}
                </div>
            </div>

            <div className="rounded-3xl border border-rose-100 bg-rose-50/40 p-6">
                <div className="mb-4 flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-rose-100">
                        <ShieldAlert size={20} className="text-rose-600" />
                    </div>
                    <div>
                        <h2 className="text-base font-bold text-rose-900">Danger Zone</h2>
                        <p className="text-xs text-rose-600">Irreversible actions — proceed with caution.</p>
                    </div>
                </div>

                {!showDeleteZone ? (
                    <button
                        onClick={() => setShowDeleteZone(true)}
                        className="rounded-2xl border border-rose-200 bg-white px-5 py-2.5 text-sm font-semibold text-rose-600 transition hover:bg-rose-50 hover:border-rose-300"
                    >
                        Delete my account
                    </button>
                ) : (
                    <div className="space-y-3 rounded-2xl border border-rose-200 bg-white p-4">
                        <p className="text-sm font-medium text-rose-800">
                            This will permanently delete your account and all associated data. This action cannot be undone.
                        </p>
                        <p className="text-sm text-slate-600">
                            Type <strong>DELETE</strong> to confirm:
                        </p>
                        <input
                            type="text"
                            value={deleteConfirm}
                            onChange={(e) => setDeleteConfirm(e.target.value)}
                            placeholder="Type DELETE to confirm"
                            className="w-full max-w-xs rounded-2xl border border-zinc-200 bg-white px-4 py-2.5 text-sm focus:border-rose-400 focus:outline-none focus:ring-4 focus:ring-rose-100"
                        />
                        <div className="flex gap-3">
                            <button
                                disabled={deleteConfirm !== "DELETE"}
                                className="rounded-2xl bg-rose-500 px-5 py-2.5 text-sm font-bold text-white transition hover:bg-rose-600 disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                Delete account
                            </button>
                            <button
                                onClick={() => { setShowDeleteZone(false); setDeleteConfirm(""); }}
                                className="rounded-2xl border border-slate-200 bg-white px-5 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
