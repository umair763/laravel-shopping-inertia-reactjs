<?php

namespace App\Domains\Cart\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

#[Fillable([
  'user_id',
  'status',
  'total_items',
  'total_amount',
  'expires_at',
])]
class Cart extends Model
{
  use HasFactory;
}
