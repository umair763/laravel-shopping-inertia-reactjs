<?php

namespace App\Domains\Payments\Http\Controllers;

use App\Domains\Orders\Models\Order;
use App\Domains\Payments\Actions\CreatePaymentForOrder;
use App\Domains\Payments\Actions\ProcessPayment;
use App\Domains\Payments\Http\Requests\CreatePaymentRequest;
use App\Domains\Payments\Http\Requests\ProcessPaymentRequest;
use App\Domains\Payments\Models\Payment;
use App\Http\Controllers\Controller;

class PaymentController extends Controller
{
  public function store(CreatePaymentRequest $request)
  {
    $validated = $request->validated();
    $order = Order::findOrFail($validated['order_id']);

    if ($order->user_id !== $request->user()->id) {
      abort(403);
    }

    $payment = app(CreatePaymentForOrder::class)->handle($order, [
      'payment_method' => $validated['payment_method'] ?? null,
    ]);

    return response()->json([
      'data' => $payment,
      'success' => true,
    ], 201);
  }

  public function process(ProcessPaymentRequest $request, Payment $payment)
  {
    if ($payment->order?->user_id !== $request->user()->id) {
      abort(403);
    }

    $validated = $request->validated();
    $payment = app(ProcessPayment::class)->handle(
      $payment,
      $validated['status'],
      $validated['transaction_id'] ?? null
    );

    return response()->json([
      'data' => $payment->load('order'),
      'success' => true,
    ]);
  }
}

