<?php

namespace App\Domains\Cart\Models;

use App\Domains\Account\Models\User;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

#[Fillable([
  'user_id',
  'status',
  'total_items',
  'total_amount',
  'expires_at',
])]
class Cart extends Model
{
  use HasFactory, HasUuids;

  public $incrementing = false;

  protected $keyType = 'string';

  public function user(): BelongsTo
  {
    return $this->belongsTo(User::class);
  }

  public function items(): HasMany
  {
    return $this->hasMany(CartItem::class);
  }
}
