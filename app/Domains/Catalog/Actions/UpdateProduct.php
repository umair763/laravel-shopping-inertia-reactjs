<?php

namespace App\Domains\Catalog\Actions;

use App\Domains\Catalog\Models\Product;

class UpdateProduct
{
  public function handle(Product $product, array $data): Product
  {
    $product->update($data);

    return $product;
  }
}
