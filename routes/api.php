<?php

use Illuminate\Support\Facades\Route;
use App\Domains\Account\Http\Controllers\AuthController;
use App\Domains\Catalog\Http\Controllers\ProductController;
use App\Domains\Catalog\Http\Controllers\AdminProductController;
use App\Domains\Catalog\Http\Controllers\Admin\ProductAdminController;
use App\Domains\Catalog\Http\Controllers\Admin\CatalogueAdminController;
use App\Domains\Catalog\Http\Controllers\Admin\CategoryAdminController;
use App\Domains\Orders\Http\Controllers\OrderController;
use App\Domains\Orders\Http\Controllers\AdminDashboardController;
use App\Domains\Orders\Http\Controllers\Admin\OrderAdminController;
use App\Domains\Cart\Http\Controllers\CartController;
use App\Domains\Payments\Http\Controllers\PaymentController;
use App\Domains\Reviews\Http\Controllers\ReviewController;
use App\Domains\Account\Http\Controllers\Admin\UserAdminController;

/*
|--------------------------------------------------------------------------
| API ROUTES (JSON RESPONSES - NO CSRF PROTECTION)
|--------------------------------------------------------------------------
*/

Route::middleware(['api', 'force.json'])->group(function () {

  /*
  |--------------------------------------------------------------------------
  | Public API (no auth)
  |--------------------------------------------------------------------------
  */

  // Account
  Route::prefix('account')->group(function () {
    Route::post('/register', [AuthController::class, 'register'])->name('api.account.register');
    Route::post('/login', [AuthController::class, 'login'])->name('api.account.login');
    Route::post('/admin/login', [AuthController::class, 'adminLogin'])->name('api.account.admin.login');
    Route::post('/admin/register', [AuthController::class, 'createAdmin'])->name('api.account.admin.register');
    Route::post('/logout', [AuthController::class, 'logout'])->name('api.account.logout');
  });

  // Catalog
  Route::prefix('catalog')->group(function () {
    Route::get('/products', [ProductController::class, 'apiIndex'])->name('api.catalog.products.index');
    Route::get('/products/{product}', [ProductController::class, 'apiShow'])->name('api.catalog.products.show');
  });

  /*
  |--------------------------------------------------------------------------
  | Authenticated customer API
  |--------------------------------------------------------------------------
  */

  Route::middleware(['api.token'])->group(function () {
    // Account
    Route::prefix('account')->group(function () {
      Route::get('/profile', [AuthController::class, 'user'])->name('api.account.profile');
      Route::get('/user', [AuthController::class, 'user'])->name('api.account.user');
      Route::put('/profile', [AuthController::class, 'updateProfile'])->name('api.account.profile.update');
    });

    // Cart
    Route::prefix('cart')->group(function () {
      Route::get('/', [CartController::class, 'show'])->name('api.cart.show');
      Route::post('/items', [CartController::class, 'addItem'])->name('api.cart.items.add');
      Route::put('/items/{cartItem}', [CartController::class, 'updateItem'])->name('api.cart.items.update');
      Route::delete('/items/{cartItem}', [CartController::class, 'removeItem'])->name('api.cart.items.remove');
      Route::post('/checkout', [CartController::class, 'checkout'])->name('api.cart.checkout');
    });

    // Orders
    Route::prefix('orders')->group(function () {
      Route::get('/', [OrderController::class, 'apiIndex'])->name('api.orders.index');
      Route::post('/', [OrderController::class, 'apiStore'])->name('api.orders.store');
      Route::get('/{order}', [OrderController::class, 'apiShow'])->name('api.orders.show');
    });

    // Payments
    Route::prefix('payments')->group(function () {
      Route::post('/', [PaymentController::class, 'store'])->name('api.payments.store');
      Route::post('/{payment}/process', [PaymentController::class, 'process'])->name('api.payments.process');
    });

    // Reviews
    Route::prefix('reviews')->group(function () {
      Route::post('/', [ReviewController::class, 'store'])->name('api.reviews.store');
      Route::put('/{review}', [ReviewController::class, 'update'])->name('api.reviews.update');
    });
  });

  /*
  |--------------------------------------------------------------------------
  | Admin API
  |--------------------------------------------------------------------------
  */

  Route::middleware(['api.token', 'is_admin'])->prefix('admin')->group(function () {
    // Account admin
    Route::get('/users', [UserAdminController::class, 'index'])->name('api.admin.users.index');
    Route::post('/users', [UserAdminController::class, 'store'])->name('api.admin.users.store');

    // Catalog admin
    Route::post('/products', [ProductAdminController::class, 'store'])->name('api.admin.products.store');
    Route::put('/products/{product}', [ProductAdminController::class, 'update'])->name('api.admin.products.update');
    Route::delete('/products/{product}', [ProductAdminController::class, 'destroy'])->name('api.admin.products.destroy');

    Route::post('/catalogues', [CatalogueAdminController::class, 'store'])->name('api.admin.catalogues.store');
    Route::put('/catalogues/{catalogue}', [CatalogueAdminController::class, 'update'])->name('api.admin.catalogues.update');
    Route::delete('/catalogues/{catalogue}', [CatalogueAdminController::class, 'destroy'])->name('api.admin.catalogues.destroy');

    Route::post('/categories', [CategoryAdminController::class, 'store'])->name('api.admin.categories.store');
    Route::put('/categories/{category}', [CategoryAdminController::class, 'update'])->name('api.admin.categories.update');
    Route::delete('/categories/{category}', [CategoryAdminController::class, 'destroy'])->name('api.admin.categories.destroy');

    // Orders admin
    Route::get('/dashboard/stats', [AdminDashboardController::class, 'apiStats'])->name('api.admin.dashboard.stats');
    Route::get('/orders', [OrderAdminController::class, 'index'])->name('api.admin.orders.index');
    Route::get('/orders/{order}', [OrderAdminController::class, 'show'])->name('api.admin.orders.show');
    Route::put('/orders/{order}/status', [OrderAdminController::class, 'updateStatus'])->name('api.admin.orders.status');
  });

});
