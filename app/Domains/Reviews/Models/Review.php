<?php

namespace App\Domains\Reviews\Models;

use App\Domains\Account\Models\User;
use App\Domains\Catalog\Models\Product;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

#[Fillable([
  'user_id',
  'product_id',
  'rating',
  'title',
  'comment',
])]
class Review extends Model
{
  use HasFactory, HasUuids;

  public $incrementing = false;

  protected $keyType = 'string';

  const UPDATED_AT = null;

  const CREATED_AT = 'created_at';

  public function user(): BelongsTo
  {
    return $this->belongsTo(User::class);
  }

  public function product(): BelongsTo
  {
    return $this->belongsTo(Product::class);
  }
}
