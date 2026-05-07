<?php

namespace App\Domains\Catalog\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;

class CreateProductRequest extends FormRequest
{
  public function authorize(): bool
  {
    return (bool) $this->user();
  }

  public function rules(): array
  {
    return [
      'catalogue_id' => 'nullable|exists:catalogues,id',
      'category_id' => 'nullable|exists:categories,id',
      'name' => 'required|string|max:255',
      'slug' => 'required|string|max:255|unique:products,slug',
      'short_description' => 'nullable|string',
      'description' => 'nullable|string',
      'brand' => 'nullable|string|max:255',
      'sku' => 'required|string|max:100|unique:products,sku',
      'status' => 'nullable|string|max:50',
      'is_featured' => 'nullable|boolean',
      'seo_title' => 'nullable|string',
      'seo_description' => 'nullable|string',

      'variant' => 'required|array',
      'variant.name' => 'nullable|string|max:255',
      'variant.sku' => 'required|string|max:100|unique:product_variants,sku',
      'variant.price' => 'required|numeric|min:0',
      'variant.discount_price' => 'nullable|numeric|min:0',
      'variant.stock_quantity' => 'nullable|integer|min:0',
      'variant.weight' => 'nullable|numeric|min:0',
      'variant.barcode' => 'nullable|string|max:255',
      'variant.attributes' => 'nullable|array',
      'variant.status' => 'nullable|string|max:50',

      'inventory' => 'nullable|array',
      'inventory.available_quantity' => 'nullable|integer|min:0',
      'inventory.reserved_quantity' => 'nullable|integer|min:0',
      'inventory.low_stock_threshold' => 'nullable|integer|min:0',

      'images' => 'nullable|array',
      'images.*.image_url' => 'required_with:images|url',
      'images.*.is_primary' => 'nullable|boolean',
      'images.*.sort_order' => 'nullable|integer|min:0',
    ];
  }
}

