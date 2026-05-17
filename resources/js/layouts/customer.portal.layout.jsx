import React, { useState } from "react";
import { Link, router, usePage } from "@inertiajs/react";
import {
    LayoutDashboard,
    User,
    ShoppingBag,
    ShoppingCart,
    Star,
    History,
    Settings,
    Store,
    LogOut,
    Menu,
    X,
    ChevronRight,
} from "lucide-react";

const navItems = [
    { href: "/account/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { href: "/account/profile", label: "Profile", icon: User },
    { href: "/orders", label: "My Orders", icon: ShoppingBag },
    { href: "/cart", label: "Cart", icon: ShoppingCart },
    { href: "/account/reviews", label: "Reviews", icon: Star },
    { href: "/account/history", label: "Purchase History", icon: History },
    { href: "/account/settings", label: "Account Settings", icon: Settings },
];

function SidebarLink({ item, collapsed }) {
    const { url } = usePage();
    const isActive = url === item.href || url.startsWith(item.href + "/");
    const Icon = item.icon;

    return (
        <Link
            href={item.href}
            className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all ${
                isActive
                    ? "bg-sky-50 text-sky-700 shadow-sm ring-1 ring-sky-100"
                    : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
            } ${collapsed ? "justify-center px-2" : ""}`}
            title={collapsed ? item.label : undefined}
        >
            <Icon size={18} className="shrink-0" />
            {!collapsed && <span>{item.label}</span>}
            {!collapsed && isActive && (
                <ChevronRight size={14} className="ml-auto text-sky-400" />
            )}
        </Link>
    );
}

function Sidebar({ collapsed, onClose, mobile = false }) {
    const { props } = usePage();
    const user = props?.auth?.user;
    const displayName = user?.first_name
        ? `${user.first_name} ${user.last_name || ""}`.trim()
        : user?.email || "Customer";
    const initials = displayName
        .split(" ")
        .map((n) => n[0])
        .slice(0, 2)
        .join("")
        .toUpperCase();

    function handleLogout() {
        router.post("/logout");
    }

    return (
        <aside
            className={`flex flex-col h-full border-r border-sky-100 bg-white text-slate-700 ${
                mobile ? "w-full" : collapsed ? "w-16" : "w-72"
            } transition-all duration-200`}
        >
            <div className={`border-b border-slate-100 p-4 ${collapsed && !mobile ? "px-2" : "px-5"}`}>
                {!collapsed || mobile ? (
                    <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-sky-400 to-sky-600 text-sm font-bold text-white shadow-sm">
                            {user?.profile_image ? (
                                <img
                                    src={user.profile_image}
                                    alt={displayName}
                                    className="h-full w-full rounded-full object-cover"
                                />
                            ) : (
                                initials
                            )}
                        </div>
                        <div className="min-w-0 flex-1">
                            <p className="truncate text-sm font-bold text-slate-900">{displayName}</p>
                            <p className="truncate text-xs text-slate-400">{user?.email}</p>
                        </div>
                        {mobile && (
                            <button onClick={onClose} className="p-1 text-slate-400 hover:text-slate-700">
                                <X size={20} />
                            </button>
                        )}
                    </div>
                ) : (
                    <div className="flex justify-center">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-sky-400 to-sky-600 text-xs font-bold text-white">
                            {initials}
                        </div>
                    </div>
                )}
            </div>

            <nav className={`flex-1 overflow-y-auto py-4 space-y-1 ${collapsed && !mobile ? "px-1" : "px-3"}`}>
                {!collapsed || mobile ? (
                    <p className="mb-2 px-3 text-[10px] font-semibold uppercase tracking-[0.28em] text-slate-400">
                        Customer Portal
                    </p>
                ) : null}
                {navItems.map((item) => (
                    <SidebarLink key={item.href} item={item} collapsed={collapsed && !mobile} />
                ))}
            </nav>

            <div className={`border-t border-slate-100 p-3 space-y-1 ${collapsed && !mobile ? "px-1" : "px-3"}`}>
                <Link
                    href="/"
                    className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-slate-500 transition hover:bg-slate-50 hover:text-slate-900 ${
                        collapsed && !mobile ? "justify-center px-2" : ""
                    }`}
                    title={collapsed && !mobile ? "Browse Store" : undefined}
                >
                    <Store size={18} className="shrink-0" />
                    {(!collapsed || mobile) && <span>Browse Store</span>}
                </Link>
                <button
                    onClick={handleLogout}
                    className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-rose-500 transition hover:bg-rose-50 hover:text-rose-700 ${
                        collapsed && !mobile ? "justify-center px-2" : ""
                    }`}
                    title={collapsed && !mobile ? "Sign Out" : undefined}
                >
                    <LogOut size={18} className="shrink-0" />
                    {(!collapsed || mobile) && <span>Sign Out</span>}
                </button>
            </div>
        </aside>
    );
}

export default function CustomerPortalLayout({ children }) {
    const [collapsed, setCollapsed] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);

    return (
        <div className="min-h-screen bg-gradient-to-br from-sky-50/40 via-white to-slate-50 text-slate-900">
            <div className="sticky top-0 z-30 flex items-center gap-4 border-b border-slate-200 bg-white/90 px-4 py-3 shadow-sm backdrop-blur-sm lg:hidden">
                <button
                    onClick={() => setMobileOpen(true)}
                    className="rounded-lg p-1.5 text-slate-500 hover:bg-slate-100"
                >
                    <Menu size={22} />
                </button>
                <Link href="/" className="flex items-center gap-2">
                    <div className="flex h-7 w-7 items-center justify-center rounded-md bg-sky-500 text-xs font-black text-white">
                        BD
                    </div>
                    <span className="text-sm font-bold text-slate-900">BazaarDeck</span>
                </Link>
            </div>

            {mobileOpen && (
                <div className="fixed inset-0 z-50 flex lg:hidden">
                    <div
                        className="absolute inset-0 bg-black/30 backdrop-blur-sm"
                        onClick={() => setMobileOpen(false)}
                    />
                    <div className="relative z-10 w-80 max-w-[90vw]">
                        <Sidebar mobile onClose={() => setMobileOpen(false)} />
                    </div>
                </div>
            )}

            <div className="flex">
                <div
                    className={`hidden lg:sticky lg:top-0 lg:flex lg:h-screen lg:flex-col ${
                        collapsed ? "w-16" : "w-72"
                    } shrink-0 transition-all duration-200`}
                >
                    <div className="flex h-full flex-col">
                        <div className={`flex items-center justify-between border-b border-slate-100 px-4 py-3 ${collapsed ? "px-2 justify-center" : ""}`}>
                            {!collapsed && (
                                <Link href="/" className="flex items-center gap-2">
                                    <div className="flex h-7 w-7 items-center justify-center rounded-md bg-sky-500 text-xs font-black text-white">
                                        BD
                                    </div>
                                    <span className="text-sm font-bold text-slate-900">BazaarDeck</span>
                                </Link>
                            )}
                            <button
                                onClick={() => setCollapsed((c) => !c)}
                                className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
                                aria-label="Toggle sidebar"
                            >
                                <Menu size={18} />
                            </button>
                        </div>
                        <Sidebar collapsed={collapsed} />
                    </div>
                </div>

                <main className="flex-1 min-w-0 p-4 lg:p-6 xl:p-8">
                    <div className="mx-auto max-w-5xl">{children}</div>
                </main>
            </div>
        </div>
    );
}
