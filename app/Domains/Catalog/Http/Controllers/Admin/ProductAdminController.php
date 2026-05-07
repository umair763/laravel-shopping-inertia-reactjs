<?php

namespace App\Domains\Catalog\Http\Controllers\Admin;

use App\Domains\Catalog\Actions\Admin\CreateProductAggregate;
use App\Domains\Catalog\Actions\Admin\DeleteProductAggregate;
use App\Domains\Catalog\Actions\Admin\UpdateProductAggregate;
use App\Domains\Catalog\Http\Requests\Admin\CreateProductRequest;
use App\Domains\Catalog\Http\Requests\Admin\UpdateProductRequest;
use App\Domains\Catalog\Models\Product;
use App\Http\Controllers\Controller;

class ProductAdminController extends Controller
{
  public function store(CreateProductRequest $request)
  {
    $product = app(CreateProductAggregate::class)->handle($request->validated());

    return response()->json([
      'data' => $product,
      'success' => true,
    ], 201);
  }

  public function update(UpdateProductRequest $request, Product $product)
  {
    $product = app(UpdateProductAggregate::class)->handle($product, $request->validated());

    return response()->json([
      'data' => $product,
      'success' => true,
    ]);
  }

  public function destroy(Product $product)
  {
    app(DeleteProductAggregate::class)->handle($product);

    return response()->json([
      'success' => true,
    ]);
  }
}

