import React from 'react';
import AdminLayout from '@/layout/admin.layout';
import { StatCard } from '@/features/admin/components';

export default function Dashboard({ stats, recent_orders }) {
  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-2">Welcome back! Here's what's happening with your store.</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <StatCard
            title="Total Products"
            value={stats.total_products}
            icon="📦"
            color="bg-blue-50 text-blue-600"
          />
          <StatCard
            title="Active Products"
            value={stats.active_products}
            icon="✓"
            color="bg-green-50 text-green-600"
          />
          <StatCard
            title="Total Users"
            value={stats.total_users}
            icon="👥"
            color="bg-purple-50 text-purple-600"
          />
          <StatCard
            title="Total Orders"
            value={stats.total_orders}
            icon="🛒"
            color="bg-orange-50 text-orange-600"
          />
          <StatCard
            title="Pending Orders"
            value={stats.pending_orders}
            icon="⏳"
            color="bg-yellow-50 text-yellow-600"
          />
          <StatCard
            title="Total Revenue"
            value={`$${parseFloat(stats.total_revenue).toFixed(2)}`}
            icon="💰"
            color="bg-indigo-50 text-indigo-600"
          />
        </div>

        {/* Recent Orders */}
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 bg-gray-50 border-b">
            <h2 className="text-xl font-bold text-gray-900">Recent Orders</h2>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Order ID</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Customer</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Amount</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Status</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Date</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Action</th>
                </tr>
              </thead>
              <tbody>
                {recent_orders && recent_orders.map(order => (
                  <tr key={order.id} className="border-b hover:bg-gray-50">
                    <td className="px-6 py-4 font-medium text-gray-900">#{order.id}</td>
                    <td className="px-6 py-4 text-gray-700">{order.user.name}</td>
                    <td className="px-6 py-4 font-semibold text-gray-900">${order.total_amount}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                        order.status === 'completed' ? 'bg-green-100 text-green-800' :
                        order.status === 'processing' ? 'bg-blue-100 text-blue-800' :
                        order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-600">
                      {new Date(order.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4">
                      <a
                        href={`/admin/orders/${order.id}`}
                        className="text-blue-600 hover:text-blue-800 font-medium"
                      >
                        View
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {(!recent_orders || recent_orders.length === 0) && (
            <div className="px-6 py-8 text-center text-gray-500">
              No recent orders
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Quick Actions</h3>
            <div className="space-y-2">
              <a href="/admin/products/create" className="block px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 text-center font-medium">
                Add New Product
              </a>
              <a href="/admin/products" className="block px-4 py-2 bg-gray-200 text-gray-900 rounded hover:bg-gray-300 text-center font-medium">
                Manage Products
              </a>
              <a href="/admin/orders" className="block px-4 py-2 bg-gray-200 text-gray-900 rounded hover:bg-gray-300 text-center font-medium">
                View All Orders
              </a>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Store Information</h3>
            <div className="space-y-3 text-gray-700">
              <p><strong>Store Status:</strong> <span className="text-green-600">● Online</span></p>
              <p><strong>Last Update:</strong> {new Date().toLocaleDateString()}</p>
              <p><strong>Total Categories:</strong> 6</p>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
