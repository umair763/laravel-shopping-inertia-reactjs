<?php

namespace App\Domains\Account\Actions;

use App\Domains\Account\Models\User;

class ClearApiToken
{
  public function handle(User $user): void
  {
    $user->forceFill(['api_token_hash' => null])->save();
  }
}

