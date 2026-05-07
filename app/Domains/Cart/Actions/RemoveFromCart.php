<?php

namespace App\Domains\Cart\Actions;

use App\Domains\Cart\Models\CartItem;

class RemoveFromCart
{
  public function handle(CartItem $item): void
  {
    $item->delete();
  }
}
