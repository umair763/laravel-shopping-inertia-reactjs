<?php

namespace App\Domains\Catalog\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;

class UpdateCatalogueRequest extends FormRequest
{
  public function authorize(): bool
  {
    return (bool) $this->user();
  }

  public function rules(): array
  {
    return [
      'name' => 'sometimes|string|max:255',
      'slug' => 'sometimes|string|max:255',
      'description' => 'sometimes|nullable|string',
      'icon' => 'sometimes|nullable|string',
      'cover_image' => 'sometimes|nullable|string',
      'is_featured' => 'sometimes|nullable|boolean',
      'sort_order' => 'sometimes|nullable|integer',
      'status' => 'sometimes|nullable|string|max:50',
    ];
  }
}

