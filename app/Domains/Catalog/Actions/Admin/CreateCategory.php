<?php

namespace App\Domains\Catalog\Actions\Admin;

use App\Domains\Catalog\Models\Category;
use App\Domains\Shared\Services\ImageUploadService;
use App\Domains\Shared\Services\SlugGenerator;
use Illuminate\Http\UploadedFile;

class CreateCategory
{
  public function __construct(
    private SlugGenerator $slugs,
    private ImageUploadService $images,
  ) {
  }

  public function handle(array $data): Category
  {
    $payload = [
      'catalogue_id' => $data['catalogue_id'] ?? null,
      'parent_category_id' => $data['parent_category_id'] ?? null,
      'name' => $data['name'],
      'slug' => $this->slugs->generate($data['name'], Category::class),
      'description' => $data['description'] ?? null,
    ];

    if (!empty($data['image']) && $data['image'] instanceof UploadedFile) {
      $payload['image'] = $this->images->store($data['image'], 'categories');
    }

    return Category::create($payload);
  }
}

