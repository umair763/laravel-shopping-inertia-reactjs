import React, { useEffect, useState } from "react";
import { Link } from "@inertiajs/react";
import { PanelLeftClose, PanelLeftOpen } from "lucide-react";

export default function SidebarComponent() {
  const [collapsed, setCollapsed] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem("sidebarCollapsed");
      setCollapsed(stored === "true");
    } catch (e) {
      setCollapsed(false);
    }
  }, []);

  function toggle() {
    const next = !collapsed;
    setCollapsed(next);
    try {
      localStorage.setItem("sidebarCollapsed", next ? "true" : "false");
    } catch (e) {
      // ignore
    }
    // small delay for CSS transitions
  }

  const widthClass = collapsed ? "w-14" : "w-72";

  return (
    <aside className={`hidden lg:sticky lg:top-0 lg:flex ${widthClass} flex-col border-r border-sky-100 bg-white text-slate-700`}>
      <div className={`border-b border-slate-100 p-4 flex items-center justify-between ${collapsed ? "px-2" : "px-6"}`}>
        {!collapsed ? (
          <div>
            <p className="text-[10px] uppercase tracking-[0.3em] text-slate-400">Admin workspace</p>
            <h2 className="mt-2 text-2xl font-black tracking-tight text-slate-900">AmazStore</h2>
          </div>
        ) : (
          <div className="flex items-center justify-center w-full">
            <div className="h-8 w-8 rounded-md bg-sky-500 text-white flex items-center justify-center font-black">B</div>
          </div>
        )}

        <button onClick={toggle} aria-label="Toggle sidebar" className="p-2 rounded-md hover:bg-slate-50">
          {collapsed ? <PanelLeftOpen size={18} /> : <PanelLeftClose size={18} />}
        </button>
      </div>

      <nav className={`flex-1 space-y-6 overflow-y-auto p-4 text-sm ${collapsed ? "px-1" : "px-4"}`}>
        <div>
          {!collapsed && <p className="px-3 text-xs uppercase tracking-[0.28em] text-slate-400">Overview</p>}
          <div className={`mt-2 space-y-2 ${collapsed ? "flex flex-col items-center" : ""}`}>
            <Link className={`block rounded-2xl ${collapsed ? "p-2" : "px-3 py-2"} transition hover:bg-sky-50`} href="/admin/dashboard">{!collapsed ? "Dashboard" : "D"}</Link>
            <Link className={`block rounded-2xl ${collapsed ? "p-2" : "px-3 py-2"} transition hover:bg-sky-50`} href="/admin/orders">{!collapsed ? "Orders" : "O"}</Link>
            <Link className={`block rounded-2xl ${collapsed ? "p-2" : "px-3 py-2"} transition hover:bg-sky-50`} href="/admin/users">{!collapsed ? "Users" : "U"}</Link>
            <Link className={`block rounded-2xl ${collapsed ? "p-2" : "px-3 py-2"} transition hover:bg-sky-50`} href="/admin/profile">{!collapsed ? "Profile" : "P"}</Link>
          </div>
        </div>

        <div>
          {!collapsed && <p className="px-3 text-xs uppercase tracking-[0.28em] text-slate-400">Catalog</p>}
          <div className={`mt-2 space-y-2 ${collapsed ? "flex flex-col items-center" : ""}`}>
            <Link className={`block rounded-2xl ${collapsed ? "p-2" : "px-3 py-2"} transition hover:bg-sky-50`} href="/admin/catalogues">{!collapsed ? "Catalogues" : "C"}</Link>
            <Link className={`block rounded-2xl ${collapsed ? "p-2" : "px-3 py-2"} transition hover:bg-sky-50`} href="/admin/categories">{!collapsed ? "Categories" : "K"}</Link>
            <Link className={`block rounded-2xl ${collapsed ? "p-2" : "px-3 py-2"} transition hover:bg-sky-50`} href="/admin/products">{!collapsed ? "Products" : "P"}</Link>
            <Link className={`block rounded-2xl ${collapsed ? "p-2" : "px-3 py-2"} transition hover:bg-sky-50`} href="/admin/settings">{!collapsed ? "Settings" : "S"}</Link>
          </div>
        </div>
      </nav>

      <div className={`border-t border-slate-100 p-4 text-sm text-slate-500 ${collapsed ? "px-2" : "px-6"}`}>
        {!collapsed ? "Protected by role-based permissions and audit-ready controls." : ""}
      </div>
    </aside>
  );
}
