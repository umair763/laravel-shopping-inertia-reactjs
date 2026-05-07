<?php

namespace App\Domains\Reviews\Actions;

use App\Domains\Reviews\Models\Review;

class CreateReview
{
  public function handle(array $data): Review
  {
    return Review::create($data);
  }
}
