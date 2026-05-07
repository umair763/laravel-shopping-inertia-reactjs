<?php

namespace App\Domains\Catalog\Actions\Admin;

use App\Domains\Catalog\Models\Product;

class DeleteProductAggregate
{
  public function handle(Product $product): void
  {
    $product->delete();
  }
}

