<?php

namespace App\Domains\Catalog\Http\Controllers\Admin;

use App\Domains\Catalog\Actions\Admin\CreateCatalogue;
use App\Domains\Catalog\Actions\Admin\DeleteCatalogue;
use App\Domains\Catalog\Actions\Admin\UpdateCatalogue;
use App\Domains\Catalog\Http\Requests\Admin\CreateCatalogueRequest;
use App\Domains\Catalog\Http\Requests\Admin\UpdateCatalogueRequest;
use App\Domains\Catalog\Models\Catalogue;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;

class CatalogueAdminController extends Controller
{
  public function index()
  {
    return Inertia::render('Admin/Catalogues', [
      'catalogues' => Catalogue::orderBy('sort_order')->orderBy('name')->get(),
    ]);
  }

  public function create()
  {
    return Inertia::render('Admin/CatalogueForm', [
      'catalogue' => null,
    ]);
  }

  public function edit(Catalogue $catalogue)
  {
    return Inertia::render('Admin/CatalogueForm', [
      'catalogue' => $catalogue,
    ]);
  }

  public function store(CreateCatalogueRequest $request)
  {
    $catalogue = app(CreateCatalogue::class)->handle($request->validated());

    if ($request->expectsJson()) {
      return response()->json(['data' => $catalogue, 'success' => true], 201);
    }

    return redirect()->route('admin.catalogues.index')->with('success', 'Catalogue created.');
  }

  public function update(UpdateCatalogueRequest $request, Catalogue $catalogue)
  {
    $catalogue = app(UpdateCatalogue::class)->handle($catalogue, $request->validated());

    if ($request->expectsJson()) {
      return response()->json(['data' => $catalogue, 'success' => true]);
    }

    return redirect()->route('admin.catalogues.index')->with('success', 'Catalogue updated.');
  }

  public function destroy(Request $request, Catalogue $catalogue)
  {
    app(DeleteCatalogue::class)->handle($catalogue);

    if ($request->expectsJson()) {
      return response()->json(['success' => true]);
    }

    return redirect()->route('admin.catalogues.index')->with('success', 'Catalogue deleted.');
  }
}

