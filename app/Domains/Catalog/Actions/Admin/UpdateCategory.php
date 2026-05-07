<?php

namespace App\Domains\Catalog\Actions\Admin;

use App\Domains\Catalog\Models\Category;

class UpdateCategory
{
  public function handle(Category $category, array $data): Category
  {
    $category->update($data);
    return $category;
  }
}

