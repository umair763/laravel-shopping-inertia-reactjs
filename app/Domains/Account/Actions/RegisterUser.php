<?php

namespace App\Domains\Account\Actions;

use App\Domains\Account\Models\User;
use Illuminate\Support\Facades\Hash;

class RegisterUser
{
  public function handle(array $data): User
  {
    $firstName = $data['first_name'] ?? null;
    $lastName = $data['last_name'] ?? null;

    if ((!$firstName || !$lastName) && !empty($data['name'])) {
      $parts = preg_split('/\s+/', trim((string) $data['name'])) ?: [];
      $firstName = $firstName ?: ($parts[0] ?? null);
      $lastName = $lastName ?: (count($parts) > 1 ? implode(' ', array_slice($parts, 1)) : null);
    }

    return User::create([
      'first_name' => $firstName,
      'last_name' => $lastName,
      'email' => $data['email'],
      'password_hash' => Hash::make($data['password']),
      'role' => $data['role'],
    ]);
  }
}

