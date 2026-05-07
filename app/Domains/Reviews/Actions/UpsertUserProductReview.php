<?php

namespace App\Domains\Reviews\Actions;

use App\Domains\Reviews\Models\Review;

class UpsertUserProductReview
{
  public function handle(string $userId, string $productId, array $data): Review
  {
    return Review::updateOrCreate(
      ['user_id' => $userId, 'product_id' => $productId],
      $data + ['user_id' => $userId, 'product_id' => $productId]
    );
  }
}

