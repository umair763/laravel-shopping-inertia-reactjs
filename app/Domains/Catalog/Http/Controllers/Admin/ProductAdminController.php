<?php

namespace App\Domains\Catalog\Http\Controllers\Admin;

use App\Domains\Catalog\Actions\Admin\CreateProductAggregate;
use App\Domains\Catalog\Actions\Admin\DeleteProductAggregate;
use App\Domains\Catalog\Actions\Admin\UpdateProductAggregate;
use App\Domains\Catalog\Http\Requests\Admin\CreateProductRequest;
use App\Domains\Catalog\Http\Requests\Admin\UpdateProductRequest;
use App\Domains\Catalog\Models\Catalogue;
use App\Domains\Catalog\Models\Category;
use App\Domains\Catalog\Models\Product;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ProductAdminController extends Controller
{
  public function index()
  {
    $products = Product::with([
      'catalogue:id,name',
      'category:id,name',
      'variants.images',
      'variants.inventory',
    ])->orderBy('created_at', 'desc')->paginate(20);

    return Inertia::render('Admin/Products', [
      'products' => $products,
    ]);
  }

  public function create()
  {
    return Inertia::render('Admin/ProductForm', [
      'product' => null,
      'catalogues' => Catalogue::orderBy('name')->get(['id', 'name']),
      'categories' => Category::orderBy('name')->get(['id', 'name', 'catalogue_id']),
    ]);
  }

  public function edit(Product $product)
  {
    $product->load(['variants.images', 'variants.inventory', 'catalogue:id,name', 'category:id,name']);

    return Inertia::render('Admin/ProductForm', [
      'product' => $product,
      'catalogues' => Catalogue::orderBy('name')->get(['id', 'name']),
      'categories' => Category::orderBy('name')->get(['id', 'name', 'catalogue_id']),
    ]);
  }

  public function store(CreateProductRequest $request)
  {
    $product = app(CreateProductAggregate::class)->handle($request->validated());

    if ($request->expectsJson()) {
      return response()->json(['data' => $product, 'success' => true], 201);
    }

    return redirect()->route('admin.products.index')->with('success', 'Product created.');
  }

  public function update(UpdateProductRequest $request, Product $product)
  {
    $product = app(UpdateProductAggregate::class)->handle($product, $request->validated());

    if ($request->expectsJson()) {
      return response()->json(['data' => $product, 'success' => true]);
    }

    return redirect()->route('admin.products.index')->with('success', 'Product updated.');
  }

  public function destroy(Request $request, Product $product)
  {
    app(DeleteProductAggregate::class)->handle($product);

    if ($request->expectsJson()) {
      return response()->json(['success' => true]);
    }

    return redirect()->route('admin.products.index')->with('success', 'Product deleted.');
  }
}

