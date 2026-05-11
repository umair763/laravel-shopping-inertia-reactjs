<?php

namespace App\Domains\Catalog\Http\Controllers\Admin;

use App\Domains\Catalog\Actions\Admin\CreateCategory;
use App\Domains\Catalog\Actions\Admin\DeleteCategory;
use App\Domains\Catalog\Actions\Admin\UpdateCategory;
use App\Domains\Catalog\Http\Requests\Admin\CreateCategoryRequest;
use App\Domains\Catalog\Http\Requests\Admin\UpdateCategoryRequest;
use App\Domains\Catalog\Models\Catalogue;
use App\Domains\Catalog\Models\Category;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;

class CategoryAdminController extends Controller
{
  public function index()
  {
    return Inertia::render('Admin/Categories', [
      'categories' => Category::with('catalogue:id,name')->orderBy('name')->get(),
      'catalogues' => Catalogue::orderBy('name')->get(['id', 'name']),
    ]);
  }

  public function create(Request $request)
  {
    return Inertia::render('Admin/CategoryForm', [
      'category' => null,
      'catalogues' => Catalogue::orderBy('name')->get(['id', 'name']),
      'categories' => Category::orderBy('name')->get(['id', 'name', 'catalogue_id']),
      'preselected_catalogue_id' => $request->get('catalogue_id'),
    ]);
  }

  public function edit(Category $category)
  {
    return Inertia::render('Admin/CategoryForm', [
      'category' => $category,
      'catalogues' => Catalogue::orderBy('name')->get(['id', 'name']),
      'categories' => Category::where('id', '!=', $category->id)->orderBy('name')->get(['id', 'name', 'catalogue_id']),
    ]);
  }

  public function store(CreateCategoryRequest $request)
  {
    $category = app(CreateCategory::class)->handle($request->validated());

    if ($request->expectsJson()) {
      return response()->json(['data' => $category, 'success' => true], 201);
    }

    return redirect()->route('admin.categories.index')->with('success', 'Category created.');
  }

  public function update(UpdateCategoryRequest $request, Category $category)
  {
    $category = app(UpdateCategory::class)->handle($category, $request->validated());

    if ($request->expectsJson()) {
      return response()->json(['data' => $category, 'success' => true]);
    }

    return redirect()->route('admin.categories.index')->with('success', 'Category updated.');
  }

  public function destroy(Request $request, Category $category)
  {
    app(DeleteCategory::class)->handle($category);

    if ($request->expectsJson()) {
      return response()->json(['success' => true]);
    }

    return redirect()->route('admin.categories.index')->with('success', 'Category deleted.');
  }
}

