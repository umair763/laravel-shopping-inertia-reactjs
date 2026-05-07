<?php

namespace App\Domains\Payments\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

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
  use HasFactory;
}
