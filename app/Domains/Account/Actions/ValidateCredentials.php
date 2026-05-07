<?php

namespace App\Domains\Account\Actions;

use App\Domains\Account\Models\User;
use Illuminate\Support\Facades\Hash;

class ValidateCredentials
{
  public function handle(string $email, string $password, string $role): ?User
  {
    $user = User::where('email', $email)->first();

    if (!$user) {
      return null;
    }

    if (!Hash::check($password, $user->password_hash)) {
      return null;
    }

    if ($user->role !== $role) {
      return null;
    }

    return $user;
  }
}

