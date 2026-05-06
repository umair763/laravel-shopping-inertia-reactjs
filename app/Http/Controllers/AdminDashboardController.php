<?php

namespace App\Http\Controllers;

use App\Models\Order;
use App\Models\Product;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;

class AdminDashboardController extends Controller
{
  /**
   * Display admin dashboard with stats
   */
  public function index()
  {
    $stats = [
      'total_products' => Product::count(),
      'active_products' => Product::where('is_active', true)->count(),
      'total_users' => User::where('role', 'user')->count(),
      'total_orders' => Order::count(),
      'total_revenue' => Order::where('status', 'completed')->sum('total_amount'),
      'pending_orders' => Order::where('status', 'pending')->count(),
    ];

    $recent_orders = Order::with('user')
      ->orderBy('created_at', 'desc')
      ->limit(10)
      ->get();

    return Inertia::render('Admin/Dashboard', [
      'stats' => $stats,
      'recent_orders' => $recent_orders,
    ]);
  }

  /**
   * Display all orders for admin
   */
  public function orders()
  {
    $orders = Order::with('user')
      ->orderBy('created_at', 'desc')
      ->paginate(20);

    return Inertia::render('Admin/Orders', [
      'orders' => $orders,
    ]);
  }

  /**
   * Show order details for admin
   */
  public function showOrder(Order $order)
  {
    return Inertia::render('Admin/OrderDetail', [
      'order' => $order->load('items.product', 'user'),
    ]);
  }

  /**
   * Update order status
   */
  public function updateOrder(Request $request, Order $order)
  {
    $validated = $request->validate([
      'status' => 'required|in:pending,processing,completed,cancelled',
    ]);

    $order->update($validated);

    return redirect()->route('admin.orders')
      ->with('success', 'Order status updated successfully');
  }

  /**
   * API: Get dashboard stats as JSON
   */
  public function apiStats()
  {
    $stats = [
      'total_products' => Product::count(),
      'active_products' => Product::where('is_active', true)->count(),
      'total_users' => User::where('role', 'user')->count(),
      'total_orders' => Order::count(),
      'total_revenue' => Order::where('status', 'completed')->sum('total_amount'),
      'pending_orders' => Order::where('status', 'pending')->count(),
      'recent_orders' => Order::with('user')
        ->orderBy('created_at', 'desc')
        ->limit(10)
        ->get(),
    ];

    return response()->json([
      'data' => $stats,
      'success' => true,
    ]);
  }
}
