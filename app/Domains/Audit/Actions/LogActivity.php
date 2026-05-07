<?php

namespace App\Domains\Audit\Actions;

use App\Domains\Audit\Models\AuditLog;

class LogActivity
{
  public function handle(array $data): void
  {
    AuditLog::create([
      'user_id' => $data['user_id'] ?? null,
      'action' => $data['action'],
      'entity_type' => $data['entity_type'],
      'entity_id' => $data['entity_id'] ?? null,
      'old_values' => $data['old_values'] ?? null,
      'new_values' => $data['new_values'] ?? null,
      'ip_address' => $data['ip_address'] ?? null,
      'user_agent' => $data['user_agent'] ?? null,
      'request_method' => $data['request_method'] ?? null,
      'request_url' => $data['request_url'] ?? null,
      'status' => $data['status'] ?? null,
    ]);
  }
}
