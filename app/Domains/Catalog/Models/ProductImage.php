<?php

namespace App\Domains\Catalog\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

#[Fillable([
  'variant_id',
  'image_url',
  'is_primary',
  'sort_order',
])]
class ProductImage extends Model
{
  use HasFactory, HasUuids;

  public $incrementing = false;

  protected $keyType = 'string';

  const UPDATED_AT = null;

  const CREATED_AT = 'created_at';
}
