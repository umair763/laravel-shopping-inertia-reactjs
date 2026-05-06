import React, { useState } from 'react';
import AdminLayout from '@/layout/admin.layout';
import { router } from '@inertiajs/react';

export default function OrderDetail({ order }) {
  const [selectedStatus, setSelectedStatus] = useState(order.status);
  const [loading, setLoading] = useState(false);

  const statusColors = {
    pending: 'bg-yellow-100 text-yellow-800',
    processing: 'bg-blue-100 text-blue-800',
    completed: 'bg-green-100 text-green-800',
    cancelled: 'bg-red-100 text-red-800',
  };

  const handleStatusUpdate = async () => {
    if (selectedStatus === order.status) {
      alert('Please select a different status');
      return;
    }

    setLoading(true);
    try {
      router.put(`/admin/orders/${order.id}`, {
        status: selectedStatus,
      }, {
        onSuccess: () => {
          alert('Order status updated successfully');
          setLoading(false);
        },
        onError: () => {
          alert('Error updating order status');
          setLoading(false);
        },
      });
    } catch (error) {
      console.error('Error:', error);
      setLoading(false);
    }
  };

  return (
    <AdminLayout>
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <button
          onClick={() => window.history.back()}
          className="text-blue-600 hover:text-blue-800 flex items-center gap-2"
        >
          ← Back to Orders
        </button>

        {/* Order Header */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6 pb-6 border-b">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Order #{order.id}</h1>
              <p className="text-gray-600 mt-1">
                Placed on {new Date(order.created_at).toLocaleDateString()}
              </p>
            </div>
            <span className={`inline-block px-4 py-2 rounded-full text-sm font-semibold ${statusColors[order.status]}`}>
              {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
            </span>
          </div>

          {/* Order Info Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <p className="text-gray-600 text-sm mb-1">Customer Name</p>
              <p className="text-lg font-semibold">{order.user.name}</p>
              <p className="text-sm text-gray-600">{order.user.email}</p>
            </div>
            <div>
              <p className="text-gray-600 text-sm mb-1">Shipping Address</p>
              <p className="text-lg font-semibold">{order.shipping_address}</p>
            </div>
            <div>
              <p className="text-gray-600 text-sm mb-1">Total Amount</p>
              <p className="text-2xl font-bold text-blue-600">${order.total_amount}</p>
            </div>
          </div>
        </div>

        {/* Status Update */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Update Order Status</h2>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="pending">Pending</option>
                <option value="processing">Processing</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
            <button
              onClick={handleStatusUpdate}
              disabled={loading}
              className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-gray-400 font-medium transition"
            >
              {loading ? 'Updating...' : 'Update Status'}
            </button>
          </div>
        </div>

        {/* Order Items */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="px-6 py-4 bg-gray-50 border-b">
            <h2 className="text-xl font-bold text-gray-900">Order Items</h2>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Product</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Price</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Quantity</th>
                  <th className="px-6 py-3 text-right text-sm font-semibold text-gray-700">Total</th>
                </tr>
              </thead>
              <tbody>
                {order.items.map(item => (
                  <tr key={item.id} className="border-b hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={item.product.image_url || 'https://via.placeholder.com/50?text=Product'}
                          alt={item.product.name}
                          className="w-12 h-12 object-cover rounded"
                        />
                        <div>
                          <p className="font-medium text-gray-900">{item.product.name}</p>
                          <p className="text-sm text-gray-600">SKU: {item.product.sku}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-900">${item.unit_price}</td>
                    <td className="px-6 py-4 text-gray-900">{item.quantity}</td>
                    <td className="px-6 py-4 text-right font-semibold text-gray-900">${item.total_price}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Summary */}
          <div className="px-6 py-6 bg-gray-50 flex justify-end">
            <div className="space-y-2">
              <div className="flex gap-6">
                <span className="text-gray-600">Subtotal:</span>
                <span className="font-semibold text-gray-900">${order.total_amount}</span>
              </div>
              <div className="flex gap-6">
                <span className="text-gray-600">Shipping:</span>
                <span className="font-semibold text-gray-900">FREE</span>
              </div>
              <div className="border-t pt-2 flex gap-6">
                <span className="font-semibold text-gray-900">Total:</span>
                <span className="font-bold text-xl text-blue-600">${order.total_amount}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
