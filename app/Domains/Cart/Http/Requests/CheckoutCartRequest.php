<?php

namespace App\Domains\Cart\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class CheckoutCartRequest extends FormRequest
{
  public function authorize(): bool
  {
    return (bool) $this->user();
  }

  public function rules(): array
  {
    return [
      'shipping_address_id' => 'required|exists:user_addresses,id',
    ];
  }
}

