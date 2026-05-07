<?php

namespace App\Domains\Catalog\Actions\Admin;

use App\Domains\Catalog\Models\Category;

class DeleteCategory
{
  public function handle(Category $category): void
  {
    $category->delete();
  }
}

