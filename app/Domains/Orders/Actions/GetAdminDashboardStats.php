<?php

namespace App\Domains\Orders\Actions;

use App\Domains\Account\Models\User;
use App\Domains\Catalog\Models\Product;
use App\Domains\Orders\Models\Order;

class GetAdminDashboardStats
{
  public function handle(): array
  {
    return [
      'total_products' => Product::count(),
      'active_products' => Product::where('status', 'active')->count(),
      'total_users' => User::where('role', 'customer')->count(),
      'total_orders' => Order::count(),
      'total_revenue' => Order::where('order_status', 'delivered')->sum('total_amount'),
      'pending_orders' => Order::where('order_status', 'pending')->count(),
      'recent_orders' => Order::with('user')
        ->orderBy('created_at', 'desc')
        ->limit(10)
        ->get(),
    ];
  }
}

