<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

#[Fillable(['name', 'description', 'price', 'quantity', 'image_url', 'sku', 'category', 'is_active'])]
class Product extends Model
{
  use HasFactory;

  /**
   * Get the order items for this product
   */
  public function orderItems(): HasMany
  {
    return $this->hasMany(OrderItem::class);
  }

  /**
   * Check if product is in stock
   */
  public function isInStock(): bool
  {
    return $this->quantity > 0 && $this->is_active;
  }
}
