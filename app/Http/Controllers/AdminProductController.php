<?php

namespace App\Http\Controllers;

use App\Models\Product;
use Illuminate\Http\Request;
use Inertia\Inertia;

class AdminProductController extends Controller
{
  /**
   * Display all products for admin
   */
  public function index(Request $request)
  {
    $products = Product::orderBy('created_at', 'desc')
      ->paginate(20);

    return Inertia::render('Admin/Products', [
      'products' => $products,
      'filters' => [
        'status' => $request->get('status'),
        'category' => $request->get('category'),
      ]
    ]);
  }

  /**
   * Show product creation form
   */
  public function create()
  {
    return Inertia::render('Admin/AddProduct', [
      'categories' => ['electronics', 'fashion', 'home', 'sports', 'books', 'general'],
    ]);
  }

  /**
   * Store a new product
   */
  public function store(Request $request)
  {
    $validated = $request->validate([
      'name' => 'required|string|min:3|max:255',
      'description' => 'required|string|min:10',
      'price' => 'required|numeric|min:0.01',
      'quantity' => 'required|integer|min:0',
      'sku' => 'required|string|unique:products,sku',
      'category' => 'required|string|in:electronics,fashion,home,sports,books,general',
      'image_url' => 'nullable|url',
      'is_active' => 'boolean',
    ]);

    $product = Product::create($validated);

    return redirect()->route('admin.products.index')
      ->with('success', 'Product created successfully');
  }

  /**
   * Show product edit form
   */
  public function edit(Product $product)
  {
    return Inertia::render('Admin/UpdateProduct', [
      'product' => $product,
      'categories' => ['electronics', 'fashion', 'home', 'sports', 'books', 'general'],
    ]);
  }

  /**
   * Update a product
   */
  public function update(Request $request, Product $product)
  {
    $validated = $request->validate([
      'name' => 'required|string|min:3|max:255',
      'description' => 'required|string|min:10',
      'price' => 'required|numeric|min:0.01',
      'quantity' => 'required|integer|min:0',
      'sku' => 'required|string|unique:products,sku,' . $product->id,
      'category' => 'required|string|in:electronics,fashion,home,sports,books,general',
      'image_url' => 'nullable|url',
      'is_active' => 'boolean',
    ]);

    $product->update($validated);

    return redirect()->route('admin.products.index')
      ->with('success', 'Product updated successfully');
  }

  /**
   * Delete a product
   */
  public function destroy(Product $product)
  {
    $product->delete();

    return redirect()->route('admin.products.index')
      ->with('success', 'Product deleted successfully');
  }

  /**
   * API: Create product via JSON
   */
  public function apiStore(Request $request)
  {
    $validated = $request->validate([
      'name' => 'required|string|min:3|max:255',
      'description' => 'required|string|min:10',
      'price' => 'required|numeric|min:0.01',
      'quantity' => 'required|integer|min:0',
      'sku' => 'required|string|unique:products,sku',
      'category' => 'required|string|in:electronics,fashion,home,sports,books,general',
      'image_url' => 'nullable|url',
      'is_active' => 'boolean',
    ]);

    $product = Product::create($validated);

    return response()->json([
      'message' => 'Product created successfully',
      'data' => $product,
      'success' => true,
    ], 201);
  }

  /**
   * API: Update product via JSON
   */
  public function apiUpdate(Request $request, Product $product)
  {
    $validated = $request->validate([
      'name' => 'string|min:3|max:255',
      'description' => 'string|min:10',
      'price' => 'numeric|min:0.01',
      'quantity' => 'integer|min:0',
      'sku' => 'string|unique:products,sku,' . $product->id,
      'category' => 'string|in:electronics,fashion,home,sports,books,general',
      'image_url' => 'nullable|url',
      'is_active' => 'boolean',
    ]);

    $product->update($validated);

    return response()->json([
      'message' => 'Product updated successfully',
      'data' => $product,
      'success' => true,
    ]);
  }

  /**
   * API: Delete product via JSON
   */
  public function apiDestroy(Product $product)
  {
    $product->delete();

    return response()->json([
      'message' => 'Product deleted successfully',
      'success' => true,
    ]);
  }
}
