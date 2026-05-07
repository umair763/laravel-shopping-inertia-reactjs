<?php

namespace App\Domains\Account\Actions\Admin;

use App\Domains\Account\Models\User;
use Illuminate\Database\Eloquent\Collection;

class ListUsers
{
  /**
   * @return Collection<int, User>
   */
  public function handle(?string $role = null): Collection
  {
    $query = User::query()->orderBy('created_at', 'desc');

    if ($role) {
      $query->where('role', $role);
    }

    return $query->get();
  }
}

