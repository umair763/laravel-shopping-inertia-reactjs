<?php

namespace App\Domains\Cart\Actions;

use App\Domains\Account\Models\User;
use App\Domains\Cart\Models\Cart;

class GetOrCreateActiveCart
{
  public function handle(User $user): Cart
  {
    $cart = Cart::where('user_id', $user->id)
      ->where('status', 'active')
      ->first();

    if ($cart) {
      return $cart;
    }

    return Cart::create([
      'user_id' => $user->id,
      'status' => 'active',
      'total_items' => 0,
      'total_amount' => 0,
    ]);
  }
}

