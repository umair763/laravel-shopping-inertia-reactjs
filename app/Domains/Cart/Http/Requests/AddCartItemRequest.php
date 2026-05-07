<?php

namespace App\Domains\Cart\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class AddCartItemRequest extends FormRequest
{
  public function authorize(): bool
  {
    return (bool) $this->user();
  }

  public function rules(): array
  {
    return [
      'variant_id' => 'required|exists:product_variants,id',
      'quantity' => 'required|integer|min:1',
    ];
  }
}

