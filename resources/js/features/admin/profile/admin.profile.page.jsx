import React from "react";
import ProfilePage from "../../account/pages/profile.page.jsx";
import { usePage } from "@inertiajs/react";
import { ShieldCheck, Activity } from "lucide-react";

export default function AdminProfilePage() {
    const { props } = usePage();
    const user = props?.auth?.user;

    return (
        <div className="space-y-6">
            <ProfilePage scope="admin" />

            <div className="rounded-3xl border border-violet-100 bg-violet-50/40 p-6">
                <div className="flex items-center gap-3 mb-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-100">
                        <ShieldCheck size={20} className="text-violet-600" />
                    </div>
                    <div>
                        <h2 className="text-base font-bold text-violet-900">Admin Security</h2>
                        <p className="text-xs text-violet-600">Your administrative account security overview.</p>
                    </div>
                </div>
                <div className="grid gap-3 sm:grid-cols-3">
                    <div className="rounded-2xl border border-violet-100 bg-white p-4">
                        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-violet-400">Role</p>
                        <p className="mt-2 font-black text-violet-900">Administrator</p>
                    </div>
                    <div className="rounded-2xl border border-violet-100 bg-white p-4">
                        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-violet-400">Email</p>
                        <p className="mt-2 truncate font-bold text-slate-900">{user?.email || "—"}</p>
                    </div>
                    <div className="rounded-2xl border border-violet-100 bg-white p-4">
                        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-violet-400">Status</p>
                        <p className="mt-2 font-bold text-emerald-600">
                            {user?.status || "Active"}
                        </p>
                    </div>
                </div>
            </div>

            <div className="rounded-3xl border border-slate-100 bg-white p-6 shadow-sm">
                <div className="flex items-center gap-3 mb-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-sky-50">
                        <Activity size={20} className="text-sky-600" />
                    </div>
                    <h2 className="text-base font-bold text-slate-900">Quick Actions</h2>
                </div>
                <div className="grid gap-3 sm:grid-cols-2">
                    {[
                        { label: "View Dashboard", href: "/admin/dashboard", desc: "Go to admin control panel" },
                        { label: "Manage Orders", href: "/admin/orders", desc: "View and process orders" },
                        { label: "Manage Products", href: "/admin/products", desc: "Update catalog and inventory" },
                        { label: "Manage Users", href: "/admin/users", desc: "View and manage customers" },
                    ].map((action) => (
                        <a
                            key={action.href}
                            href={action.href}
                            className="flex items-center justify-between rounded-2xl border border-slate-100 p-4 transition hover:border-sky-100 hover:bg-sky-50/50"
                        >
                            <div>
                                <p className="text-sm font-bold text-slate-900">{action.label}</p>
                                <p className="text-xs text-slate-400">{action.desc}</p>
                            </div>
                        </a>
                    ))}
                </div>
            </div>
        </div>
    );
}
