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
      'description' => 'sometimes|nullable|string',
      'icon' => 'sometimes|nullable|image|mimes:jpg,jpeg,png,webp,gif,svg|max:8192',
      'cover_image' => 'sometimes|nullable|image|mimes:jpg,jpeg,png,webp,gif,svg|max:8192',
      'icon_remove' => 'sometimes|boolean',
      'cover_image_remove' => 'sometimes|boolean',
      'is_featured' => 'sometimes|nullable|boolean',
      'sort_order' => 'sometimes|nullable|integer',
      'status' => 'sometimes|nullable|string|max:50',
    ];
  }
}

