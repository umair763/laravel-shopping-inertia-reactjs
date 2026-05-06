<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\OrderController;
use App\Http\Controllers\AdminProductController;
use App\Http\Controllers\AdminDashboardController;

/*
|--------------------------------------------------------------------------
| PUBLIC ROUTES
|--------------------------------------------------------------------------
*/

// Default home page - User Products View
Route::get('/', [ProductController::class, 'index'])->name('home');

// Welcome page (optional)
Route::get('/welcome', function () {
    return Inertia::render('Welcome');
});


/*
|--------------------------------------------------------------------------
| USER ROUTES
|--------------------------------------------------------------------------
*/

Route::middleware(['auth'])->group(function () {

    // User Home - Products Listing
    Route::get('/home', [ProductController::class, 'index'])->name('user.home');

    // Products page (same as home but for navigation)
    Route::get('/products', [ProductController::class, 'index'])->name('user.products');

    // View single product
    Route::get('/products/{product}', [ProductController::class, 'show'])->name('user.products.show');

    // Orders
    Route::get('/orders', [OrderController::class, 'index'])->name('user.orders');
    Route::get('/orders/{order}', [OrderController::class, 'show'])->name('user.orders.show');
    Route::post('/orders', [OrderController::class, 'store'])->name('user.orders.store');

});


/*
|--------------------------------------------------------------------------
| ADMIN ROUTES
|--------------------------------------------------------------------------
*/

Route::prefix('admin')
    ->middleware(['auth', 'is_admin'])
    ->group(function () {

        // Dashboard
        Route::get('/dashboard', [AdminDashboardController::class, 'index'])->name('admin.dashboard');

        // Products Management
        Route::get('/products', [AdminProductController::class, 'index'])->name('admin.products.index');
        Route::get('/products/create', [AdminProductController::class, 'create'])->name('admin.products.create');
        Route::post('/products', [AdminProductController::class, 'store'])->name('admin.products.store');
        Route::get('/products/{product}/edit', [AdminProductController::class, 'edit'])->name('admin.products.edit');
        Route::put('/products/{product}', [AdminProductController::class, 'update'])->name('admin.products.update');
        Route::delete('/products/{product}', [AdminProductController::class, 'destroy'])->name('admin.products.destroy');

        // Orders Management
        Route::get('/orders', [AdminDashboardController::class, 'orders'])->name('admin.orders');
        Route::get('/orders/{order}', [AdminDashboardController::class, 'showOrder'])->name('admin.orders.show');
        Route::put('/orders/{order}', [AdminDashboardController::class, 'updateOrder'])->name('admin.orders.update');

    });



