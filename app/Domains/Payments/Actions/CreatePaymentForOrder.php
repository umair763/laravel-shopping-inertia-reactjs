<?php

namespace App\Domains\Payments\Actions;

use App\Domains\Orders\Models\Order;
use App\Domains\Payments\Models\Payment;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class CreatePaymentForOrder
{
  public function handle(Order $order, array $data = []): Payment
  {
    return DB::transaction(function () use ($order, $data) {
      return Payment::create([
        'order_id' => $order->id,
        'payment_method' => $data['payment_method'] ?? null,
        'transaction_id' => $data['transaction_id'] ?? null,
        'amount' => $data['amount'] ?? $order->total_amount,
        'payment_status' => $data['payment_status'] ?? 'pending',
        'paid_at' => null,
      ]);
    });
  }
}

