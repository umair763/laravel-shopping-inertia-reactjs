<?php

namespace App\Domains\Catalog\Http\Controllers;

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
    $products = Product::where('is_active', true)
      ->orderBy('created_at', 'desc')
      ->paginate(12);

    return Inertia::render('User/Products', [
      'products' => $products,
      'filters' => [
        'category' => $request->get('category'),
        'search' => $request->get('search'),
      ]
    ]);
  }

  /**
   * Show single product detail page
   */
  public function show(Product $product)
  {
    if (!$product->is_active) {
      abort(404);
    }

    return Inertia::render('User/ViewProduct', [
      'product' => $product->load('orderItems'),
    ]);
  }

  /**
   * API: Get all active products as JSON
   */
  public function apiIndex(Request $request)
  {
    $query = Product::where('is_active', true);

    if ($request->get('category')) {
      $query->where('category', $request->get('category'));
    }

    if ($request->get('search')) {
      $query->where('name', 'like', '%' . $request->get('search') . '%')
        ->orWhere('description', 'like', '%' . $request->get('search') . '%');
    }

    return response()->json([
      'data' => $query->orderBy('created_at', 'desc')->get(),
      'success' => true,
    ]);
  }

  /**
   * API: Get single product as JSON
   */
  public function apiShow(Product $product)
  {
    if (!$product->is_active) {
      return response()->json(['message' => 'Product not found'], 404);
    }

    return response()->json([
      'data' => $product->load('orderItems'),
      'success' => true,
    ]);
  }
}
