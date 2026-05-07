<?php

namespace App\Domains\Catalog\Http\Controllers\Admin;

use App\Domains\Catalog\Actions\Admin\CreateCatalogue;
use App\Domains\Catalog\Actions\Admin\DeleteCatalogue;
use App\Domains\Catalog\Actions\Admin\UpdateCatalogue;
use App\Domains\Catalog\Http\Requests\Admin\CreateCatalogueRequest;
use App\Domains\Catalog\Http\Requests\Admin\UpdateCatalogueRequest;
use App\Domains\Catalog\Models\Catalogue;
use App\Http\Controllers\Controller;

class CatalogueAdminController extends Controller
{
  public function store(CreateCatalogueRequest $request)
  {
    $catalogue = app(CreateCatalogue::class)->handle($request->validated());

    return response()->json(['data' => $catalogue, 'success' => true], 201);
  }

  public function update(UpdateCatalogueRequest $request, Catalogue $catalogue)
  {
    $catalogue = app(UpdateCatalogue::class)->handle($catalogue, $request->validated());

    return response()->json(['data' => $catalogue, 'success' => true]);
  }

  public function destroy(Catalogue $catalogue)
  {
    app(DeleteCatalogue::class)->handle($catalogue);

    return response()->json(['success' => true]);
  }
}

