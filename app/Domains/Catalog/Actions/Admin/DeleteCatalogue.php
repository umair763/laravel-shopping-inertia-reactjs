<?php

namespace App\Domains\Catalog\Actions\Admin;

use App\Domains\Catalog\Models\Catalogue;

class DeleteCatalogue
{
  public function handle(Catalogue $catalogue): void
  {
    $catalogue->delete();
  }
}

