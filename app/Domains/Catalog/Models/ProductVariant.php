<?php

namespace App\Domains\Catalog\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;

#[Fillable([
  'product_id',
  'name',
  'sku',
  'price',
  'discount_price',
  'stock_quantity',
  'weight',
  'barcode',
  'attributes',
  'status',
])]
class ProductVariant extends Model
{
  use HasFactory, HasUuids;

  public $incrementing = false;

  protected $keyType = 'string';

  public function product(): BelongsTo
  {
    return $this->belongsTo(Product::class);
  }

  public function images(): HasMany
  {
    return $this->hasMany(ProductImage::class, 'variant_id');
  }

  public function inventory(): HasOne
  {
    return $this->hasOne(Inventory::class, 'variant_id');
  }
}
