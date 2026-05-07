<?php

namespace App\Domains\Catalog\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
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
  use HasFactory, HasUuids;

  protected $table = 'inventory';

  public $incrementing = false;

  protected $keyType = 'string';

  const UPDATED_AT = 'updated_at';

  const CREATED_AT = null;
}
