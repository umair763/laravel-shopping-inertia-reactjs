<?php

namespace App\Domains\Orders\Actions;

use App\Domains\Account\Models\User;
use App\Domains\Audit\Actions\LogActivity;
use App\Domains\Cart\Models\Cart;
use App\Domains\Orders\Models\Order;
use App\Domains\Payments\Actions\CreatePaymentForOrder;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class CreateOrderFromCart
{
  public function handle(User $user, Cart $cart, string $shippingAddressId): array
  {
    return DB::transaction(function () use ($user, $cart, $shippingAddressId) {
      $cart->loadMissing('items.variant');

      if ($cart->items->isEmpty()) {
        abort(422, 'Cart is empty.');
      }

      $order = Order::create([
        'user_id' => $user->id,
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

      $subtotal = 0;

      foreach ($cart->items as $item) {
        $variant = $item->variant;

        if (!$variant) {
          abort(422, 'Cart contains an invalid item.');
        }

        if ($variant->stock_quantity < $item->quantity) {
          abort(422, 'Insufficient stock for one or more items.');
        }

        $unitPrice = $variant->discount_price ?? $variant->price;
        $lineTotal = $unitPrice * $item->quantity;
        $subtotal += $lineTotal;

        $variant->decrement('stock_quantity', $item->quantity);

        $order->items()->create([
          'product_id' => $variant->product_id,
          'variant_id' => $variant->id,
          'quantity' => $item->quantity,
          'unit_price' => $unitPrice,
          'total_price' => $lineTotal,
        ]);
      }

      $order->forceFill([
        'subtotal_amount' => $subtotal,
        'total_amount' => $subtotal,
      ])->save();

      $payment = app(CreatePaymentForOrder::class)->handle($order, [
        'payment_method' => null,
      ]);

      $cart->forceFill(['status' => 'checked_out'])->save();
      $cart->items()->delete();
      $cart->forceFill(['total_items' => 0, 'total_amount' => 0])->save();

      app(LogActivity::class)->handle([
        'user_id' => $user->id,
        'action' => 'order_created_from_cart',
        'entity_type' => 'order',
        'entity_id' => $order->id,
        'new_values' => [
          'order_number' => $order->order_number,
          'total_amount' => $order->total_amount,
        ],
        'status' => 'success',
      ]);

      return [
        'order' => $order->load('items.product', 'items.variant'),
        'payment' => $payment,
      ];
    });
  }

  private function generateOrderNumber(): string
  {
    return 'ORD-' . strtoupper(Str::random(10));
  }
}

