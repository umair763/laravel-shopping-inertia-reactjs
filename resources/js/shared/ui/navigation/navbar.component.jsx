import React, { useState } from "react";
import { Link, router } from "@inertiajs/react";
import { usePage } from "@inertiajs/react";

export default function NavbarComponent() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const { props } = usePage();
  const user = props?.auth?.user || null;

  const isAdmin = props?.auth?.is_admin || false;

  function handleLogout() {
    setOpen(false);
    router.post("/logout");
  }

  function handleSelect(target) {
    setOpen(false);
    if (target === "user") return router.visit("/login");
    if (target === "admin") return router.visit("/admin/login");
    return null;
  }

  function handleSearch(event) {
    event.preventDefault();
    const search = query.trim();
    setOpen(false);
    router.visit(search ? `/?search=${encodeURIComponent(search)}` : "/");
  }

  return (
    <header className="sticky top-0 z-40 border-b border-sky-100 bg-white/95 text-slate-900 shadow-sm backdrop-blur">
      <div className="mx-auto max-w-7xl px-4 py-3 lg:px-6">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:gap-4">
          <div className="flex items-center justify-between gap-4 lg:w-auto">
            <Link href="/" className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-sky-500 text-lg font-black text-white shadow-lg shadow-sky-200">
                BD
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-[0.3em] text-slate-500">AmazStore</p>
                <p className="text-sm font-semibold text-slate-900">Marketplace</p>
              </div>
            </Link>
          </div>

          <form onSubmit={handleSearch} className="flex flex-1 items-stretch overflow-hidden rounded-full border border-sky-100 bg-slate-50 shadow-[0_20px_50px_-30px_rgba(15,23,42,0.35)]">
            <select className="hidden border-0 bg-sky-50 px-4 text-sm font-semibold text-slate-600 outline-none sm:block">
              <option>All</option>
              <option>Electronics</option>
              <option>Fashion</option>
              <option>Home</option>
            </select>
            <input
              className="min-w-0 flex-1 border-0 bg-transparent px-4 py-3 text-slate-900 outline-none placeholder:text-slate-400"
              placeholder="Search products, brands, and categories"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
            />
            <button
              type="submit"
              className="flex items-center justify-center bg-sky-500 px-5 text-sm font-semibold text-white transition hover:bg-sky-600"
            >
              Search
            </button>
          </form>

          <div className="flex items-center justify-end gap-2">
            <Link
              className="flex h-11 w-11 items-center justify-center rounded-full border border-sky-100 bg-white text-sky-700 transition hover:border-sky-200 hover:bg-sky-50"
              href={user ? "/cart" : "/login"}
              aria-label="Cart"
            >
              <span className="text-lg">🛒</span>
            </Link>

            <div className="relative">
              <button
                type="button"
                onClick={() => setOpen((value) => !value)}
                aria-haspopup="true"
                aria-expanded={open}
                className="flex h-11 w-11 items-center justify-center rounded-full border border-sky-100 bg-white text-sky-700 transition hover:border-sky-200 hover:bg-sky-50"
                aria-label="Profile"
              >
                <span className="text-lg">◉</span>
              </button>

              {open ? (
                <div className="absolute right-0 mt-3 w-60 overflow-hidden rounded-3xl border border-sky-100 bg-white p-2 shadow-[0_30px_80px_-25px_rgba(15,23,42,0.22)]">
                  <div className="rounded-2xl bg-sky-50 p-3 text-sm text-slate-600">
                    {user ? (
                      <span className="font-medium text-slate-800">{user.name || user.email}</span>
                    ) : (
                      "Choose the workspace you want to enter."
                    )}
                  </div>

                  {user ? (
                    <>
                      <Link href="/account/dashboard" onClick={() => setOpen(false)} className="mt-2 block w-full rounded-2xl px-4 py-3 text-left text-sm font-semibold text-slate-800 transition hover:bg-sky-50">
                        Profile
                      </Link>
                      <Link href="/orders" onClick={() => setOpen(false)} className="block w-full rounded-2xl px-4 py-3 text-left text-sm font-semibold text-slate-800 transition hover:bg-sky-50">
                        My Orders
                      </Link>
                      {isAdmin && (
                        <Link href="/admin/dashboard" onClick={() => setOpen(false)} className="block w-full rounded-2xl px-4 py-3 text-left text-sm font-semibold text-sky-700 transition hover:bg-sky-50">
                          Admin Dashboard
                        </Link>
                      )}
                      <button type="button" onClick={handleLogout} className="w-full rounded-2xl px-4 py-3 text-left text-sm font-semibold text-red-600 transition hover:bg-red-50">
                        Sign out
                      </button>
                    </>
                  ) : (
                    <>
                      <button type="button" onClick={() => handleSelect("user")} className="mt-2 w-full rounded-2xl px-4 py-3 text-left text-sm font-semibold text-slate-800 transition hover:bg-sky-50">
                        User Sign In
                      </button>
                      <button type="button" onClick={() => handleSelect("admin")} className="w-full rounded-2xl px-4 py-3 text-left text-sm font-semibold text-slate-800 transition hover:bg-sky-50">
                        Admin Sign In
                      </button>
                    </>
                  )}
                </div>
              ) : null}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
