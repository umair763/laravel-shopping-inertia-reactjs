<?php

namespace App\Domains\Catalog\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

#[Fillable([
  'catalogue_id',
  'parent_category_id',
  'name',
  'slug',
  'description',
  'image',
])]
class Category extends Model
{
  use HasFactory;
}
