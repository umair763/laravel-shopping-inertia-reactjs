import React, { useMemo, useState } from "react";
import { usePage } from "@inertiajs/react";
import TextInput from "../../../shared/ui/inputs/text.input.jsx";
import PrimaryButton from "../../../shared/ui/buttons/primary.button.jsx";
import { Camera, CheckCircle, XCircle } from "lucide-react";

export default function ProfilePage({ scope = "customer" }) {
    const { props } = usePage();
    const user = props?.auth?.user || {};
    const [profileImageFile, setProfileImageFile] = useState(null);
    const [saving, setSaving] = useState(false);
    const [toast, setToast] = useState(null);

    const fullName = user.first_name
        ? `${user.first_name} ${user.last_name || ""}`.trim()
        : "";

    const [form, setForm] = useState({
        name: fullName || user.name || "",
        email: user.email || "",
        phone: user.phone || "",
        username: user.username || "",
    });

    const profilePreview = useMemo(() => {
        if (profileImageFile) return URL.createObjectURL(profileImageFile);
        return user?.profile_image || "";
    }, [user?.profile_image, profileImageFile]);

    const initials = (form.name || form.email || "U")
        .split(" ")
        .map((n) => n[0])
        .slice(0, 2)
        .join("")
        .toUpperCase();

    function showToast(type, message) {
        setToast({ type, message });
        setTimeout(() => setToast(null), 4000);
    }

    async function handleSave(event) {
        event.preventDefault();
        const payload = new FormData();
        const nameParts = form.name.trim().split(/\s+/).filter(Boolean);
        payload.append("first_name", nameParts[0] || "");
        payload.append("last_name", nameParts.slice(1).join(" "));
        payload.append("email", form.email);
        if (form.phone) payload.append("phone", form.phone);
        if (form.username) payload.append("username", form.username);
        if (profileImageFile) {
            payload.append("profile_image_file", profileImageFile);
        }
        setSaving(true);
        try {
            const csrfToken = document.querySelector('meta[name="csrf-token"]')?.content || "";
            const res = await fetch("/account/profile", {
                method: "PUT",
                headers: {
                    "X-Requested-With": "XMLHttpRequest",
                    "X-CSRF-TOKEN": csrfToken,
                },
                body: payload,
                credentials: "include",
            });
            if (res.ok) {
                showToast("success", "Profile updated successfully.");
                setProfileImageFile(null);
            } else {
                const data = await res.json();
                showToast("error", data.message || "Failed to update profile.");
            }
        } catch {
            showToast("error", "Network error. Please try again.");
        } finally {
            setSaving(false);
        }
    }

    const isAdmin = scope === "admin";

    return (
        <div className="space-y-6">
            {toast && (
                <div
                    className={`flex items-center gap-3 rounded-2xl border px-5 py-3.5 text-sm font-medium shadow-sm ${
                        toast.type === "success"
                            ? "border-emerald-100 bg-emerald-50 text-emerald-700"
                            : "border-rose-100 bg-rose-50 text-rose-700"
                    }`}
                >
                    {toast.type === "success" ? (
                        <CheckCircle size={18} className="shrink-0" />
                    ) : (
                        <XCircle size={18} className="shrink-0" />
                    )}
                    {toast.message}
                </div>
            )}

            <div className="space-y-1">
                <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-sky-500">
                    {isAdmin ? "Admin Profile" : "Customer Profile"}
                </p>
                <h1 className="text-3xl font-black tracking-tight text-slate-900">
                    {isAdmin ? "Admin profile settings" : "Profile settings"}
                </h1>
                <p className="text-sm text-slate-500">
                    {isAdmin
                        ? "Manage your admin identity and keep your account details up to date."
                        : "Keep your personal details up to date for faster checkout and order tracking."}
                </p>
            </div>

            <div className="grid gap-6 lg:grid-cols-[1fr_300px]">
                <form
                    onSubmit={handleSave}
                    className="space-y-5 rounded-3xl border border-slate-100 bg-white p-6 shadow-sm"
                >
                    <h2 className="text-base font-bold text-slate-900">Personal information</h2>

                    <div className="grid gap-4 sm:grid-cols-2">
                        <label className="space-y-2">
                            <span className="text-sm font-medium text-slate-700">Full name</span>
                            <TextInput
                                value={form.name}
                                placeholder="Your full name"
                                onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
                                disabled={saving}
                            />
                        </label>
                        <label className="space-y-2">
                            <span className="text-sm font-medium text-slate-700">Email address</span>
                            <TextInput
                                type="email"
                                value={form.email}
                                placeholder="your@email.com"
                                onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))}
                                disabled={saving}
                            />
                        </label>
                        <label className="space-y-2">
                            <span className="text-sm font-medium text-slate-700">Phone number</span>
                            <TextInput
                                type="tel"
                                value={form.phone}
                                placeholder="+1 (555) 000-0000"
                                onChange={(e) => setForm((p) => ({ ...p, phone: e.target.value }))}
                                disabled={saving}
                            />
                        </label>
                        <label className="space-y-2">
                            <span className="text-sm font-medium text-slate-700">Username</span>
                            <TextInput
                                value={form.username}
                                placeholder="@username"
                                onChange={(e) => setForm((p) => ({ ...p, username: e.target.value }))}
                                disabled={saving}
                            />
                        </label>
                    </div>

                    <div className="space-y-2">
                        <span className="text-sm font-medium text-slate-700">Profile photo</span>
                        <label className="flex cursor-pointer items-center gap-4 rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-4 transition hover:border-sky-300 hover:bg-sky-50/50">
                            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-slate-200 text-slate-500">
                                <Camera size={20} />
                            </div>
                            <div className="min-w-0 flex-1">
                                <p className="text-sm font-medium text-slate-700">
                                    {profileImageFile ? profileImageFile.name : "Click to upload a photo"}
                                </p>
                                <p className="text-xs text-slate-400">PNG, JPG, WebP up to 5 MB</p>
                            </div>
                            <input
                                type="file"
                                accept="image/*"
                                className="sr-only"
                                onChange={(e) => setProfileImageFile(e.target.files?.[0] || null)}
                            />
                        </label>
                    </div>

                    <div className="flex flex-wrap gap-3 pt-2">
                        <PrimaryButton
                            type="submit"
                            disabled={saving}
                            className="flex items-center gap-2 disabled:opacity-70"
                        >
                            {saving ? (
                                <>
                                    <svg className="h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                                    </svg>
                                    Saving…
                                </>
                            ) : "Save changes"}
                        </PrimaryButton>
                        <button
                            type="button"
                            onClick={() => {
                                setForm({ name: fullName || "", email: user.email || "", phone: user.phone || "", username: user.username || "" });
                                setProfileImageFile(null);
                            }}
                            className="rounded-2xl border border-slate-200 bg-white px-5 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
                        >
                            Cancel
                        </button>
                    </div>
                </form>

                <div className="space-y-4 rounded-3xl border border-slate-100 bg-white p-6 shadow-sm">
                    <div className="flex flex-col items-center gap-3 text-center">
                        <div className="relative">
                            {profilePreview ? (
                                <img
                                    src={profilePreview}
                                    alt="Profile"
                                    className="h-20 w-20 rounded-full object-cover ring-4 ring-sky-100"
                                />
                            ) : (
                                <div className="flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-sky-400 to-sky-600 text-2xl font-black text-white ring-4 ring-sky-100">
                                    {initials}
                                </div>
                            )}
                        </div>
                        <div>
                            <p className="font-bold text-slate-900">
                                {form.name || "Your name"}
                            </p>
                            <p className="text-sm text-slate-400">{form.email}</p>
                        </div>
                    </div>

                    <div className="space-y-2 rounded-2xl bg-slate-50 p-4 text-sm">
                        <div className="flex items-center justify-between gap-2">
                            <span className="text-slate-500">Role</span>
                            <span className={`rounded-full px-2.5 py-0.5 text-xs font-bold ${isAdmin ? "bg-violet-100 text-violet-700" : "bg-sky-100 text-sky-700"}`}>
                                {isAdmin ? "Administrator" : "Customer"}
                            </span>
                        </div>
                        {user.last_login_at && (
                            <div className="flex items-center justify-between gap-2">
                                <span className="text-slate-500">Last login</span>
                                <span className="text-xs font-medium text-slate-700">
                                    {new Date(user.last_login_at).toLocaleDateString()}
                                </span>
                            </div>
                        )}
                        <div className="flex items-center justify-between gap-2">
                            <span className="text-slate-500">Email verified</span>
                            <span className={`text-xs font-medium ${user.is_email_verified ? "text-emerald-600" : "text-amber-600"}`}>
                                {user.is_email_verified ? "Verified" : "Not verified"}
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
