<?php

namespace App\Domains\Orders\Models;

use App\Domains\Account\Models\User;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

#[Fillable(['user_id', 'total_amount', 'status', 'shipping_address'])]
class Order extends Model
{
  use HasFactory;

  /**
   * Get the user that owns this order
   */
  public function user(): BelongsTo
  {
    return $this->belongsTo(User::class);
  }

  /**
   * Get the order items for this order
   */
  public function items(): HasMany
  {
    return $this->hasMany(OrderItem::class);
  }

  /**
   * Calculate total from items
   */
  public function calculateTotal(): float
  {
    return $this->items->sum('total_price');
  }
}
