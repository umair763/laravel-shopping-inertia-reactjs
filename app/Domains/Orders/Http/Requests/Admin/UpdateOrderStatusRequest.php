<?php

namespace App\Domains\Orders\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;

class UpdateOrderStatusRequest extends FormRequest
{
  public function authorize(): bool
  {
    return (bool) $this->user();
  }

  public function rules(): array
  {
    return [
      'order_status' => 'required|in:pending,processing,shipped,delivered,cancelled,returned',
    ];
  }
}

