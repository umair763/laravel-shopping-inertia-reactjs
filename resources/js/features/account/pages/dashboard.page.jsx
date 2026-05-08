import React from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import useProfile from "../hooks/use.profile.js";

const stats = [
  { label: "Orders", value: "12", tone: "bg-sky-50 text-sky-700 border-sky-100" },
  { label: "Returns", value: "2", tone: "bg-sky-50 text-sky-700 border-sky-100" },
  { label: "Saved region", value: "Pakistan", tone: "bg-stone-50 text-stone-700 border-stone-100" },
  { label: "Language", value: "English", tone: "bg-blue-50 text-blue-700 border-blue-100" },
];

export default function CustomerDashboardPage() {
  const { data } = useProfile();
  const user = useSelector((state) => state.auth.user);
  const profile = data?.data || user || {};

  return (
    <section className="space-y-6">
      <div className="overflow-hidden rounded-[2rem] border border-sky-100 bg-white shadow-sm">
        <div className="grid gap-6 p-6 lg:grid-cols-[1.2fr_0.8fr] lg:p-8">
          <div className="space-y-4">
            <p className="text-[10px] uppercase tracking-[0.34em] text-slate-400">Customer dashboard</p>
            <h1 className="text-3xl font-black tracking-tight text-slate-900 sm:text-4xl">Welcome back, {profile?.name || profile?.email || "customer"}.</h1>
            <p className="max-w-2xl text-base leading-7 text-slate-600">
              Manage your orders, track returns, update profile settings, and keep your region and language preferences in one clean workspace.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link to="/account/orders" className="rounded-full bg-sky-500 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-sky-100 transition hover:bg-sky-600">
                View orders
              </Link>
              <Link to="/account/profile" className="rounded-full border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:border-sky-200 hover:bg-sky-50">
                Profile settings
              </Link>
            </div>
          </div>

          <div className="grid gap-3 rounded-[1.75rem] bg-slate-50 p-4 sm:grid-cols-2 lg:grid-cols-1">
            <div className="rounded-2xl border border-slate-100 bg-white p-4">
              <p className="text-xs uppercase tracking-[0.28em] text-slate-400">Email</p>
              <p className="mt-2 text-sm font-semibold text-slate-900">{profile?.email || "No profile loaded"}</p>
            </div>
            <div className="rounded-2xl border border-slate-100 bg-white p-4">
              <p className="text-xs uppercase tracking-[0.28em] text-slate-400">Account type</p>
              <p className="mt-2 text-sm font-semibold text-slate-900">Customer portal</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => (
          <article key={stat.label} className={`rounded-2xl border p-4 shadow-sm ${stat.tone}`}>
            <p className="text-xs uppercase tracking-[0.26em] opacity-70">{stat.label}</p>
            <p className="mt-3 text-2xl font-black tracking-tight">{stat.value}</p>
          </article>
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Link to="/account/orders" className="rounded-[1.75rem] border border-slate-100 bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
          <p className="text-xs uppercase tracking-[0.28em] text-sky-500">Orders</p>
          <h2 className="mt-3 text-2xl font-black tracking-tight text-slate-900">Track deliveries and invoices</h2>
          <p className="mt-2 text-sm leading-6 text-slate-600">Check active orders, delivery status, and your order history.</p>
        </Link>

        <Link to="/account/returns" className="rounded-[1.75rem] border border-slate-100 bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
          <p className="text-xs uppercase tracking-[0.28em] text-sky-500">Returns</p>
          <h2 className="mt-3 text-2xl font-black tracking-tight text-slate-900">Start or review returns</h2>
          <p className="mt-2 text-sm leading-6 text-slate-600">Open a return request and view return progress in one place.</p>
        </Link>
      </div>
    </section>
  );
}