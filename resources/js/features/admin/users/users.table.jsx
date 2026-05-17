import React, { useEffect, useState } from "react";
import ConfirmModal from "../../../shared/ui/modals/confirm.modal.jsx";

function getXsrfHeader() {
    const match = document.cookie.match(/XSRF-TOKEN=([^;]+)/);
    return match ? decodeURIComponent(match[1]) : "";
}

async function apiFetch(url, method = "GET", body = null) {
    const opts = {
        method,
        credentials: "same-origin",
        headers: {
            Accept: "application/json",
            "X-Requested-With": "XMLHttpRequest",
            "X-XSRF-TOKEN": getXsrfHeader(),
        },
    };
    if (body) {
        opts.headers["Content-Type"] = "application/json";
        opts.body = JSON.stringify(body);
    }
    const res = await fetch(url, opts);
    if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.message || `Request failed: ${res.status}`);
    }
    return res.json();
}

function formatDate(dateStr) {
    if (!dateStr) return "—";
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

const ROLE_STYLES = {
    admin: "bg-violet-50 text-violet-700 border-violet-100",
    customer: "bg-sky-50 text-sky-700 border-sky-100",
};

const STATUS_STYLES = {
    active: "bg-emerald-50 text-emerald-700",
    inactive: "bg-slate-100 text-slate-500",
    suspended: "bg-rose-50 text-rose-700",
};

export default function UsersTable({ users: serverUsers }) {
    const [users, setUsers] = useState(serverUsers || []);
    const [loading, setLoading] = useState(!serverUsers);
    const [error, setError] = useState(null);
    const [search, setSearch] = useState("");
    const [roleFilter, setRoleFilter] = useState("all");
    const [deleting, setDeleting] = useState(false);
    const [selected, setSelected] = useState(null);
    const [deleteError, setDeleteError] = useState(null);

    useEffect(() => {
        if (serverUsers) {
            setUsers(serverUsers);
            return;
        }
        setLoading(true);
        apiFetch("/api/admin/users")
            .then((r) => setUsers(r.data || []))
            .catch((e) => setError(e.message))
            .finally(() => setLoading(false));
    }, [serverUsers]);

    const filtered = users.filter((u) => {
        const name = `${u.first_name ?? ""} ${u.last_name ?? ""} ${u.email ?? ""}`.toLowerCase();
        const matchSearch = !search || name.includes(search.toLowerCase());
        const matchRole = roleFilter === "all" || u.role === roleFilter;
        return matchSearch && matchRole;
    });

    function confirmDelete(user) {
        setSelected(user);
        setDeleteError(null);
        setDeleting(true);
    }

    async function handleDelete() {
        if (!selected?.id) return;
        try {
            setDeleteError(null);
            await apiFetch(`/api/admin/users/${selected.id}`, "DELETE");
            setUsers((prev) => prev.filter((u) => u.id !== selected.id));
            setDeleting(false);
            setSelected(null);
        } catch (e) {
            setDeleteError(e.message || "Delete failed.");
        }
    }

    const totalCustomers = users.filter((u) => u.role === "customer").length;
    const totalAdmins = users.filter((u) => u.role === "admin").length;

    return (
        <section className="space-y-5">
            <div className="flex flex-col gap-4 rounded-[2rem] border border-sky-100 bg-white p-6 shadow-sm lg:flex-row lg:items-end lg:justify-between">
                <div>
                    <p className="text-[10px] uppercase tracking-[0.3em] text-sky-500">Admin workspace</p>
                    <h1 className="text-3xl font-black tracking-tight text-slate-900">Users</h1>
                    <p className="mt-1 text-sm text-slate-500">
                        Manage customer accounts and admin users.
                    </p>
                </div>
                <div className="flex flex-wrap gap-3">
                    {[
                        { label: "Total", value: users.length, color: "bg-slate-50 text-slate-700" },
                        { label: "Customers", value: totalCustomers, color: "bg-sky-50 text-sky-700" },
                        { label: "Admins", value: totalAdmins, color: "bg-violet-50 text-violet-700" },
                    ].map(({ label, value, color }) => (
                        <div key={label} className={`rounded-2xl px-4 py-3 text-center ${color}`}>
                            <p className="text-[10px] uppercase tracking-[0.24em] opacity-60">{label}</p>
                            <p className="mt-1 text-lg font-black">{value}</p>
                        </div>
                    ))}
                </div>
            </div>

            <div className="flex flex-wrap items-center gap-3">
                <input
                    type="search"
                    placeholder="Search by name or email…"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="flex-1 rounded-full border border-slate-200 bg-white px-4 py-2.5 text-sm outline-none focus:border-sky-300 focus:ring-2 focus:ring-sky-100 min-w-[200px]"
                />
                <div className="inline-flex rounded-full border border-slate-200 bg-white p-0.5 text-xs">
                    {["all", "customer", "admin"].map((r) => (
                        <button
                            key={r}
                            type="button"
                            onClick={() => setRoleFilter(r)}
                            className={`rounded-full px-4 py-1.5 font-medium capitalize transition ${
                                roleFilter === r
                                    ? "bg-slate-900 text-white"
                                    : "text-slate-600 hover:bg-slate-100"
                            }`}
                        >
                            {r}
                        </button>
                    ))}
                </div>
            </div>

            <div className="overflow-hidden rounded-[2rem] border border-slate-100 bg-white shadow-sm">
                {error && (
                    <div className="border-b border-rose-100 bg-rose-50 px-6 py-3 text-sm text-rose-700">
                        {error}
                    </div>
                )}
                {loading ? (
                    <div className="px-6 py-12 text-center text-sm text-slate-400">
                        Loading users…
                    </div>
                ) : filtered.length === 0 ? (
                    <div className="px-6 py-12 text-center text-sm text-slate-400">
                        {search || roleFilter !== "all" ? "No users match your filter." : "No users found."}
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-slate-100 text-sm">
                            <thead className="bg-slate-50 text-left">
                                <tr>
                                    <th className="px-6 py-3 text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-400">
                                        User
                                    </th>
                                    <th className="px-6 py-3 text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-400">
                                        Role
                                    </th>
                                    <th className="px-6 py-3 text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-400">
                                        Status
                                    </th>
                                    <th className="px-6 py-3 text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-400">
                                        Joined
                                    </th>
                                    <th className="px-6 py-3 text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-400">
                                        Last login
                                    </th>
                                    <th className="px-6 py-3 text-right text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-400">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 bg-white">
                                {filtered.map((user) => {
                                    const fullName =
                                        [user.first_name, user.last_name]
                                            .filter(Boolean)
                                            .join(" ") || user.email;
                                    const roleStyle =
                                        ROLE_STYLES[user.role] ||
                                        "bg-slate-100 text-slate-600 border-slate-200";
                                    const statusStyle =
                                        STATUS_STYLES[user.status] ||
                                        "bg-slate-100 text-slate-500";
                                    const initials = fullName
                                        .split(/\s+/)
                                        .slice(0, 2)
                                        .map((p) => p[0]?.toUpperCase() || "")
                                        .join("");

                                    return (
                                        <tr key={user.id} className="hover:bg-slate-50/60">
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-slate-100 text-sm font-bold text-slate-600">
                                                        {initials || "?"}
                                                    </div>
                                                    <div>
                                                        <p className="font-semibold text-slate-900">
                                                            {fullName}
                                                        </p>
                                                        <p className="text-xs text-slate-400">
                                                            {user.email}
                                                        </p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span
                                                    className={`inline-flex rounded-full border px-2.5 py-0.5 text-[11px] font-semibold capitalize ${roleStyle}`}
                                                >
                                                    {user.role}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span
                                                    className={`inline-flex rounded-full px-2.5 py-0.5 text-[11px] font-semibold capitalize ${statusStyle}`}
                                                >
                                                    {user.status || "active"}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-slate-600">
                                                {formatDate(user.created_at)}
                                            </td>
                                            <td className="px-6 py-4 text-slate-500">
                                                {formatDate(user.last_login_at) || "Never"}
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <button
                                                    type="button"
                                                    onClick={() => confirmDelete(user)}
                                                    className="rounded-xl border border-rose-200 bg-rose-50 px-3 py-1.5 text-xs font-semibold text-rose-700 transition hover:bg-rose-100"
                                                >
                                                    Remove
                                                </button>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            <ConfirmModal
                open={deleting}
                title="Remove user"
                message={
                    selected
                        ? `This will permanently remove ${selected.email}. This action cannot be undone.`
                        : "Remove this user permanently?"
                }
                onConfirm={handleDelete}
                onCancel={() => {
                    setDeleting(false);
                    setSelected(null);
                    setDeleteError(null);
                }}
            />
            {deleteError && (
                <p className="text-sm text-rose-600">{deleteError}</p>
            )}
        </section>
    );
}
