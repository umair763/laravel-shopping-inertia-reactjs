<?php

namespace App\Domains\Catalog\Http\Controllers\Admin;

use App\Domains\Catalog\Actions\Admin\CreateCategory;
use App\Domains\Catalog\Actions\Admin\DeleteCategory;
use App\Domains\Catalog\Actions\Admin\UpdateCategory;
use App\Domains\Catalog\Http\Requests\Admin\CreateCategoryRequest;
use App\Domains\Catalog\Http\Requests\Admin\UpdateCategoryRequest;
use App\Domains\Catalog\Models\Category;
use App\Http\Controllers\Controller;

class CategoryAdminController extends Controller
{
  public function store(CreateCategoryRequest $request)
  {
    $category = app(CreateCategory::class)->handle($request->validated());

    return response()->json(['data' => $category, 'success' => true], 201);
  }

  public function update(UpdateCategoryRequest $request, Category $category)
  {
    $category = app(UpdateCategory::class)->handle($category, $request->validated());

    return response()->json(['data' => $category, 'success' => true]);
  }

  public function destroy(Category $category)
  {
    app(DeleteCategory::class)->handle($category);

    return response()->json(['success' => true]);
  }
}

