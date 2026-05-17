<?php

namespace App\Domains\Settings\Services;

use App\Domains\Settings\Models\Setting;
use Illuminate\Support\Facades\Crypt;
use Illuminate\Support\Facades\Cache;

class SettingsRepository
{
  private const CACHE_KEY = 'settings:all';
  private const CACHE_TTL = 3600;

  /**
   * Get a single setting value. Dot notation is supported: "general.store_name".
   */
  public function get(string $dottedKey, mixed $default = null): mixed
  {
    [$group, $key] = $this->split($dottedKey);
    $all = $this->all();

    return $all[$group][$key] ?? $default;
  }

  public function getGroup(string $group): array
  {
    return $this->all()[$group] ?? [];
  }

  /**
   * Persist one setting. Supports dot notation: set("general.store_name", "AmazStore").
   * Pass $encrypted = true to encrypt the value at rest (recommended for API keys).
   */
  public function set(string $dottedKey, mixed $value, ?string $userId = null, bool $encrypted = false): Setting
  {
    [$group, $key] = $this->split($dottedKey);

    $payload = $encrypted ? Crypt::encryptString((string) $value) : $value;

    $setting = Setting::updateOrCreate(
      ['group' => $group, 'key' => $key],
      [
        'value' => ['v' => $payload],
        'is_encrypted' => $encrypted,
        'updated_by' => $userId,
      ],
    );

    Cache::forget(self::CACHE_KEY);

    return $setting;
  }

  /**
   * Bulk persist key->value pairs for a single group.
   * Existing keys outside this set are left untouched.
   */
  public function setGroup(string $group, array $values, ?string $userId = null, array $encryptedKeys = []): void
  {
    foreach ($values as $key => $value) {
      $this->set("{$group}.{$key}", $value, $userId, in_array($key, $encryptedKeys, true));
    }
  }

  /**
   * Return the entire settings map, structured as [group => [key => value]].
   * Decrypted on the fly for any encrypted entries.
   */
  public function all(): array
  {
    return Cache::remember(self::CACHE_KEY, self::CACHE_TTL, function () {
      $map = [];
      foreach (Setting::all() as $setting) {
        $raw = $setting->value['v'] ?? null;
        $map[$setting->group][$setting->key] = $setting->is_encrypted && is_string($raw)
          ? rescue(fn() => Crypt::decryptString($raw), null)
          : $raw;
      }
      return $map;
    });
  }

  public function flushCache(): void
  {
    Cache::forget(self::CACHE_KEY);
  }

  private function split(string $dottedKey): array
  {
    if (!str_contains($dottedKey, '.')) {
      return ['general', $dottedKey];
    }
    [$group, $key] = explode('.', $dottedKey, 2);
    return [$group, $key];
  }
}
