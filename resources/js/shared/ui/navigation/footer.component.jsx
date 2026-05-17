import React from "react";
import { Link } from "@inertiajs/react";

export default function FooterComponent() {
  return (
    <footer className="mt-16 border-t border-slate-200 bg-gradient-to-b from-slate-50 to-white text-slate-600">
      <div className="mx-auto max-w-7xl px-4 py-12 lg:px-6">
        {/* Main Footer Grid */}
        <div className="grid gap-12 md:grid-cols-2 xl:grid-cols-3">
          {/* Brand Section */}
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-sky-500 text-sm font-black text-white shadow-lg shadow-sky-100">
                BD
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-900">BazaarDeck</p>
                <p className="text-xs text-slate-500">E-Commerce Platform</p>
              </div>
            </div>
            <p className="max-w-sm text-sm leading-relaxed text-slate-500">
              Your ultimate destination for quality products, seamless shopping, and professional commerce management.
            </p>
          </div>

          {/* Shop Links */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-[0.28em] text-slate-900">Shop</h3>
            <div className="mt-4 space-y-2.5 text-sm">
              <Link 
                className="block text-slate-600 transition hover:text-sky-600 hover:font-medium" 
                href="/products"
              >
                Browse Products
              </Link>
              <Link 
                className="block text-slate-600 transition hover:text-sky-600 hover:font-medium" 
                href="/cart"
              >
                Shopping Cart
              </Link>
            </div>
          </div>

          {/* Account Links */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-[0.28em] text-slate-900">Access</h3>
            <div className="mt-4 space-y-2.5 text-sm">
              <Link 
                className="block text-slate-600 transition hover:text-sky-600 hover:font-medium" 
                href="/login"
              >
                Customer Login
              </Link>
              <Link 
                className="block text-slate-600 transition hover:text-sky-600 hover:font-medium" 
                href="/admin/login"
              >
                Admin Login
              </Link>
            </div>
          </div>
        </div>

        {/* Divider & Copyright */}
        <div className="mt-10 border-t border-slate-200 pt-6">
          <div className="flex flex-col gap-2 text-xs text-slate-500 sm:flex-row sm:items-center sm:justify-between">
            <p>© {new Date().getFullYear()} BazaarDeck. All rights reserved.</p>
            <p className="text-slate-400">Professional E-Commerce Solution</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
