<?php

namespace App\Domains\Catalog\Actions\Admin;

use App\Domains\Catalog\Models\Category;

class CreateCategory
{
  public function handle(array $data): Category
  {
    return Category::create($data);
  }
}

