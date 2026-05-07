<?php

namespace App\Domains\Catalog\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;

class UpdateCategoryRequest extends FormRequest
{
  public function authorize(): bool
  {
    return (bool) $this->user();
  }

  public function rules(): array
  {
    return [
      'catalogue_id' => 'sometimes|nullable|exists:catalogues,id',
      'parent_category_id' => 'sometimes|nullable|exists:categories,id',
      'name' => 'sometimes|string|max:255',
      'slug' => 'sometimes|string|max:255',
      'description' => 'sometimes|nullable|string',
      'image' => 'sometimes|nullable|string',
    ];
  }
}

