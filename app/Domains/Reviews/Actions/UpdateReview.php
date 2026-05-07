<?php

namespace App\Domains\Reviews\Actions;

use App\Domains\Reviews\Models\Review;

class UpdateReview
{
  public function handle(Review $review, array $data): Review
  {
    $review->update($data);

    return $review;
  }
}
