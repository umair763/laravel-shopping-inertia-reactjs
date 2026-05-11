<?php

namespace App\Domains\Catalog\Actions;

use App\Domains\Catalog\Models\Product;
use Illuminate\Support\Arr;

class PresentProductForStorefront
{
  public function handle(Product $product): array
  {
    $variant = $product->variants->first();
    $inventory = $variant?->inventory;
    $primaryImage = $variant?->images?->firstWhere('is_primary', true) ?? $variant?->images?->sortBy('sort_order')->first();

    return [
      'id' => $product->id,
      'slug' => $product->slug,
      'name' => $product->name,
      'short_description' => $product->short_description,
      'description' => $product->description,
      'brand' => $product->brand,
      'category' => $product->category?->slug,
      'category_name' => $product->category?->name,
      'sku' => $product->sku,
      'variant_id' => $variant?->id,
      'price' => $variant?->price,
      'discount_price' => $variant?->discount_price,
      'effective_price' => $variant?->discount_price ?? $variant?->price,
      'quantity' => $inventory?->available_quantity ?? $variant?->stock_quantity ?? 0,
      'image_url' => $primaryImage?->image_url,
      'created_at' => $product->created_at,
      'status' => $product->status,
    ];
  }
}

