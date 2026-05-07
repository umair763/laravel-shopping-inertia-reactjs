<?php

namespace App\Domains\Payments\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class CreatePaymentRequest extends FormRequest
{
  public function authorize(): bool
  {
    return (bool) $this->user();
  }

  public function rules(): array
  {
    return [
      'order_id' => 'required|exists:orders,id',
      'payment_method' => 'nullable|string|max:50',
    ];
  }
}

