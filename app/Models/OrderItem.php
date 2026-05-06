<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

#[Fillable(['order_id', 'product_id', 'quantity', 'unit_price', 'total_price'])]
class OrderItem extends Model
{
  use HasFactory;

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
}
