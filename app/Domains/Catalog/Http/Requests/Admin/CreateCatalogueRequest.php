<?php

namespace App\Domains\Catalog\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;

class CreateCatalogueRequest extends FormRequest
{
  public function authorize(): bool
  {
    return (bool) $this->user();
  }

  public function rules(): array
  {
    return [
      'name' => 'required|string|max:255',
      'slug' => 'required|string|max:255|unique:catalogues,slug',
      'description' => 'nullable|string',
      'icon' => 'nullable|string',
      'cover_image' => 'nullable|string',
      'is_featured' => 'nullable|boolean',
      'sort_order' => 'nullable|integer',
      'status' => 'nullable|string|max:50',
    ];
  }
}

