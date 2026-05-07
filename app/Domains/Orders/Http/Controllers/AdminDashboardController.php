<?php

namespace App\Domains\Orders\Http\Controllers;

use App\Domains\Orders\Actions\GetAdminDashboardStats;
use App\Domains\Orders\Actions\ListAllOrders;
use App\Domains\Orders\Actions\UpdateOrderStatus;
use App\Domains\Account\Models\User;
use App\Domains\Catalog\Models\Product;
use App\Domains\Orders\Models\Order;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;

class AdminDashboardController extends Controller
{
  /**
   * Display admin dashboard with stats
   */
  public function index()
  {
    $stats = app(GetAdminDashboardStats::class)->handle();

    return Inertia::render('Admin/Dashboard', [
      'stats' => $stats,
      'recent_orders' => $stats['recent_orders'] ?? [],
    ]);
  }

  /**
   * Display all orders for admin
   */
  public function orders()
  {
    $orders = app(ListAllOrders::class)->handle(20);

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
      'status' => 'required|in:pending,processing,shipped,delivered,cancelled,returned',
    ]);

    app(UpdateOrderStatus::class)->handle($order, $validated['status']);

    return redirect()->route('admin.orders')
      ->with('success', 'Order status updated successfully');
  }

  /**
   * API: Get dashboard stats as JSON
   */
  public function apiStats()
  {
    return response()->json([
      'data' => app(GetAdminDashboardStats::class)->handle(),
      'success' => true,
    ]);
  }
}
