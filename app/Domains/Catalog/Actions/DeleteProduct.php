<?php

namespace App\Domains\Catalog\Actions;

use App\Domains\Catalog\Models\Product;

class DeleteProduct
{
  public function handle(Product $product): void
  {
    $product->delete();
  }
}

