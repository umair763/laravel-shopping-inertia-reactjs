<?php

namespace App\Domains\Catalog\Actions\Admin;

use App\Domains\Catalog\Models\Catalogue;
use App\Domains\Shared\Services\ImageUploadService;
use App\Domains\Shared\Services\SlugGenerator;
use Illuminate\Http\UploadedFile;

class CreateCatalogue
{
  public function __construct(
    private SlugGenerator $slugs,
    private ImageUploadService $images,
  ) {
  }

  public function handle(array $data): Catalogue
  {
    $payload = [
      'name' => $data['name'],
      'slug' => $this->slugs->generate($data['name'], Catalogue::class),
      'description' => $data['description'] ?? null,
      'is_featured' => $data['is_featured'] ?? false,
      'sort_order' => $data['sort_order'] ?? 0,
      'status' => $data['status'] ?? 'active',
    ];

    if (!empty($data['icon']) && $data['icon'] instanceof UploadedFile) {
      $payload['icon'] = $this->images->store($data['icon'], 'catalogues/icons');
    }
    if (!empty($data['cover_image']) && $data['cover_image'] instanceof UploadedFile) {
      $payload['cover_image'] = $this->images->store($data['cover_image'], 'catalogues/covers');
    }

    return Catalogue::create($payload);
  }
}

