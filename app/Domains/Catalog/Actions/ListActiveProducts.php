<?php

namespace App\Domains\Catalog\Actions;

use App\Domains\Catalog\Models\Product;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\Collection;

class ListActiveProducts
{
  /**
   * @return LengthAwarePaginator|Collection<int, Product>
   */
  public function handle(array $filters, bool $paginate = true, int $perPage = 12)
  {
    $query = Product::query()
      ->where('status', 'active')
      ->whereHas('variants') // Only show products with variants
      ->orderBy('created_at', 'desc');

    if (!empty($filters['category'])) {
      $query->where('category_id', $filters['category']);
    }

    if (!empty($filters['search'])) {
      $search = $filters['search'];
      $query->where(function ($q) use ($search) {
        $q->where('name', 'like', '%' . $search . '%')
          ->orWhere('short_description', 'like', '%' . $search . '%')
          ->orWhere('description', 'like', '%' . $search . '%');
      });
    }

    return $paginate
      ? $query->with(['category', 'variants.images', 'variants.inventory'])->paginate($perPage)
      : $query->with(['category', 'variants.images', 'variants.inventory'])->get();
  }
}

