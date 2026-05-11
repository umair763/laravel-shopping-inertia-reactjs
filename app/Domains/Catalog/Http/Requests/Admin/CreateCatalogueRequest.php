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
      'description' => 'nullable|string',
      'icon' => 'nullable|image|mimes:jpg,jpeg,png,webp,gif,svg|max:8192',
      'cover_image' => 'nullable|image|mimes:jpg,jpeg,png,webp,gif,svg|max:8192',
      'is_featured' => 'nullable|boolean',
      'sort_order' => 'nullable|integer',
      'status' => 'nullable|string|max:50',
    ];
  }
}

