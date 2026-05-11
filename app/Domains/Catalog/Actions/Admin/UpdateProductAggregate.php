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

class UpdateProductAggregate
{
  public function __construct(
    private SlugGenerator $slugs,
    private ImageUploadService $images,
  ) {
  }

  public function handle(Product $product, array $data): Product
  {
    return DB::transaction(function () use ($product, $data) {
      $payload = [];
      foreach ([
        'catalogue_id',
        'category_id',
        'name',
        'short_description',
        'description',
        'brand',
        'sku',
        'status',
        'is_featured',
        'seo_title',
        'seo_description',
      ] as $key) {
        if (array_key_exists($key, $data)) {
          $payload[$key] = $data[$key];
        }
      }

      if (array_key_exists('name', $data) && $data['name'] !== $product->name) {
        $payload['slug'] = $this->slugs->generate($data['name'], Product::class, $product->id);
      }

      $product->update($payload);

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
          $this->reconcileImages($variant, $data['images']);
        }
      }

      return $product->refresh()->load('variants.images', 'variants.inventory', 'category', 'catalogue');
    });
  }

  /**
   * Replace the variant's image set with the submitted list.
   * Each row is either an uploaded image_file (new) or an existing_url (retain).
   * Previously stored URLs that aren't retained are deleted from disk.
   */
  private function reconcileImages(ProductVariant $variant, array $rows): void
  {
    $retainUrls = [];
    foreach ($rows as $row) {
      $existing = trim((string) ($row['existing_url'] ?? ''));
      if ($existing !== '') {
        $retainUrls[] = $existing;
      }
    }

    // Delete previous rows whose URL is not retained; also remove their files.
    foreach (ProductImage::where('variant_id', $variant->id)->get() as $old) {
      if (!in_array($old->image_url, $retainUrls, true)) {
        $this->images->deleteByUrl($old->image_url);
        $old->delete();
      }
    }

    // Re-create the desired set in the submitted order.
    ProductImage::where('variant_id', $variant->id)->delete();

    foreach ($rows as $idx => $row) {
      $url = null;
      if (!empty($row['image_file']) && $row['image_file'] instanceof UploadedFile) {
        $url = $this->images->store($row['image_file'], 'products');
      } elseif (!empty($row['existing_url'])) {
        $url = $row['existing_url'];
      }

      if (!$url) {
        continue;
      }

      ProductImage::create([
        'variant_id' => $variant->id,
        'image_url' => $url,
        'is_primary' => (bool) ($row['is_primary'] ?? ($idx === 0)),
        'sort_order' => (int) ($row['sort_order'] ?? $idx),
      ]);
    }
  }
}

