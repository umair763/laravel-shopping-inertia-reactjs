<?php

namespace App\Domains\Reviews\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class CreateReviewRequest extends FormRequest
{
  public function authorize(): bool
  {
    return (bool) $this->user();
  }

  public function rules(): array
  {
    return [
      'product_id' => 'required|exists:products,id',
      'rating' => 'required|integer|min:1|max:5',
      'title' => 'nullable|string|max:255',
      'comment' => 'nullable|string',
    ];
  }
}

