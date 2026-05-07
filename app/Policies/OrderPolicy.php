<?php

namespace App\Policies;

use App\Domains\Orders\Models\Order;
use App\Domains\Account\Models\User;

class OrderPolicy
{
  /**
   * Determine if the user can view the order
   */
  public function view(User $user, Order $order): bool
  {
    return $user->id === $order->user_id || $user->isAdmin();
  }

  /**
   * Determine if the user can update the order
   */
  public function update(User $user, Order $order): bool
  {
    return $user->isAdmin();
  }

  /**
   * Determine if the user can delete the order
   */
  public function delete(User $user, Order $order): bool
  {
    return $user->isAdmin();
  }
}
