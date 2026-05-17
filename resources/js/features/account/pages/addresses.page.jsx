import React, { useState, useEffect } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import axiosClient from "../../../shared/api/axios.client";
import { Plus, Trash2, Edit2, MapPin, Phone } from "lucide-react";

// Popular countries for quick selection
const POPULAR_COUNTRIES = [
  "Pakistan",
  "India",
  "United States",
  "United Kingdom",
  "Canada",
  "Australia",
  "Other",
];

// Pakistan states
const PAKISTAN_STATES = [
  "Sindh",
  "Punjab",
  "Khyber Pakhtunkhwa",
  "Balochistan",
  "Gilgit-Baltistan",
  "Azad Jammu and Kashmir",
  "Islamabad",
];

function AddressForm({ address, onSubmit, onCancel, loading }) {
  const [formData, setFormData] = useState(
    address || {
      type: "shipping",
      country: "Pakistan",
      state: "Sindh",
      city: "",
      postal_code: "",
      address_line_1: "",
      address_line_2: "",
      phone: "",
      is_default: false,
    }
  );
  const [errors, setErrors] = useState({});
  const [validating, setValidating] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validateCity = async (city, country) => {
    if (!city) return true;
    
    try {
      setValidating(true);
      // Using a simple validation: check if city name is reasonable (not empty, not too short)
      if (city.trim().length < 2) {
        setErrors((prev) => ({
          ...prev,
          city: "City name is too short",
        }));
        return false;
      }
      return true;
    } catch (err) {
      console.warn("City validation warning:", err);
      return true; // Don't block on validation errors
    } finally {
      setValidating(false);
    }
  };

  const validatePostalCode = (postalCode, country) => {
    if (!postalCode) return true; // Postal code is optional

    const patterns = {
      Pakistan: /^\d{5}$/, // Pakistan uses 5-digit postal codes
      India: /^\d{6}$/, // India uses 6-digit postal codes
      "United States": /^\d{5}(-\d{4})?$/, // US ZIP codes
      "United Kingdom": /^[A-Z]{1,2}\d[A-Z\d]?\s?\d[A-Z]{2}$/i, // UK postcodes
      Canada: /^[A-Z]\d[A-Z]\s?\d[A-Z]\d$/i, // Canadian postal codes
    };

    const pattern = patterns[country];
    if (pattern && !pattern.test(postalCode)) {
      setErrors((prev) => ({
        ...prev,
        postal_code: `Invalid postal code format for ${country}`,
      }));
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});

    // Validate
    if (!formData.address_line_1.trim()) {
      setErrors((prev) => ({
        ...prev,
        address_line_1: "Address line 1 is required",
      }));
      return;
    }

    if (!formData.city.trim()) {
      setErrors((prev) => ({
        ...prev,
        city: "City is required",
      }));
      return;
    }

    if (!formData.country) {
      setErrors((prev) => ({
        ...prev,
        country: "Country is required",
      }));
      return;
    }

    if (!validateCity(formData.city, formData.country)) {
      return;
    }

    if (!validatePostalCode(formData.postal_code, formData.country)) {
      return;
    }

    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 rounded-2xl border border-sky-100 bg-white p-6">
      <h3 className="text-lg font-semibold text-slate-900">
        {address ? "Edit Address" : "Add New Address"}
      </h3>

      {/* Type */}
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">
          Address Type
        </label>
        <select
          name="type"
          value={formData.type}
          onChange={handleChange}
          className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500"
        >
          <option value="shipping">Shipping</option>
          <option value="billing">Billing</option>
          <option value="work">Work</option>
          <option value="other">Other</option>
        </select>
      </div>

      {/* Country */}
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">
          Country *
        </label>
        <select
          name="country"
          value={formData.country}
          onChange={handleChange}
          className={`w-full rounded-lg border px-3 py-2 text-sm outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 ${
            errors.country ? "border-red-300" : "border-slate-200"
          }`}
        >
          <option value="">Select a country</option>
          {POPULAR_COUNTRIES.map((country) => (
            <option key={country} value={country}>
              {country}
            </option>
          ))}
        </select>
        {errors.country && (
          <p className="mt-1 text-sm text-red-600">{errors.country}</p>
        )}
      </div>

      {/* State/Province (show for Pakistan) */}
      {formData.country === "Pakistan" && (
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            State/Province
          </label>
          <select
            name="state"
            value={formData.state}
            onChange={handleChange}
            className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500"
          >
            <option value="">Select a state</option>
            {PAKISTAN_STATES.map((state) => (
              <option key={state} value={state}>
                {state}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* State (text for other countries) */}
      {formData.country !== "Pakistan" && (
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            State/Province
          </label>
          <input
            type="text"
            name="state"
            value={formData.state}
            onChange={handleChange}
            placeholder="e.g., California"
            className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500"
          />
        </div>
      )}

      {/* City */}
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">
          City *
        </label>
        <input
          type="text"
          name="city"
          value={formData.city}
          onChange={handleChange}
          placeholder="e.g., Karachi"
          className={`w-full rounded-lg border px-3 py-2 text-sm outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 ${
            errors.city ? "border-red-300" : "border-slate-200"
          }`}
        />
        {errors.city && (
          <p className="mt-1 text-sm text-red-600">{errors.city}</p>
        )}
      </div>

      {/* Postal Code */}
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">
          Postal Code
        </label>
        <input
          type="text"
          name="postal_code"
          value={formData.postal_code}
          onChange={handleChange}
          placeholder={
            formData.country === "Pakistan"
              ? "e.g., 74000"
              : "e.g., 12345"
          }
          className={`w-full rounded-lg border px-3 py-2 text-sm outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 ${
            errors.postal_code ? "border-red-300" : "border-slate-200"
          }`}
        />
        {errors.postal_code && (
          <p className="mt-1 text-sm text-red-600">{errors.postal_code}</p>
        )}
      </div>

      {/* Address Line 1 */}
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">
          Address Line 1 *
        </label>
        <input
          type="text"
          name="address_line_1"
          value={formData.address_line_1}
          onChange={handleChange}
          placeholder="e.g., 123 Main Street"
          className={`w-full rounded-lg border px-3 py-2 text-sm outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 ${
            errors.address_line_1 ? "border-red-300" : "border-slate-200"
          }`}
        />
        {errors.address_line_1 && (
          <p className="mt-1 text-sm text-red-600">{errors.address_line_1}</p>
        )}
      </div>

      {/* Address Line 2 */}
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">
          Address Line 2
        </label>
        <input
          type="text"
          name="address_line_2"
          value={formData.address_line_2}
          onChange={handleChange}
          placeholder="e.g., Apartment 4B"
          className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500"
        />
      </div>

      {/* Phone */}
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">
          Phone Number
        </label>
        <input
          type="tel"
          name="phone"
          value={formData.phone}
          onChange={handleChange}
          placeholder="e.g., +92-300-1234567"
          className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500"
        />
      </div>

      {/* Default Address */}
      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          id="is_default"
          name="is_default"
          checked={formData.is_default}
          onChange={handleChange}
          className="rounded border-slate-300"
        />
        <label
          htmlFor="is_default"
          className="text-sm font-medium text-slate-700 cursor-pointer"
        >
          Set as default address
        </label>
      </div>

      {/* Buttons */}
      <div className="flex gap-2 pt-4">
        <button
          type="submit"
          disabled={loading || validating}
          className="flex-1 rounded-lg bg-sky-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-sky-600 disabled:opacity-50"
        >
          {loading ? "Saving..." : "Save Address"}
        </button>
        <button
          type="button"
          onClick={onCancel}
          disabled={loading}
          className="flex-1 rounded-lg border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:opacity-50"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}

function AddressCard({ address, onEdit, onDelete, isDefault }) {
  return (
    <div
      className={`rounded-2xl border p-6 transition ${
        isDefault
          ? "border-sky-300 bg-sky-50 ring-1 ring-sky-100"
          : "border-slate-200 bg-white hover:border-slate-300"
      }`}
    >
      {isDefault && (
        <div className="mb-3 inline-block rounded-full bg-sky-500 px-3 py-1 text-xs font-semibold text-white">
          Default Address
        </div>
      )}

      <div className="space-y-2">
        <div className="flex items-start gap-2">
          <MapPin size={18} className="mt-0.5 shrink-0 text-sky-600" />
          <div className="flex-1">
            <p className="font-semibold text-slate-900 capitalize">
              {address.type} Address
            </p>
            <p className="text-sm text-slate-600">{address.address_line_1}</p>
            {address.address_line_2 && (
              <p className="text-sm text-slate-600">{address.address_line_2}</p>
            )}
          </div>
        </div>

        <div className="text-sm text-slate-600 space-y-1 ml-6">
          <p>
            {address.city}
            {address.state ? `, ${address.state}` : ""}
            {address.postal_code ? ` ${address.postal_code}` : ""}
          </p>
          <p>{address.country}</p>
        </div>

        {address.phone && (
          <div className="flex items-center gap-2 ml-6 text-sm text-slate-600">
            <Phone size={16} />
            {address.phone}
          </div>
        )}
      </div>

      <div className="mt-4 flex gap-2">
        <button
          onClick={() => onEdit(address)}
          className="flex items-center gap-2 rounded-lg bg-sky-100 px-3 py-2 text-sm font-medium text-sky-700 transition hover:bg-sky-200"
        >
          <Edit2 size={16} />
          Edit
        </button>
        <button
          onClick={() => {
            if (
              confirm(
                "Are you sure you want to delete this address?"
              )
            ) {
              onDelete(address.id);
            }
          }}
          className="flex items-center gap-2 rounded-lg bg-red-100 px-3 py-2 text-sm font-medium text-red-700 transition hover:bg-red-200"
        >
          <Trash2 size={16} />
          Delete
        </button>
      </div>
    </div>
  );
}

export default function AddressesPage() {
  const [showForm, setShowForm] = useState(false);
  const [editingAddress, setEditingAddress] = useState(null);

  const { data, isLoading, refetch } = useQuery({
    queryKey: ["addresses"],
    queryFn: async () => {
      const res = await axiosClient.get("/addresses");
      return res.data.data;
    },
  });

  const createMutation = useMutation({
    mutationFn: async (formData) => {
      const res = await axiosClient.post("/addresses", formData);
      return res.data;
    },
    onSuccess: () => {
      refetch();
      setShowForm(false);
      alert("✓ Address added successfully!");
    },
    onError: (error) => {
      alert(
        "Error: " +
          (error.response?.data?.message ||
            "Failed to add address")
      );
    },
  });

  const updateMutation = useMutation({
    mutationFn: async (formData) => {
      const res = await axiosClient.put(
        `/addresses/${editingAddress.id}`,
        formData
      );
      return res.data;
    },
    onSuccess: () => {
      refetch();
      setEditingAddress(null);
      setShowForm(false);
      alert("✓ Address updated successfully!");
    },
    onError: (error) => {
      alert(
        "Error: " +
          (error.response?.data?.message ||
            "Failed to update address")
      );
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id) => {
      await axiosClient.delete(`/addresses/${id}`);
    },
    onSuccess: () => {
      refetch();
      alert("✓ Address deleted successfully!");
    },
    onError: (error) => {
      alert(
        "Error: " +
          (error.response?.data?.message ||
            "Failed to delete address")
      );
    },
  });

  const handleSubmit = (formData) => {
    if (editingAddress) {
      updateMutation.mutate(formData);
    } else {
      createMutation.mutate(formData);
    }
  };

  const handleEdit = (address) => {
    setEditingAddress(address);
    setShowForm(true);
  };

  const handleCancel = () => {
    setEditingAddress(null);
    setShowForm(false);
  };

  const defaultAddress = data?.find((a) => a.is_default);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">My Addresses</h1>
          <p className="mt-1 text-slate-600">
            Manage your shipping and billing addresses
          </p>
        </div>
        {!showForm && (
          <button
            onClick={() => {
              setEditingAddress(null);
              setShowForm(true);
            }}
            className="flex items-center gap-2 rounded-lg bg-sky-500 px-4 py-2 font-semibold text-white transition hover:bg-sky-600"
          >
            <Plus size={20} />
            Add Address
          </button>
        )}
      </div>

      {showForm && (
        <AddressForm
          address={editingAddress}
          onSubmit={handleSubmit}
          onCancel={handleCancel}
          loading={createMutation.isPending || updateMutation.isPending}
        />
      )}

      {isLoading ? (
        <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center">
          <p className="text-slate-600">Loading addresses...</p>
        </div>
      ) : data && data.length > 0 ? (
        <div className="grid gap-4 md:grid-cols-2">
          {data.map((address) => (
            <AddressCard
              key={address.id}
              address={address}
              isDefault={defaultAddress?.id === address.id}
              onEdit={handleEdit}
              onDelete={(id) => deleteMutation.mutate(id)}
            />
          ))}
        </div>
      ) : (
        <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center">
          <MapPin size={48} className="mx-auto mb-4 text-slate-300" />
          <p className="text-slate-600">No addresses added yet</p>
          <button
            onClick={() => {
              setEditingAddress(null);
              setShowForm(true);
            }}
            className="mt-4 rounded-lg bg-sky-500 px-4 py-2 font-semibold text-white transition hover:bg-sky-600"
          >
            Add Your First Address
          </button>
        </div>
      )}
    </div>
  );
}
