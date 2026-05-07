<?php

namespace App\Domains\Catalog\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

#[Fillable([
  'product_id',
  'name',
  'sku',
  'price',
  'discount_price',
  'stock_quantity',
  'weight',
  'barcode',
  'attributes',
  'status',
])]
class ProductVariant extends Model
{
  use HasFactory;
}
