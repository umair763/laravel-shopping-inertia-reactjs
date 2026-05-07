<?php

namespace App\Domains\Catalog\Actions\Admin;

use App\Domains\Catalog\Models\Catalogue;

class CreateCatalogue
{
  public function handle(array $data): Catalogue
  {
    return Catalogue::create($data);
  }
}

