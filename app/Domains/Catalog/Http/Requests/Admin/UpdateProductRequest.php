<?php

namespace App\Domains\Catalog\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;

class UpdateProductRequest extends FormRequest
{
  public function authorize(): bool
  {
    return (bool) $this->user();
  }

  public function rules(): array
  {
    return [
      'catalogue_id' => 'sometimes|nullable|exists:catalogues,id',
      'category_id' => 'sometimes|nullable|exists:categories,id',
      'name' => 'sometimes|string|max:255',
      'slug' => 'sometimes|string|max:255',
      'short_description' => 'sometimes|nullable|string',
      'description' => 'sometimes|nullable|string',
      'brand' => 'sometimes|nullable|string|max:255',
      'sku' => 'sometimes|string|max:100',
      'status' => 'sometimes|nullable|string|max:50',
      'is_featured' => 'sometimes|nullable|boolean',
      'seo_title' => 'sometimes|nullable|string',
      'seo_description' => 'sometimes|nullable|string',

      'variant' => 'sometimes|array',
      'variant.name' => 'sometimes|nullable|string|max:255',
      'variant.sku' => 'sometimes|string|max:100',
      'variant.price' => 'sometimes|numeric|min:0',
      'variant.discount_price' => 'sometimes|nullable|numeric|min:0',
      'variant.stock_quantity' => 'sometimes|integer|min:0',
      'variant.weight' => 'sometimes|nullable|numeric|min:0',
      'variant.barcode' => 'sometimes|nullable|string|max:255',
      'variant.attributes' => 'sometimes|nullable|array',
      'variant.status' => 'sometimes|nullable|string|max:50',

      'inventory' => 'sometimes|array',
      'inventory.available_quantity' => 'sometimes|integer|min:0',
      'inventory.reserved_quantity' => 'sometimes|integer|min:0',
      'inventory.low_stock_threshold' => 'sometimes|integer|min:0',

      'images' => 'sometimes|array',
      'images.*.image_url' => 'required_with:images|url',
      'images.*.is_primary' => 'sometimes|boolean',
      'images.*.sort_order' => 'sometimes|integer|min:0',
    ];
  }
}

