<?php

namespace App\Domains\Catalog\Http\Controllers;

use App\Domains\Catalog\Actions\GetActiveProduct;
use App\Domains\Catalog\Actions\ListActiveProducts;
use App\Domains\Catalog\Actions\PresentProductForStorefront;
use App\Domains\Catalog\Models\Product;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ProductController extends Controller
{
  /**
   * Display paginated products for user view
   */
  public function index(Request $request)
  {
    $products = app(ListActiveProducts::class)->handle([
      'category' => $request->get('category'),
      'search' => $request->get('search'),
    ], true, 12);

    $presenter = app(PresentProductForStorefront::class);
    $products->through(fn (Product $product) => $presenter->handle($product));

    return Inertia::render('User/Products', [
      'products' => $products,
      'filters' => [
        'category' => $request->get('category'),
        'search' => $request->get('search'),
      ]
    ]);
  }

  /**
   * Show single product detail page — loads reviews with eager-loaded user data
   */
  public function show(Product $product)
  {
    $loaded = app(GetActiveProduct::class)->handle($product);

    $reviews = $loaded->reviews()
      ->with('user:id,first_name,last_name,email')
      ->latest()
      ->get()
      ->map(fn ($review) => [
        'id' => $review->id,
        'rating' => $review->rating,
        'title' => $review->title,
        'comment' => $review->comment,
        'created_at' => $review->created_at,
        'user' => $review->user ? [
          'name' => trim(($review->user->first_name ?? '') . ' ' . ($review->user->last_name ?? '')) ?: null,
          'email' => $review->user->email,
        ] : null,
      ]);

    return Inertia::render('User/ViewProduct', [
      'product' => app(PresentProductForStorefront::class)->handle($loaded),
      'reviews' => $reviews,
    ]);
  }

  /**
   * API: Get all active products as JSON
   */
  public function apiIndex(Request $request)
  {
    $presenter = app(PresentProductForStorefront::class);
    $products = app(ListActiveProducts::class)->handle([
      'category' => $request->get('category'),
      'search' => $request->get('search'),
    ], false);

    return response()->json([
      'data' => $products->map(fn (Product $product) => $presenter->handle($product))->values(),
      'success' => true,
    ]);
  }

  /**
   * API: Get single product as JSON
   */
  public function apiShow(Product $product)
  {
    return response()->json([
      'data' => app(PresentProductForStorefront::class)->handle(app(GetActiveProduct::class)->handle($product)),
      'success' => true,
    ]);
  }
}
