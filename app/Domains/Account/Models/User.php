<?php

namespace App\Domains\Account\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use App\Domains\Orders\Models\Order;
use Database\Factories\UserFactory;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Attributes\Hidden;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

#[Fillable([
  'first_name',
  'last_name',
  'username',
  'email',
  'phone',
  'password_hash',
  'profile_image',
  'role',
  'status',
  'is_email_verified',
  'is_phone_verified',
  'last_login_at',
  'api_token_hash',
])]
#[Hidden(['password_hash', 'api_token_hash'])]
class User extends Authenticatable
{
  /** @use HasFactory<UserFactory> */
  use HasFactory, HasUuids, Notifiable;

  public $incrementing = false;

  protected $keyType = 'string';

  /**
   * Check if user is admin
   */
  public function isAdmin(): bool
  {
    return $this->role === 'admin';
  }

  public function getAuthPassword(): string
  {
    return (string) $this->password_hash;
  }

  /**
   * Get the orders for this user
   */
  public function orders(): HasMany
  {
    return $this->hasMany(Order::class);
  }

  protected static function newFactory(): UserFactory
  {
    return UserFactory::new();
  }

  /**
   * Get the attributes that should be cast.
   *
   * @return array<string, string>
   */
  protected function casts(): array
  {
    return [
      'is_email_verified' => 'boolean',
      'is_phone_verified' => 'boolean',
      'last_login_at' => 'datetime',
    ];
  }
}
