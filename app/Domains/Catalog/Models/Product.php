<?php

namespace App\Domains\Catalog\Models;

use App\Domains\Orders\Models\OrderItem;
use App\Domains\Reviews\Models\Review;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

#[Fillable([
  'catalogue_id',
  'category_id',
  'name',
  'slug',
  'short_description',
  'description',
  'brand',
  'sku',
  'status',
  'is_featured',
  'seo_title',
  'seo_description',
])]
class Product extends Model
{
  use HasFactory, HasUuids;

  public $incrementing = false;

  protected $keyType = 'string';

  public function catalogue(): BelongsTo
  {
    return $this->belongsTo(Catalogue::class);
  }

  public function category(): BelongsTo
  {
    return $this->belongsTo(Category::class);
  }

  public function variants(): HasMany
  {
    return $this->hasMany(ProductVariant::class);
  }

  public function orderItems(): HasMany
  {
    return $this->hasMany(OrderItem::class);
  }

  public function reviews(): HasMany
  {
    return $this->hasMany(Review::class)->latest()->with('user:id,first_name,last_name,email');
  }

  public function isActive(): bool
  {
    return $this->status === 'active';
  }
}
