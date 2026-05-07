<?php

namespace App\Domains\Orders\Actions;

use App\Domains\Orders\Models\Order;

class UpdateOrderStatus
{
  public function handle(Order $order, string $status): Order
  {
    $order->update(['order_status' => $status]);

    return $order;
  }
}
