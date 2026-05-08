<?php

namespace App\Domains\Catalog\Actions\Admin;

use App\Domains\Catalog\Models\Inventory;
use App\Domains\Catalog\Models\Product;
use App\Domains\Catalog\Models\ProductImage;
use App\Domains\Catalog\Models\ProductVariant;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;

class UpdateProductAggregate
{
  public function handle(Product $product, array $data): Product
  {
    return DB::transaction(function () use ($product, $data) {
      $product->update(array_filter([
        'catalogue_id' => $data['catalogue_id'] ?? null,
        'category_id' => $data['category_id'] ?? null,
        'name' => $data['name'] ?? null,
        'slug' => $data['slug'] ?? null,
        'short_description' => $data['short_description'] ?? null,
        'description' => $data['description'] ?? null,
        'brand' => $data['brand'] ?? null,
        'sku' => $data['sku'] ?? null,
        'status' => $data['status'] ?? null,
        'is_featured' => $data['is_featured'] ?? null,
        'seo_title' => $data['seo_title'] ?? null,
        'seo_description' => $data['seo_description'] ?? null,
      ], fn($v) => $v !== null));

      if (!empty($data['variant'])) {
        /** @var ProductVariant $variant */
        $variant = $product->variants()->firstOrFail();
        $variant->update(array_filter([
          'name' => $data['variant']['name'] ?? null,
          'sku' => $data['variant']['sku'] ?? null,
          'price' => $data['variant']['price'] ?? null,
          'discount_price' => $data['variant']['discount_price'] ?? null,
          'stock_quantity' => $data['variant']['stock_quantity'] ?? null,
          'weight' => $data['variant']['weight'] ?? null,
          'barcode' => $data['variant']['barcode'] ?? null,
          'attributes' => $data['variant']['attributes'] ?? null,
          'status' => $data['variant']['status'] ?? null,
        ], fn($v) => $v !== null));

        if (!empty($data['inventory'])) {
          $inventory = $variant->inventory ?: Inventory::create(['variant_id' => $variant->id]);
          $inventory->update(array_filter([
            'available_quantity' => $data['inventory']['available_quantity'] ?? null,
            'reserved_quantity' => $data['inventory']['reserved_quantity'] ?? null,
            'low_stock_threshold' => $data['inventory']['low_stock_threshold'] ?? null,
          ], fn($v) => $v !== null));
        }

        if (array_key_exists('images', $data) && is_array($data['images'])) {
          ProductImage::where('variant_id', $variant->id)->delete();
          foreach ($data['images'] as $idx => $img) {
            $imageUrl = $this->resolveImageUrl($img);

            if (!$imageUrl) {
              continue;
            }

            ProductImage::create([
              'variant_id' => $variant->id,
              'image_url' => $imageUrl,
              'is_primary' => (bool) ($img['is_primary'] ?? ($idx === 0)),
              'sort_order' => (int) ($img['sort_order'] ?? $idx),
            ]);
          }
        }
      }

      return $product->refresh()->load('variants.images', 'variants.inventory', 'category', 'catalogue');
    });
  }

  private function resolveImageUrl(array $image): ?string
  {
    if (!empty($image['image_file']) && $image['image_file'] instanceof UploadedFile) {
      $path = $image['image_file']->storePublicly('products', 'public');

      return Storage::disk('public')->url($path);
    }

    $imageUrl = trim((string) ($image['image_url'] ?? ''));

    return $imageUrl !== '' ? $imageUrl : null;
  }
}

