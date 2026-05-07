<?php

namespace App\Domains\Cart\Models;

use App\Domains\Catalog\Models\Product;
use App\Domains\Catalog\Models\ProductVariant;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

#[Fillable([
  'cart_id',
  'product_id',
  'variant_id',
  'quantity',
  'unit_price',
])]
class CartItem extends Model
{
  use HasFactory, HasUuids;

  public $incrementing = false;

  protected $keyType = 'string';

  public function cart(): BelongsTo
  {
    return $this->belongsTo(Cart::class);
  }

  public function product(): BelongsTo
  {
    return $this->belongsTo(Product::class);
  }

  public function variant(): BelongsTo
  {
    return $this->belongsTo(ProductVariant::class, 'variant_id');
  }

  const UPDATED_AT = null;

  const CREATED_AT = 'created_at';
}
