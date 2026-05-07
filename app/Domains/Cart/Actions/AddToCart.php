<?php

namespace App\Domains\Cart\Actions;

use App\Domains\Cart\Models\CartItem;
use App\Domains\Catalog\Models\ProductVariant;
use Illuminate\Support\Facades\DB;

class AddToCart
{
  public function handle(array $data): CartItem
  {
    return DB::transaction(function () use ($data) {
      $variant = ProductVariant::findOrFail($data['variant_id']);

      $unitPrice = $variant->discount_price ?? $variant->price;

      $item = CartItem::where('cart_id', $data['cart_id'])
        ->where('variant_id', $variant->id)
        ->first();

      if ($item) {
        $item->increment('quantity', $data['quantity']);
        $item->forceFill(['unit_price' => $unitPrice])->save();
      } else {
        $item = CartItem::create([
          'cart_id' => $data['cart_id'],
          'product_id' => $variant->product_id,
          'variant_id' => $variant->id,
          'quantity' => $data['quantity'],
          'unit_price' => $unitPrice,
        ]);
      }

      return $item;
    });
  }
}
