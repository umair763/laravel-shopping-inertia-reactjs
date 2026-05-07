<?php

namespace App\Domains\Catalog\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;

class CreateCategoryRequest extends FormRequest
{
  public function authorize(): bool
  {
    return (bool) $this->user();
  }

  public function rules(): array
  {
    return [
      'catalogue_id' => 'nullable|exists:catalogues,id',
      'parent_category_id' => 'nullable|exists:categories,id',
      'name' => 'required|string|max:255',
      'slug' => 'required|string|max:255|unique:categories,slug',
      'description' => 'nullable|string',
      'image' => 'nullable|string',
    ];
  }
}

