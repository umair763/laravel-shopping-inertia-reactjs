<?php

namespace App\Domains\Account\Actions;

use App\Domains\Account\Models\User;

class UpdateProfile
{
  public function handle(User $user, array $data): User
  {
    $user->fill(array_filter([
      'first_name' => $data['first_name'] ?? null,
      'last_name' => $data['last_name'] ?? null,
      'username' => $data['username'] ?? null,
      'email' => $data['email'] ?? null,
      'phone' => $data['phone'] ?? null,
      'profile_image' => $data['profile_image'] ?? null,
    ], fn($value) => $value !== null));

    $user->save();

    return $user;
  }
}
