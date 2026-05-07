<?php

namespace App\Domains\Cart\Actions;

use App\Domains\Cart\Models\Cart;

class RecalculateCartTotals
{
  public function handle(Cart $cart): Cart
  {
    $cart->loadMissing('items.variant.inventory');

    $totalItems = 0;
    $totalAmount = 0;

    foreach ($cart->items as $item) {
      $totalItems += (int) $item->quantity;
      $totalAmount += ((float) $item->unit_price) * (int) $item->quantity;
    }

    $cart->forceFill([
      'total_items' => $totalItems,
      'total_amount' => $totalAmount,
    ])->save();

    return $cart;
  }
}

