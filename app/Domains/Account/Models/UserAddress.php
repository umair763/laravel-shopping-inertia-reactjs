<?php

namespace App\Domains\Account\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

#[Fillable([
  'user_id',
  'type',
  'country',
  'state',
  'city',
  'postal_code',
  'address_line_1',
  'address_line_2',
  'is_default',
])]
class UserAddress extends Model
{
  use HasFactory, HasUuids;

  public $incrementing = false;

  protected $keyType = 'string';

  const UPDATED_AT = null;

  const CREATED_AT = 'created_at';
}
