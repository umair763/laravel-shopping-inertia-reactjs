<?php

use Illuminate\Support\Facades\Route;
use App\Domains\Catalog\Http\Controllers\ProductController;
use App\Domains\Orders\Http\Controllers\OrderController;
use App\Domains\Catalog\Http\Controllers\AdminProductController;
use App\Domains\Orders\Http\Controllers\AdminDashboardController;
use App\Domains\Account\Http\Controllers\AuthController;

/*
|--------------------------------------------------------------------------
| API ROUTES (JSON RESPONSES - NO CSRF PROTECTION)
|--------------------------------------------------------------------------
*/

Route::middleware(['api', 'force.json'])->group(function () {

  // Authentication API for Postman / external clients
  Route::post('/register', [AuthController::class, 'register'])->name('api.auth.register');
  Route::post('/login', [AuthController::class, 'login'])->name('api.auth.login');
  Route::post('/admin/login', [AuthController::class, 'adminLogin'])->name('api.auth.admin.login');
  Route::post('/logout', [AuthController::class, 'logout'])->name('api.auth.logout');
  Route::get('/user', [AuthController::class, 'user'])->middleware('api.token')->name('api.auth.user');

  // Admin creation supports first bootstrap and authenticated admin provisioning
  Route::post('/admin/create', [AuthController::class, 'createAdmin'])->name('api.admin.create');

  // Public API
  Route::get('/products', [ProductController::class, 'apiIndex'])->name('api.products.index');
  Route::get('/products/{product}', [ProductController::class, 'apiShow'])->name('api.products.show');

  // Authenticated API
  Route::middleware(['api.token'])->group(function () {
    Route::post('/orders', [OrderController::class, 'apiStore'])->name('api.orders.store');
    Route::get('/orders', [OrderController::class, 'apiIndex'])->name('api.orders.index');
  });

  // Admin API
  Route::middleware(['api.token', 'is_admin'])->group(function () {
    Route::post('/products', [AdminProductController::class, 'apiStore'])->name('api.products.store');
    Route::put('/products/{product}', [AdminProductController::class, 'apiUpdate'])->name('api.products.update');
    Route::delete('/products/{product}', [AdminProductController::class, 'apiDestroy'])->name('api.products.destroy');
    Route::get('/dashboard/stats', [AdminDashboardController::class, 'apiStats'])->name('api.dashboard.stats');
  });

});
