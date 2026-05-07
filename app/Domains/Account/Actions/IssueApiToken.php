<?php

namespace App\Domains\Account\Actions;

use App\Domains\Account\Models\User;
use Illuminate\Support\Str;

class IssueApiToken
{
  public function handle(User $user): string
  {
    $plainToken = Str::random(64);

    $user->forceFill([
      'api_token_hash' => hash('sha256', $plainToken),
    ])->save();

    return $plainToken;
  }
}

