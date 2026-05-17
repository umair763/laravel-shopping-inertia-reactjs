import React, { useMemo, useState } from "react";
import { Link, router, usePage } from "@inertiajs/react";
import CustomerPortalLayout from "../../../layouts/customer.portal.layout.jsx";
import Container from "../../../shared/ui/layout/container.jsx";

function getXsrfHeader() {
  const match = document.cookie.match(/XSRF-TOKEN=([^;]+)/);
  return match ? decodeURIComponent(match[1]) : "";
}

async function request(url, method, body) {
  const res = await fetch(url, {
    method,
    credentials: "same-origin",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      "X-Requested-With": "XMLHttpRequest",
      "X-XSRF-TOKEN": getXsrfHeader(),
    },
    body: body ? JSON.stringify(body) : undefined,
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || `Request failed: ${res.status}`);
  }
  return res.json();
}

export default function CartPage({ cart, addresses = [] }) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(null);
  const items = cart?.items || [];

  const [selectedAddressId, setSelectedAddressId] = useState(
    addresses?.find((a) => a.is_default)?.id || addresses?.[0]?.id || "",
  );
  const [showNewAddress, setShowNewAddress] = useState(addresses.length === 0);
  const [newAddress, setNewAddress] = useState({
    address_line_1: "",
    address_line_2: "",
    city: "",
    state: "",
    postal_code: "",
    country: "",
  });

  const totalItems = useMemo(() => items.reduce((sum, i) => sum + Number(i.quantity || 0), 0), [items]);
  const subtotal = useMemo(() => {
    return items.reduce((sum, item) => {
      const price = Number(item.variant?.discount_price ?? item.variant?.price ?? 0);
      return sum + price * Number(item.quantity || 0);
    }, 0);
  }, [items]);

  async function refresh() {
    router.reload({ only: ["cart", "addresses"] });
  }

  async function updateQuantity(item, nextQty) {
    if (nextQty < 1) return removeItem(item);
    setBusy(true);
    setError(null);
    try {
      await request(`/cart/items/${item.id}`, "PUT", { quantity: nextQty });
      await refresh();
    } catch (e) {
      setError(e.message);
    } finally {
      setBusy(false);
    }
  }

  async function removeItem(item) {
    setBusy(true);
    setError(null);
    try {
      await request(`/cart/items/${item.id}`, "DELETE");
      await refresh();
    } catch (e) {
      setError(e.message);
    } finally {
      setBusy(false);
    }
  }

  async function checkout() {
    setBusy(true);
    setError(null);
    try {
      let addressId = selectedAddressId;

      if (showNewAddress || !addressId) {
        if (!newAddress.address_line_1 || !newAddress.city || !newAddress.country) {
          throw new Error("Please fill in address line, city, and country.");
        }
        const created = await request("/addresses", "POST", {
          ...newAddress,
          type: "shipping",
          is_default: addresses.length === 0,
        });
        addressId = created?.data?.id;
        if (!addressId) throw new Error("Could not save the new address.");
      }

      const result = await request("/cart/checkout", "POST", { shipping_address_id: addressId });
      if (result?.data?.order?.id) {
        router.visit(`/orders/${result.data.order.id}`);
      } else {
        await refresh();
      }
    } catch (e) {
      setError(e.message || "Checkout failed.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <Container>
      <section className="space-y-6">
        <header className="flex flex-col gap-1">
          <p className="text-xs uppercase tracking-[0.24em] text-slate-400">Storefront</p>
          <h1 className="text-3xl font-black tracking-tight text-slate-900">Your cart</h1>
          <p className="text-sm text-slate-500">{totalItems} item{totalItems === 1 ? "" : "s"}</p>
        </header>

        {error && <div className="rounded-2xl border border-rose-200 bg-rose-50 p-3 text-sm text-rose-700">{error}</div>}

        {items.length === 0 ? (
          <div className="rounded-[2rem] border border-slate-100 bg-white p-10 text-center shadow-sm">
            <p className="text-sm text-slate-500">Your cart is empty.</p>
            <Link href="/products" className="mt-3 inline-block rounded-full bg-sky-500 px-4 py-2 text-sm font-semibold text-white hover:bg-sky-600">
              Browse products
            </Link>
          </div>
        ) : (
          <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
            <div className="space-y-3">
              {items.map((item) => {
                const variant = item.variant || {};
                const product = item.product || {};
                const price = Number(variant.discount_price ?? variant.price ?? 0);
                const image = variant.images?.find((img) => img.is_primary) || variant.images?.[0];
                return (
                  <div key={item.id} className="flex gap-4 rounded-2xl border border-slate-100 bg-white p-4 shadow-sm">
                    {image?.image_url ? (
                      <img src={image.image_url} alt={product.name || "Product"} className="h-24 w-24 rounded-xl object-cover" />
                    ) : (
                      <div className="h-24 w-24 rounded-xl bg-slate-100" />
                    )}
                    <div className="flex-1 space-y-1">
                      <p className="text-sm font-semibold text-slate-900">{product.name || variant.name || "Item"}</p>
                      <p className="text-xs text-slate-500">SKU: {variant.sku}</p>
                      <p className="text-sm font-semibold text-sky-700">${price.toFixed(2)}</p>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <div className="inline-flex items-center rounded-full border border-slate-200">
                        <button
                          type="button"
                          onClick={() => updateQuantity(item, Number(item.quantity) - 1)}
                          disabled={busy}
                          className="px-3 py-1 text-sm"
                        >
                          −
                        </button>
                        <span className="min-w-[2ch] px-2 text-center text-sm">{item.quantity}</span>
                        <button
                          type="button"
                          onClick={() => updateQuantity(item, Number(item.quantity) + 1)}
                          disabled={busy}
                          className="px-3 py-1 text-sm"
                        >
                          +
                        </button>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeItem(item)}
                        disabled={busy}
                        className="rounded-xl border border-rose-200 bg-rose-50 px-3 py-1 text-xs text-rose-700"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            <aside className="rounded-[2rem] border border-slate-100 bg-white p-6 shadow-sm h-fit space-y-4">
              <h2 className="text-base font-semibold text-slate-900">Order summary</h2>
              <div className="flex items-center justify-between text-sm text-slate-600">
                <span>Subtotal</span>
                <span className="font-semibold text-slate-900">${subtotal.toFixed(2)}</span>
              </div>
              <p className="text-xs text-slate-500">Taxes and shipping calculated at checkout.</p>

              <div className="space-y-2 border-t border-slate-100 pt-4">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Shipping address</p>

                {addresses.length > 0 && !showNewAddress && (
                  <div className="space-y-2">
                    {addresses.map((a) => (
                      <label key={a.id} className="flex cursor-pointer items-start gap-2 rounded-2xl border border-slate-200 p-3 text-xs text-slate-700">
                        <input
                          type="radio"
                          name="address"
                          checked={selectedAddressId === a.id}
                          onChange={() => setSelectedAddressId(a.id)}
                          className="mt-0.5"
                        />
                        <span>
                          <span className="block font-semibold text-slate-900">{a.address_line_1}</span>
                          {a.address_line_2 && <span className="block">{a.address_line_2}</span>}
                          <span className="block">
                            {[a.city, a.state, a.postal_code].filter(Boolean).join(", ")}
                          </span>
                          <span className="block">{a.country}</span>
                        </span>
                      </label>
                    ))}
                    <button
                      type="button"
                      onClick={() => setShowNewAddress(true)}
                      className="text-xs font-semibold text-sky-700 hover:underline"
                    >
                      + Use a new address
                    </button>
                  </div>
                )}

                {showNewAddress && (
                  <div className="space-y-2">
                    <input
                      placeholder="Address line 1"
                      value={newAddress.address_line_1}
                      onChange={(e) => setNewAddress({ ...newAddress, address_line_1: e.target.value })}
                      className="w-full rounded-2xl border border-slate-200 px-3 py-2 text-sm"
                    />
                    <input
                      placeholder="Address line 2 (optional)"
                      value={newAddress.address_line_2}
                      onChange={(e) => setNewAddress({ ...newAddress, address_line_2: e.target.value })}
                      className="w-full rounded-2xl border border-slate-200 px-3 py-2 text-sm"
                    />
                    <div className="grid grid-cols-2 gap-2">
                      <input
                        placeholder="City"
                        value={newAddress.city}
                        onChange={(e) => setNewAddress({ ...newAddress, city: e.target.value })}
                        className="rounded-2xl border border-slate-200 px-3 py-2 text-sm"
                      />
                      <input
                        placeholder="State"
                        value={newAddress.state}
                        onChange={(e) => setNewAddress({ ...newAddress, state: e.target.value })}
                        className="rounded-2xl border border-slate-200 px-3 py-2 text-sm"
                      />
                      <input
                        placeholder="Postal code"
                        value={newAddress.postal_code}
                        onChange={(e) => setNewAddress({ ...newAddress, postal_code: e.target.value })}
                        className="rounded-2xl border border-slate-200 px-3 py-2 text-sm"
                      />
                      <input
                        placeholder="Country"
                        value={newAddress.country}
                        onChange={(e) => setNewAddress({ ...newAddress, country: e.target.value })}
                        className="rounded-2xl border border-slate-200 px-3 py-2 text-sm"
                      />
                    </div>
                    {addresses.length > 0 && (
                      <button
                        type="button"
                        onClick={() => setShowNewAddress(false)}
                        className="text-xs font-semibold text-slate-500 hover:underline"
                      >
                        Use a saved address instead
                      </button>
                    )}
                  </div>
                )}
              </div>

              <button
                type="button"
                onClick={checkout}
                disabled={busy}
                className="w-full rounded-full bg-sky-500 px-4 py-3 text-sm font-semibold text-white hover:bg-sky-600 disabled:opacity-60"
              >
                {busy ? "Processing..." : "Checkout"}
              </button>
            </aside>
          </div>
        )}
      </section>
    </Container>
  );
}
