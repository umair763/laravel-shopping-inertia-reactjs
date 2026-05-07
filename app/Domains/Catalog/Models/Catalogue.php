<?php

namespace App\Domains\Catalog\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

#[Fillable([
  'name',
  'slug',
  'description',
  'icon',
  'cover_image',
  'is_featured',
  'sort_order',
  'status',
])]
class Catalogue extends Model
{
  use HasFactory;
}
