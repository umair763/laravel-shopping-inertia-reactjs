<?php

namespace App\Domains\Catalog\Actions\Admin;

use App\Domains\Catalog\Models\Inventory;
use App\Domains\Catalog\Models\Product;
use App\Domains\Catalog\Models\ProductImage;
use App\Domains\Catalog\Models\ProductVariant;
use App\Domains\Shared\Services\ImageUploadService;
use App\Domains\Shared\Services\SlugGenerator;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\DB;

class CreateProductAggregate
{
  public function __construct(
    private SlugGenerator $slugs,
    private ImageUploadService $images,
  ) {
  }

  public function handle(array $data): Product
  {
    return DB::transaction(function () use ($data) {
      $product = Product::create([
        'catalogue_id' => $data['catalogue_id'] ?? null,
        'category_id' => $data['category_id'] ?? null,
        'name' => $data['name'],
        'slug' => $this->slugs->generate($data['name'], Product::class),
        'short_description' => $data['short_description'] ?? null,
        'description' => $data['description'] ?? null,
        'brand' => $data['brand'] ?? null,
        'sku' => $data['sku'],
        'status' => $data['status'] ?? 'draft',
        'is_featured' => $data['is_featured'] ?? false,
        'seo_title' => $data['seo_title'] ?? null,
        'seo_description' => $data['seo_description'] ?? null,
      ]);

      $variant = ProductVariant::create([
        'product_id' => $product->id,
        'name' => $data['variant']['name'] ?? null,
        'sku' => $data['variant']['sku'],
        'price' => $data['variant']['price'],
        'discount_price' => $data['variant']['discount_price'] ?? null,
        'stock_quantity' => $data['variant']['stock_quantity'] ?? 0,
        'weight' => $data['variant']['weight'] ?? null,
        'barcode' => $data['variant']['barcode'] ?? null,
        'attributes' => $data['variant']['attributes'] ?? null,
        'status' => $data['variant']['status'] ?? 'active',
      ]);

      Inventory::create([
        'variant_id' => $variant->id,
        'available_quantity' => $data['inventory']['available_quantity'] ?? $variant->stock_quantity,
        'reserved_quantity' => $data['inventory']['reserved_quantity'] ?? 0,
        'low_stock_threshold' => $data['inventory']['low_stock_threshold'] ?? 5,
      ]);

      if (!empty($data['images']) && is_array($data['images'])) {
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

      return $product->load('variants.images', 'variants.inventory', 'category', 'catalogue');
    });
  }

  private function resolveImageUrl(array $image): ?string
  {
    if (!empty($image['image_file']) && $image['image_file'] instanceof UploadedFile) {
      return $this->images->store($image['image_file'], 'products');
    }

    return null;
  }
}

