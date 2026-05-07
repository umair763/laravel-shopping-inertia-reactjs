<?php

namespace App\Domains\Payments\Actions;

use App\Domains\Payments\Models\Payment;
use App\Domains\Audit\Actions\LogActivity;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\DB;

class ProcessPayment
{
  public function handle(Payment $payment, string $status, ?string $transactionId = null): Payment
  {
    if (!in_array($status, ['pending', 'paid', 'failed', 'refunded'], true)) {
      abort(422, 'Invalid payment status.');
    }

    return DB::transaction(function () use ($payment, $status, $transactionId) {
      $payment->forceFill([
        'payment_status' => $status,
        'transaction_id' => $transactionId ?? $payment->transaction_id,
        'paid_at' => $status === 'paid' ? Carbon::now() : $payment->paid_at,
      ])->save();

      $order = $payment->order()->first();

      if ($order) {
        $order->forceFill([
          'payment_status' => $status,
          'order_status' => $status === 'paid' && $order->order_status === 'pending'
            ? 'processing'
            : $order->order_status,
        ])->save();
      }

      app(LogActivity::class)->handle([
        'user_id' => $order?->user_id,
        'action' => 'payment_status_updated',
        'entity_type' => 'payment',
        'entity_id' => $payment->id,
        'new_values' => [
          'payment_status' => $status,
          'transaction_id' => $payment->transaction_id,
        ],
        'status' => 'success',
      ]);

      return $payment->refresh();
    });
  }
}
