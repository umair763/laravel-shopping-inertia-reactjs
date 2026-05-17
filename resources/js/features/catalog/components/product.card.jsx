import React, { useState } from "react";
import formatPrice from "../../../shared/utils/format.price.js";
import useAuth from "../../../shared/hooks/use.auth.js";
import useApiToken from "../../../shared/hooks/use.api.token.js";
import axiosClient from "../../../shared/api/axios.client.js";
import { useMutation } from "@tanstack/react-query";

export default function ProductCard({ product }) {
  const { isAuthenticated } = useAuth();
  useApiToken(); // Ensure token is fetched and stored
  const [showAddToCart, setShowAddToCart] = useState(false);
  const [showQuickCheckout, setShowQuickCheckout] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [paymentMethod, setPaymentMethod] = useState("credit_card");
  const [loading, setLoading] = useState(false);

  // Note: PresentProductForStorefront flattens the data structure
  const variantId = product?.variant_id;
  const image = product?.image_url;
  const price = product?.price || product?.effective_price || 0;

  const addToCartMutation = useMutation({
    mutationFn: async (data) => {
      const response = await axiosClient.post("/api/cart/items", data);
      return response.data;
    },
    onSuccess: () => {
      alert("✓ Added to cart!");
      setShowAddToCart(false);
      setQuantity(1);
    },
    onError: (error) => {
      if (error.response?.status === 401) {
        window.location.href = "/login";
      } else {
        alert("Error: " + (error.response?.data?.message || "Failed to add to cart"));
      }
    },
  });

  const handleAddToCart = () => {
    if (!isAuthenticated) {
      window.location.href = "/login";
      return;
    }
    if (!variantId) {
      alert("This product is not available");
      return;
    }
    addToCartMutation.mutate({
      variant_id: variantId,
      quantity: parseInt(quantity),
    });
  };

  const handleQuickCheckout = async () => {
    if (!isAuthenticated) {
      window.location.href = "/login";
      return;
    }
    if (!variantId) {
      alert("This product is not available");
      return;
    }

    setLoading(true);
    try {
      // First add to cart
      await axiosClient.post("/api/cart/items", {
        variant_id: variantId,
        quantity: parseInt(quantity),
      });

      // Then checkout - redirect to checkout page with this item
      window.location.href = "/cart?checkout=true";
    } catch (error) {
      if (error.response?.status === 401) {
        window.location.href = "/login";
      } else {
        alert("Error: " + (error.response?.data?.message || "Failed to process"));
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <article className="group overflow-hidden rounded-[1.75rem] border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
        {/* Product Image */}
        <div className="aspect-square bg-gradient-to-br from-sky-50 via-white to-stone-50 p-4 overflow-hidden">
          <div className="flex h-full items-center justify-center rounded-[1.25rem] border border-slate-100 bg-white shadow-inner">
            {image ? (
              <img
                src={image}
                alt={product?.name}
                className="h-full w-full object-cover rounded-[1rem]"
                onError={(e) => {
                  e.target.style.display = "none";
                }}
              />
            ) : (
              <div className="h-20 w-20 rounded-full bg-gradient-to-br from-sky-400 via-sky-300 to-cyan-200 opacity-80" />
            )}
          </div>
        </div>

        {/* Product Info */}
        <div className="space-y-3 p-4">
          <h3 className="line-clamp-2 text-sm font-semibold text-slate-900">{product?.name}</h3>
          <p className="text-xs text-slate-500">{product?.brand || "Generic"}</p>
          <p className="text-base font-bold text-sky-700">{formatPrice(price)}</p>

          {/* Action Buttons */}
          <div className="space-y-2 pt-2 grid grid-cols-2 gap-2">
            <button
              onClick={() => setShowAddToCart(true)}
              className="rounded-lg bg-sky-100 px-3 py-2 text-xs font-medium text-sky-700 hover:bg-sky-200 transition whitespace-nowrap"
            >
              + Add to Cart
            </button>
            <button
              onClick={() => setShowQuickCheckout(true)}
              className="rounded-lg bg-sky-600 px-3 py-2 text-xs font-medium text-white hover:bg-sky-700 transition whitespace-nowrap"
            >
              Buy Now
            </button>
          </div>
        </div>
      </article>

      {/* Add to Cart Modal */}
      {showAddToCart && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-sm w-full p-6 space-y-4">
            <h2 className="text-xl font-bold text-slate-900">Add to Cart</h2>
            <p className="text-slate-600">{product?.name}</p>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Quantity</label>
              <input
                type="number"
                min="1"
                value={quantity}
                onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-sky-500"
              />
            </div>

            <div className="flex gap-3 pt-4">
              <button
                onClick={() => setShowAddToCart(false)}
                className="flex-1 px-4 py-2 border border-slate-300 rounded-lg text-slate-700 hover:bg-slate-50 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleAddToCart}
                disabled={addToCartMutation.isPending}
                className="flex-1 px-4 py-2 bg-sky-600 text-white rounded-lg hover:bg-sky-700 transition disabled:opacity-50"
              >
                {addToCartMutation.isPending ? "Adding..." : "Add to Cart"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Quick Checkout Modal */}
      {showQuickCheckout && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-sm w-full p-6 space-y-4">
            <h2 className="text-xl font-bold text-slate-900">Purchase Now</h2>
            <p className="text-slate-600">{product?.name}</p>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Quantity</label>
              <input
                type="number"
                min="1"
                value={quantity}
                onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-sky-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Payment Method</label>
              <select
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value)}
                className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-sky-500"
              >
                <option value="credit_card">Credit Card</option>
                <option value="debit_card">Debit Card</option>
                <option value="bank_transfer">Bank Transfer</option>
                <option value="digital_wallet">Digital Wallet</option>
              </select>
            </div>

            <div className="bg-sky-50 p-3 rounded-lg">
              <p className="text-sm text-slate-600">
                Total: <span className="font-bold text-slate-900">{formatPrice(price * quantity)}</span>
              </p>
            </div>

            <div className="flex gap-3 pt-4">
              <button
                onClick={() => setShowQuickCheckout(false)}
                className="flex-1 px-4 py-2 border border-slate-300 rounded-lg text-slate-700 hover:bg-slate-50 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleQuickCheckout}
                disabled={loading}
                className="flex-1 px-4 py-2 bg-sky-600 text-white rounded-lg hover:bg-sky-700 transition disabled:opacity-50"
              >
                {loading ? "Processing..." : "Continue to Checkout"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

