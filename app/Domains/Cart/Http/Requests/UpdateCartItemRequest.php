<?php

namespace App\Domains\Cart\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateCartItemRequest extends FormRequest
{
  public function authorize(): bool
  {
    return (bool) $this->user();
  }

  public function rules(): array
  {
    return [
      'quantity' => 'required|integer|min:1',
    ];
  }
}

