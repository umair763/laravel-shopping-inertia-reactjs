<?php

namespace App\Domains\Orders\Actions;

use App\Domains\Orders\Models\Order;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

class ListAllOrders
{
  public function handle(int $perPage = 20): LengthAwarePaginator
  {
    return Order::with('user')
      ->orderBy('created_at', 'desc')
      ->paginate($perPage);
  }
}

