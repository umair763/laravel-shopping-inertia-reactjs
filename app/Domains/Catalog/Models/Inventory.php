<?php

namespace App\Domains\Catalog\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

#[Fillable([
  'variant_id',
  'available_quantity',
  'reserved_quantity',
  'low_stock_threshold',
])]
class Inventory extends Model
{
  use HasFactory;
}
