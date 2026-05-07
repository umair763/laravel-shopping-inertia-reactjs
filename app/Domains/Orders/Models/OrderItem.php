<?php

namespace App\Domains\Orders\Models;

use App\Domains\Catalog\Models\Product;
use App\Domains\Catalog\Models\ProductVariant;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

#[Fillable(['order_id', 'product_id', 'quantity', 'unit_price', 'total_price'])]
class OrderItem extends Model
{
  use HasFactory, HasUuids;

  public $incrementing = false;

  protected $keyType = 'string';

  /**
   * Get the order this item belongs to
   */
  public function order(): BelongsTo
  {
    return $this->belongsTo(Order::class);
  }

  /**
   * Get the product for this item
   */
  public function product(): BelongsTo
  {
    return $this->belongsTo(Product::class);
  }

  public function variant(): BelongsTo
  {
    return $this->belongsTo(ProductVariant::class, 'variant_id');
  }
}
