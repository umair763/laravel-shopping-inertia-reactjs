import React, { useEffect, useState } from "react";
import { Link, router } from "@inertiajs/react";
import useLogout from "../../../features/account/hooks/use.logout.js";
import { PanelLeftClose, PanelLeftOpen } from "lucide-react";

const items = [
  { label: "Dashboard", to: "/account/dashboard" },
  { label: "Orders", to: "/account/orders" },
  { label: "Returns", to: "/account/returns" },
  { label: "Profile Settings", to: "/account/profile" },
];

export default function CustomerSidebarComponent() {
  const location = useLocation();
  
  const logout = useLogout();
  const [collapsed, setCollapsed] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem("customerSidebarCollapsed");
      setCollapsed(stored === "true");
    } catch (e) {
      setCollapsed(false);
    }
  }, []);

  function toggle() {
    const next = !collapsed;
    setCollapsed(next);
    try {
      localStorage.setItem("customerSidebarCollapsed", next ? "true" : "false");
    } catch (e) {
      // ignore
    }
  }

  function handleLogout() {
    logout.mutate(undefined, {
      onSuccess: () => router.visit("/auth/login", { replace: true }),
    });
  }

  return (
    <aside className={`hidden lg:sticky lg:top-24 lg:block lg:h-[calc(100vh-7rem)] ${collapsed ? "lg:w-20" : "lg:w-80"}`}>
      <div className="rounded-[1.75rem] border border-sky-100 bg-white p-4 shadow-sm">
        <div className={`rounded-[1.5rem] bg-sky-50 p-4 flex items-center justify-between ${collapsed ? "px-3" : "px-5"}`}>
          {!collapsed ? (
            <div>
              <p className="text-[10px] uppercase tracking-[0.32em] text-slate-400">Customer dashboard</p>
              <h2 className="mt-2 text-2xl font-black tracking-tight text-slate-900">My account</h2>
            </div>
          ) : (
            <div className="h-8 w-8 rounded-md bg-sky-500 text-white flex items-center justify-center font-black">C</div>
          )}

          <button onClick={toggle} className="p-2 rounded-md hover:bg-slate-50">
            {collapsed ? <PanelLeftOpen size={16} /> : <PanelLeftClose size={16} />}
          </button>
        </div>

        <nav className={`mt-5 space-y-2 ${collapsed ? "px-2" : "px-4"}`}>
          {items.map((item) => {
            const active = location.pathname === item.to;
            return (
              <Link
                key={item.to}
                to={item.to}
                className={`flex items-center ${collapsed ? "justify-center" : "justify-between"} rounded-2xl ${collapsed ? "p-2" : "px-4 py-3"} text-sm font-semibold transition ${active ? "bg-sky-500 text-white shadow-lg shadow-sky-100" : "bg-slate-50 text-slate-700 hover:bg-sky-50"}`}
              >
                <span className={`${collapsed ? "text-sm" : ""}`}>{collapsed ? item.label.charAt(0) : item.label}</span>
                {!collapsed && <span className={`text-xs ${active ? "text-white/80" : "text-slate-400"}`}>›</span>}
              </Link>
            );
          })}
        </nav>

        {!collapsed && (
          <div className="mt-5 space-y-3 rounded-2xl border border-slate-100 bg-slate-50 p-4 text-sm text-slate-600">
            <p className="font-semibold text-slate-900">Preferences</p>
            <div className="flex items-center justify-between">
              <span>Country / Region</span>
              <span className="font-semibold text-slate-900">Pakistan</span>
            </div>
            <div className="flex items-center justify-between">
              <span>Language</span>
              <span className="font-semibold text-slate-900">English</span>
            </div>
          </div>
        )}

        <button
          type="button"
          onClick={handleLogout}
          className={`mt-5 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 transition hover:border-sky-200 hover:bg-sky-50 ${collapsed ? "text-center" : ""}`}
        >
          {collapsed ? "⇦" : "Logout"}
        </button>
      </div>
    </aside>
  );
}