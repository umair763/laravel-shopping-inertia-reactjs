<?php

namespace App\Domains\Orders\Http\Controllers\Admin;

use App\Domains\Orders\Actions\ListAllOrders;
use App\Domains\Orders\Actions\UpdateOrderStatus;
use App\Domains\Orders\Http\Requests\Admin\UpdateOrderStatusRequest;
use App\Domains\Orders\Models\Order;
use App\Http\Controllers\Controller;

class OrderAdminController extends Controller
{
  public function index()
  {
    $orders = app(ListAllOrders::class)->handle(50);

    return response()->json([
      'data' => $orders,
      'success' => true,
    ]);
  }

  public function show(Order $order)
  {
    return response()->json([
      'data' => $order->load('items.product', 'items.variant', 'user', 'shippingAddress', 'payment'),
      'success' => true,
    ]);
  }

  public function updateStatus(UpdateOrderStatusRequest $request, Order $order)
  {
    $order = app(UpdateOrderStatus::class)->handle($order, $request->validated()['order_status']);

    return response()->json([
      'data' => $order,
      'success' => true,
    ]);
  }
}

