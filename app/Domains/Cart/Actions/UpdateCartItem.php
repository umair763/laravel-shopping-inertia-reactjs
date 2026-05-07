<?php

namespace App\Domains\Cart\Actions;

use App\Domains\Cart\Models\CartItem;

class UpdateCartItem
{
  public function handle(CartItem $item, int $quantity): CartItem
  {
    $item->forceFill(['quantity' => $quantity])->save();

    return $item;
  }
}
