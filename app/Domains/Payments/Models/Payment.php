<?php

namespace App\Domains\Payments\Models;

use App\Domains\Orders\Models\Order;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

#[Fillable([
  'order_id',
  'payment_method',
  'transaction_id',
  'amount',
  'payment_status',
  'paid_at',
])]
class Payment extends Model
{
  use HasFactory, HasUuids;

  public $incrementing = false;

  protected $keyType = 'string';

  const UPDATED_AT = null;

  const CREATED_AT = 'created_at';

  public function order(): BelongsTo
  {
    return $this->belongsTo(Order::class);
  }
}
