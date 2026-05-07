<?php

namespace App\Domains\Orders\Actions;

use App\Domains\Account\Models\User;
use App\Domains\Orders\Models\Order;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\Collection;

class ListUserOrders
{
  /**
   * @return LengthAwarePaginator|Collection<int, Order>
   */
  public function handle(User $user, bool $paginate = true, int $perPage = 10)
  {
    $query = $user->orders()
      ->orderBy('created_at', 'desc');

    return $paginate
      ? $query->with(['items.product', 'items.variant', 'shippingAddress'])->paginate($perPage)
      : $query->with(['items.product', 'items.variant', 'shippingAddress'])->get();
  }
}

