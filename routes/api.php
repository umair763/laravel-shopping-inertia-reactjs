<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\OrderController;
use App\Http\Controllers\AdminProductController;
use App\Http\Controllers\AdminDashboardController;
use App\Http\Controllers\AuthController;

/*
|--------------------------------------------------------------------------
| API ROUTES (JSON RESPONSES - NO CSRF PROTECTION)
|--------------------------------------------------------------------------
*/

Route::middleware(['api'])->group(function () {

  // Authentication API (Public - No CSRF needed)
  Route::post('/register', [AuthController::class, 'register'])->name('api.auth.register');
  Route::post('/login', [AuthController::class, 'login'])->name('api.auth.login');
  Route::post('/logout', [AuthController::class, 'logout'])->name('api.auth.logout');
  Route::get('/user', [AuthController::class, 'user'])->name('api.auth.user');

  // Admin creation (Admin only) - Auth check handled in controller
  Route::post('/admin/create', [AuthController::class, 'createAdmin'])->name('api.admin.create');

  // Public API
  Route::get('/products', [ProductController::class, 'apiIndex'])->name('api.products.index');
  Route::get('/products/{product}', [ProductController::class, 'apiShow'])->name('api.products.show');

  // Authenticated API
  Route::middleware('auth:api')->group(function () {
    Route::post('/orders', [OrderController::class, 'apiStore'])->name('api.orders.store');
    Route::get('/orders', [OrderController::class, 'apiIndex'])->name('api.orders.index');
  });

  // Admin API
  Route::middleware(['auth:api', 'is_admin'])->group(function () {
    Route::post('/products', [AdminProductController::class, 'apiStore'])->name('api.products.store');
    Route::put('/products/{product}', [AdminProductController::class, 'apiUpdate'])->name('api.products.update');
    Route::delete('/products/{product}', [AdminProductController::class, 'apiDestroy'])->name('api.products.destroy');
    Route::get('/dashboard/stats', [AdminDashboardController::class, 'apiStats'])->name('api.dashboard.stats');
  });

});
