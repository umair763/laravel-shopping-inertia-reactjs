<?php

namespace App\Http\Controllers;

use App\Models\Order;
use App\Models\Product;
use Illuminate\Http\Request;
use Inertia\Inertia;

class OrderController extends Controller
{
  /**
   * Display all orders for authenticated user
   */
  public function index(Request $request)
  {
    $orders = $request->user()->orders()
      ->orderBy('created_at', 'desc')
      ->paginate(10);

    return Inertia::render('User/Orders', [
      'orders' => $orders,
    ]);
  }

  /**
   * Show single order details
   */
  public function show(Order $order)
  {
    // Authorize user can only view their own orders
    $this->authorize('view', $order);

    return Inertia::render('User/OrderDetail', [
      'order' => $order->load('items.product'),
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
      $order = new Order([
        'user_id' => $request->user()->id,
        'shipping_address' => $validated['shipping_address'],
        'total_amount' => 0,
        'status' => 'pending',
      ]);

      $totalAmount = 0;

      foreach ($validated['items'] as $item) {
        $product = Product::findOrFail($item['product_id']);

        if ($product->quantity < $item['quantity']) {
          return response()->json([
            'message' => "Insufficient stock for {$product->name}",
            'success' => false,
          ], 422);
        }

        $itemTotal = $product->price * $item['quantity'];
        $totalAmount += $itemTotal;

        // Deduct quantity
        $product->decrement('quantity', $item['quantity']);
      }

      $order->total_amount = $totalAmount;
      $order->save();

      // Save order items
      foreach ($validated['items'] as $item) {
        $product = Product::findOrFail($item['product_id']);
        $order->items()->create([
          'product_id' => $product->id,
          'quantity' => $item['quantity'],
          'unit_price' => $product->price,
          'total_price' => $product->price * $item['quantity'],
        ]);
      }

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
    $orders = $request->user()->orders()
      ->with('items.product')
      ->orderBy('created_at', 'desc')
      ->get();

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
}
