<?php

namespace App\Domains\Audit\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

#[Fillable([
  'user_id',
  'action',
  'entity_type',
  'entity_id',
  'old_values',
  'new_values',
  'ip_address',
  'user_agent',
  'request_method',
  'request_url',
  'status',
])]
class AuditLog extends Model
{
  use HasFactory;
}
