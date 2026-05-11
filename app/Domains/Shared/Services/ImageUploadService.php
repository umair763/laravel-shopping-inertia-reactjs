<?php

namespace App\Domains\Shared\Services;

use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class ImageUploadService
{
  /**
   * Default constraints for uploaded images.
   * Enforced again at the FormRequest layer for defense in depth.
   */
  public const ALLOWED_MIMES = ['jpg', 'jpeg', 'png', 'webp', 'gif', 'svg'];
  public const MAX_KILOBYTES = 8192; // 8 MB

  /**
   * Persist an uploaded image on the public disk and return its public URL.
   *
   * @param UploadedFile $file
   * @param string $directory Subdirectory under the public disk (e.g. "catalogues", "products", "avatars")
   */
  public function store(UploadedFile $file, string $directory): string
  {
    $directory = trim($directory, '/');
    $filename = Str::lower(Str::random(20)) . '.' . $file->getClientOriginalExtension();
    $path = $file->storeAs($directory, $filename, 'public');

    return Storage::disk('public')->url($path);
  }

  /**
   * Delete an image previously stored by store() given its public URL.
   * Safe to call with null / external URLs (does nothing in that case).
   */
  public function deleteByUrl(?string $url): void
  {
    if (!$url) {
      return;
    }

    $publicBase = Storage::disk('public')->url('');
    if (!str_starts_with($url, $publicBase)) {
      return; // Not a file we own — ignore.
    }

    $relativePath = ltrim(substr($url, strlen($publicBase)), '/');

    if ($relativePath !== '' && Storage::disk('public')->exists($relativePath)) {
      Storage::disk('public')->delete($relativePath);
    }
  }
}
