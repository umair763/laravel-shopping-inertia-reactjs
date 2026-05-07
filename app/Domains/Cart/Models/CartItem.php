<?php

namespace App\Domains\Cart\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

#[Fillable([
  'cart_id',
  'product_id',
  'variant_id',
  'quantity',
  'unit_price',
])]
class CartItem extends Model
{
  use HasFactory;
}
