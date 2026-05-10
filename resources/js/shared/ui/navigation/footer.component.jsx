import React from "react";
import { Link } from "@inertiajs/react";

export default function FooterComponent() {
  return (
    <footer className="mt-16 border-t border-sky-100 bg-white text-slate-600">
      <div className="mx-auto max-w-7xl px-4 py-12 lg:px-6">
        <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-4">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-sky-500 text-sm font-black text-white shadow-lg shadow-sky-100">
                BD
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-[0.3em] text-slate-400">BazaarDeck</p>
                <p className="text-sm font-semibold text-slate-900">Modern commerce UI</p>
              </div>
            </div>
            <p className="max-w-sm text-sm leading-6 text-slate-500">
              A responsive storefront and admin workspace designed for product discovery, conversion, and day-to-day operations.
            </p>
          </div>

          <div>
            <p className="text-xs uppercase tracking-[0.28em] text-slate-400">Shop</p>
            <div className="mt-4 space-y-3 text-sm">
              <Link className="block transition hover:text-sky-700" href="/store/shop">Browse catalog</Link>
              <Link className="block transition hover:text-sky-700" href="/store/cart">Cart</Link>
              <Link className="block transition hover:text-sky-700" href="/account/dashboard">Customer dashboard</Link>
            </div>
          </div>

          <div>
            <p className="text-xs uppercase tracking-[0.28em] text-slate-400">Account</p>
            <div className="mt-4 space-y-3 text-sm">
              <Link className="block transition hover:text-sky-700" href="/auth/login">User sign in</Link>
              <Link className="block transition hover:text-sky-700" href="/auth/register">Create account</Link>
              <Link className="block transition hover:text-sky-700" href="/auth/admin/login">Admin sign in</Link>
            </div>
          </div>

          <div>
            <p className="text-xs uppercase tracking-[0.28em] text-slate-400">Support</p>
            <div className="mt-4 space-y-3 text-sm">
              <p className="text-slate-500">Responsive layouts</p>
              <p className="text-slate-500">Role-aware access</p>
              <p className="text-slate-500">Clean checkout flow</p>
            </div>
          </div>
        </div>

        <div className="mt-10 flex flex-col gap-3 border-t border-slate-100 pt-6 text-sm text-slate-400 sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} BazaarDeck. Built for the customer portal and the admin control room.</p>
          <p>Responsive storefront • Professional operations</p>
        </div>
      </div>
    </footer>
  );
}
