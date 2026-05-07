<?php

namespace App\Domains\Payments\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class ProcessPaymentRequest extends FormRequest
{
  public function authorize(): bool
  {
    return (bool) $this->user();
  }

  public function rules(): array
  {
    return [
      'status' => 'required|in:pending,paid,failed,refunded',
      'transaction_id' => 'nullable|string|max:255',
    ];
  }
}

