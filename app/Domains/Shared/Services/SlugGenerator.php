<?php

namespace App\Domains\Shared\Services;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class SlugGenerator
{
  /**
   * Generate a unique, SEO-friendly slug for the given model.
   * Appends -2, -3, ... until uniqueness is achieved on the given column.
   *
   * @param string $source        Raw value (e.g. product name)
   * @param string $modelClass    Fully qualified Eloquent model class
   * @param string|null $exceptId Ignore this primary key when checking uniqueness (for updates)
   * @param string $column        Column to enforce uniqueness on (default: slug)
   */
  public function generate(string $source, string $modelClass, ?string $exceptId = null, string $column = 'slug'): string
  {
    $base = Str::slug($source);

    if ($base === '') {
      $base = Str::lower(Str::random(8));
    }

    $candidate = $base;
    $suffix = 2;

    /** @var class-string<Model> $modelClass */
    while ($this->exists($modelClass, $column, $candidate, $exceptId)) {
      $candidate = $base . '-' . $suffix;
      $suffix++;
    }

    return $candidate;
  }

  private function exists(string $modelClass, string $column, string $value, ?string $exceptId): bool
  {
    $query = $modelClass::query()->where($column, $value);

    if ($exceptId !== null) {
      $query->where((new $modelClass)->getKeyName(), '!=', $exceptId);
    }

    return $query->exists();
  }
}
