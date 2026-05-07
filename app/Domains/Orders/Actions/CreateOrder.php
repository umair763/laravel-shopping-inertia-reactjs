<?php

namespace App\Domains\Orders\Actions;

use App\Domains\Account\Models\UserAddress;
use App\Domains\Catalog\Models\Product;
use App\Domains\Catalog\Models\ProductVariant;
use App\Domains\Orders\Models\Order;
use Illuminate\Support\Carbon;
use Illuminate\Support\Str;

class CreateOrder
{
  public function handle(array $data): Order
  {
    $shippingAddressId = $data['shipping_address_id'] ?? null;

    if (!$shippingAddressId && !empty($data['shipping_address'])) {
      $address = UserAddress::create([
        'user_id' => $data['user_id'],
        'type' => 'shipping',
        'address_line_1' => (string) $data['shipping_address'],
        'is_default' => false,
      ]);
      $shippingAddressId = $address->id;
    }

    if (!$shippingAddressId) {
      abort(422, 'shipping_address_id is required.');
    }

    $order = new Order([
      'user_id' => $data['user_id'],
      'order_number' => $this->generateOrderNumber(),
      'subtotal_amount' => 0,
      'tax_amount' => 0,
      'shipping_amount' => 0,
      'discount_amount' => 0,
      'total_amount' => 0,
      'payment_status' => 'pending',
      'order_status' => 'pending',
      'shipping_address_id' => $shippingAddressId,
      'placed_at' => Carbon::now(),
    ]);

    $order->save();

    $subtotal = 0;

    foreach ($data['items'] as $item) {
      $product = Product::findOrFail($item['product_id']);
      $variant = null;

      if (!empty($item['variant_id'])) {
        $variant = ProductVariant::where('product_id', $product->id)->findOrFail($item['variant_id']);
      } else {
        $variant = ProductVariant::where('product_id', $product->id)->orderBy('created_at', 'asc')->first();
      }

      if (!$variant) {
        abort(422, "No purchasable variant found for {$product->name}");
      }

      if ($variant->stock_quantity < $item['quantity']) {
        abort(422, "Insufficient stock for {$product->name}");
      }

      $unitPrice = $variant->discount_price ?? $variant->price;
      $lineTotal = $unitPrice * $item['quantity'];
      $subtotal += $lineTotal;

      $variant->decrement('stock_quantity', $item['quantity']);

      $order->items()->create([
        'product_id' => $product->id,
        'variant_id' => $variant->id,
        'quantity' => $item['quantity'],
        'unit_price' => $unitPrice,
        'total_price' => $lineTotal,
      ]);
    }

    $order->forceFill([
      'subtotal_amount' => $subtotal,
      'total_amount' => $subtotal,
    ])->save();

    return $order->load('items.product', 'items.variant');
  }

  private function generateOrderNumber(): string
  {
    return 'ORD-' . strtoupper(Str::random(10));
  }
}
