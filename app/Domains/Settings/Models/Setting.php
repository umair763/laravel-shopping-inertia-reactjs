<?php

namespace App\Domains\Settings\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

#[Fillable(['group', 'key', 'value', 'is_encrypted', 'updated_by'])]
class Setting extends Model
{
  use HasFactory, HasUuids;

  protected $table = 'settings';
  public $incrementing = false;
  protected $keyType = 'string';

  protected $casts = [
    'value' => 'array',
    'is_encrypted' => 'boolean',
  ];
}
