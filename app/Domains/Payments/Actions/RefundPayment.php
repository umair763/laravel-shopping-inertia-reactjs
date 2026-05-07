<?php

namespace App\Domains\Payments\Actions;

use App\Domains\Payments\Models\Payment;

class RefundPayment
{
  public function handle(Payment $payment, ?string $transactionId = null): Payment
  {
    return app(ProcessPayment::class)->handle($payment, 'refunded', $transactionId);
  }
}
