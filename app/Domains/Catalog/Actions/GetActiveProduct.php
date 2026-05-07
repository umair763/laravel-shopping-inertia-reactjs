<?php

namespace App\Domains\Catalog\Actions;

use App\Domains\Catalog\Models\Product;

class GetActiveProduct
{
  public function handle(Product $product): Product
  {
    if (!$product->isActive()) {
      abort(404);
    }

    return $product->load('variants.images', 'variants.inventory');
  }
}

