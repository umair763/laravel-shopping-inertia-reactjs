<?php

namespace App\Domains\Reviews\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateReviewRequest extends FormRequest
{
  public function authorize(): bool
  {
    return (bool) $this->user();
  }

  public function rules(): array
  {
    return [
      'rating' => 'sometimes|integer|min:1|max:5',
      'title' => 'sometimes|nullable|string|max:255',
      'comment' => 'sometimes|nullable|string',
    ];
  }
}

