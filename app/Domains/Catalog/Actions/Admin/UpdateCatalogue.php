<?php

namespace App\Domains\Catalog\Actions\Admin;

use App\Domains\Catalog\Models\Catalogue;
use App\Domains\Shared\Services\ImageUploadService;
use App\Domains\Shared\Services\SlugGenerator;
use Illuminate\Http\UploadedFile;

class UpdateCatalogue
{
  public function __construct(
    private SlugGenerator $slugs,
    private ImageUploadService $images,
  ) {
  }

  public function handle(Catalogue $catalogue, array $data): Catalogue
  {
    $payload = [];

    foreach (['name', 'description', 'is_featured', 'sort_order', 'status'] as $key) {
      if (array_key_exists($key, $data)) {
        $payload[$key] = $data[$key];
      }
    }

    if (array_key_exists('name', $data) && $data['name'] !== $catalogue->name) {
      $payload['slug'] = $this->slugs->generate($data['name'], Catalogue::class, $catalogue->id);
    }

    foreach (['icon' => 'catalogues/icons', 'cover_image' => 'catalogues/covers'] as $field => $dir) {
      $removeKey = $field . '_remove';

      if (!empty($data[$removeKey])) {
        $this->images->deleteByUrl($catalogue->$field);
        $payload[$field] = null;
        continue;
      }

      if (!empty($data[$field]) && $data[$field] instanceof UploadedFile) {
        $this->images->deleteByUrl($catalogue->$field);
        $payload[$field] = $this->images->store($data[$field], $dir);
      }
    }

    $catalogue->update($payload);

    return $catalogue;
  }
}

