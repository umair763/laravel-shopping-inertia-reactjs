<?php

namespace App\Domains\Catalog\Actions\Admin;

use App\Domains\Catalog\Models\Category;
use App\Domains\Shared\Services\ImageUploadService;
use App\Domains\Shared\Services\SlugGenerator;
use Illuminate\Http\UploadedFile;

class UpdateCategory
{
  public function __construct(
    private SlugGenerator $slugs,
    private ImageUploadService $images,
  ) {
  }

  public function handle(Category $category, array $data): Category
  {
    $payload = [];

    foreach (['catalogue_id', 'parent_category_id', 'name', 'description'] as $key) {
      if (array_key_exists($key, $data)) {
        $payload[$key] = $data[$key];
      }
    }

    if (array_key_exists('name', $data) && $data['name'] !== $category->name) {
      $payload['slug'] = $this->slugs->generate($data['name'], Category::class, $category->id);
    }

    if (!empty($data['image_remove'])) {
      $this->images->deleteByUrl($category->image);
      $payload['image'] = null;
    } elseif (!empty($data['image']) && $data['image'] instanceof UploadedFile) {
      $this->images->deleteByUrl($category->image);
      $payload['image'] = $this->images->store($data['image'], 'categories');
    }

    $category->update($payload);

    return $category;
  }
}

