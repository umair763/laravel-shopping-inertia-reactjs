<?php

namespace App\Domains\Orders\Models;

use App\Domains\Account\Models\User;
use App\Domains\Account\Models\UserAddress;
use App\Domains\Payments\Models\Payment;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;

#[Fillable([
  'user_id',
  'order_number',
  'subtotal_amount',
  'tax_amount',
  'shipping_amount',
  'discount_amount',
  'total_amount',
  'payment_status',
  'order_status',
  'shipping_address_id',
  'placed_at',
])]
class Order extends Model
{
  use HasFactory, HasUuids;

  public $incrementing = false;

  protected $keyType = 'string';

  /**
   * Get the user that owns this order
   */
  public function user(): BelongsTo
  {
    return $this->belongsTo(User::class);
  }

  public function shippingAddress(): BelongsTo
  {
    return $this->belongsTo(UserAddress::class, 'shipping_address_id');
  }

  /**
   * Get the order items for this order
   */
  public function items(): HasMany
  {
    return $this->hasMany(OrderItem::class);
  }

  public function payment(): HasOne
  {
    return $this->hasOne(Payment::class);
  }

  /**
   * Calculate total from items
   */
  public function calculateTotal(): float
  {
    return $this->items->sum('total_price');
  }
}
