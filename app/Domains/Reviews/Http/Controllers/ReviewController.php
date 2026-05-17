<?php

namespace App\Domains\Reviews\Http\Controllers;

use App\Domains\Audit\Actions\LogActivity;
use App\Domains\Reviews\Actions\UpsertUserProductReview;
use App\Domains\Reviews\Actions\UpdateReview;
use App\Domains\Reviews\Http\Requests\CreateReviewRequest;
use App\Domains\Reviews\Http\Requests\UpdateReviewRequest;
use App\Domains\Reviews\Models\Review;
use App\Http\Controllers\Controller;

class ReviewController extends Controller
{
  public function store(CreateReviewRequest $request)
  {
    $validated = $request->validated();

    $review = app(UpsertUserProductReview::class)->handle(
      $request->user()->id,
      $validated['product_id'],
      [
        'rating' => $validated['rating'],
        'title' => $validated['title'] ?? null,
        'comment' => $validated['comment'] ?? null,
      ]
    );

    app(LogActivity::class)->handle([
      'user_id' => $request->user()->id,
      'action' => 'review_upserted',
      'entity_type' => 'review',
      'entity_id' => $review->id,
      'new_values' => [
        'product_id' => $review->product_id,
        'rating' => $review->rating,
      ],
      'status' => 'success',
    ]);

    return response()->json([
      'data' => $review,
      'success' => true,
    ], 201);
  }

  public function update(UpdateReviewRequest $request, Review $review)
  {
    if ($review->user_id !== $request->user()->id) {
      abort(403);
    }

    $validated = $request->validated();
    $review = app(UpdateReview::class)->handle($review, $validated);

    return response()->json([
      'data' => $review,
      'success' => true,
    ]);
  }

  public function destroy(Review $review)
  {
    if ($review->user_id !== auth()->id()) {
      abort(403);
    }

    $review->delete();

    return response()->json(['success' => true], 200);
  }
}

