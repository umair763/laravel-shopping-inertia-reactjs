<?php

namespace App\Domains\Reviews\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

#[Fillable([
  'user_id',
  'product_id',
  'rating',
  'title',
  'comment',
])]
class Review extends Model
{
  use HasFactory;
}
