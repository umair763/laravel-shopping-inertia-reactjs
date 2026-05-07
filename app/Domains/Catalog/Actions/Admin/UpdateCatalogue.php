<?php

namespace App\Domains\Catalog\Actions\Admin;

use App\Domains\Catalog\Models\Catalogue;

class UpdateCatalogue
{
  public function handle(Catalogue $catalogue, array $data): Catalogue
  {
    $catalogue->update($data);
    return $catalogue;
  }
}

