<?php

namespace App\Domains\Orders\Http\Controllers;

use App\Domains\Orders\Actions\CreateOrder;
use App\Domains\Orders\Actions\ListUserOrders;
use App\Domains\Catalog\Models\Product;
use App\Domains\Orders\Models\Order;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;

class OrderController extends Controller
{
  /**
   * Display all orders for authenticated user
   */
  public function index(Request $request)
  {
    $orders = app(ListUserOrders::class)->handle($request->user(), true, 10);

    return Inertia::render('User/Orders', [
      'orders' => $orders,
    ]);
  }

  /**
   * Show single order details — loads all relations needed for the detail view
   */
  public function show(Order $order)
  {
    $this->authorize('view', $order);

    $order->load([
      'items.product',
      'items.variant',
      'shippingAddress',
      'payment',
      'user:id,first_name,last_name,email',
    ]);

    return Inertia::render('User/OrderDetail', [
      'order' => $order,
    ]);
  }

  /**
   * Store a new order
   */
  public function store(Request $request)
  {
    $validated = $request->validate([
      'items' => 'required|array',
      'items.*.product_id' => 'required|exists:products,id',
      'items.*.quantity' => 'required|integer|min:1',
      'shipping_address' => 'required|string|min:5',
    ]);

    try {
      $order = app(CreateOrder::class)->handle([
        'user_id' => $request->user()->id,
        'shipping_address' => $validated['shipping_address'],
        'items' => $validated['items'],
      ]);

      return response()->json([
        'message' => 'Order created successfully',
        'order_id' => $order->id,
        'success' => true,
      ]);

    } catch (\Exception $e) {
      return response()->json([
        'message' => 'Error creating order: ' . $e->getMessage(),
        'success' => false,
      ], 500);
    }
  }

  /**
   * API: Get all user's orders as JSON
   */
  public function apiIndex(Request $request)
  {
    $orders = app(ListUserOrders::class)->handle($request->user(), false);

    return response()->json([
      'data' => $orders,
      'success' => true,
    ]);
  }

  /**
   * API: Create order via JSON
   */
  public function apiStore(Request $request)
  {
    return $this->store($request);
  }

  /**
   * API: Get a single order as JSON
   */
  public function apiShow(Request $request, Order $order)
  {
    $this->authorize('view', $order);

    return response()->json([
      'data' => $order->load(['items.product', 'items.variant', 'shippingAddress', 'payment']),
      'success' => true,
    ]);
  }
}
