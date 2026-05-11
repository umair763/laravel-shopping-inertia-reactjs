<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Domains\Account\Http\Controllers\AuthController;
use App\Domains\Account\Http\Controllers\UserAddressController;
use App\Domains\Catalog\Http\Controllers\ProductController;
use App\Domains\Catalog\Http\Controllers\Admin\CatalogueAdminController;
use App\Domains\Catalog\Http\Controllers\Admin\CategoryAdminController;
use App\Domains\Catalog\Http\Controllers\Admin\ProductAdminController;
use App\Domains\Cart\Http\Controllers\CartController;
use App\Domains\Orders\Http\Controllers\OrderController;
use App\Domains\Orders\Http\Controllers\AdminAnalyticsController;
use App\Domains\Orders\Http\Controllers\AdminDashboardController;
use App\Domains\Payments\Http\Controllers\PaymentController;
use App\Domains\Reviews\Http\Controllers\ReviewController;

/*
|--------------------------------------------------------------------------
| PUBLIC ROUTES
|--------------------------------------------------------------------------
*/

Route::get('/login', [AuthController::class, 'showUserLogin'])->name('login');
Route::get('/register', [AuthController::class, 'showUserRegister'])->name('auth.user.register');
Route::get('/admin/login', [AuthController::class, 'showAdminLogin'])->name('auth.admin.login');
Route::get('/admin/register', [AuthController::class, 'showAdminRegister'])->name('auth.admin.register');

Route::post('/register', [AuthController::class, 'register'])->name('auth.user.register.submit');
Route::post('/login', [AuthController::class, 'login'])->name('auth.user.login.submit');
Route::post('/admin/login', [AuthController::class, 'adminLogin'])->name('auth.admin.login.submit');
Route::post('/admin/register', [AuthController::class, 'createAdmin'])->name('auth.admin.register.submit');
Route::post('/logout', [AuthController::class, 'logout'])->name('auth.logout');

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

    // Cart (JSON endpoints + Inertia view)
    Route::get('/cart', [CartController::class, 'page'])->name('user.cart');
    Route::get('/cart/data', [CartController::class, 'show'])->name('user.cart.show');
    Route::post('/cart/items', [CartController::class, 'addItem'])->name('user.cart.add');
    Route::put('/cart/items/{cartItem}', [CartController::class, 'updateItem'])->name('user.cart.update');
    Route::delete('/cart/items/{cartItem}', [CartController::class, 'removeItem'])->name('user.cart.remove');
    Route::post('/cart/checkout', [CartController::class, 'checkout'])->name('user.cart.checkout');

    // Payments
    Route::post('/payments', [PaymentController::class, 'store'])->name('user.payments.store');
    Route::put('/payments/{payment}', [PaymentController::class, 'process'])->name('user.payments.process');

    // Reviews
    Route::post('/reviews', [ReviewController::class, 'store'])->name('user.reviews.store');
    Route::put('/reviews/{review}', [ReviewController::class, 'update'])->name('user.reviews.update');

    // Addresses
    Route::get('/addresses', [UserAddressController::class, 'index'])->name('user.addresses.index');
    Route::post('/addresses', [UserAddressController::class, 'store'])->name('user.addresses.store');
    Route::delete('/addresses/{address}', [UserAddressController::class, 'destroy'])->name('user.addresses.destroy');

});


/*
|--------------------------------------------------------------------------
| ADMIN ROUTES
|--------------------------------------------------------------------------
*/

Route::prefix('admin')
    ->middleware(['is_admin'])
    ->group(function () {

        // Dashboard (Inertia page)
        Route::get('/dashboard', [AdminDashboardController::class, 'index'])->name('admin.dashboard');

        // Dashboard analytics (JSON endpoints powering widgets/charts)
        Route::get('/dashboard/overview', [AdminAnalyticsController::class, 'overview'])->name('admin.dashboard.overview');
        Route::get('/dashboard/revenue', [AdminAnalyticsController::class, 'revenue'])->name('admin.dashboard.revenue');
        Route::get('/dashboard/orders-chart', [AdminAnalyticsController::class, 'ordersChart'])->name('admin.dashboard.orders-chart');
        Route::get('/dashboard/trending-products', [AdminAnalyticsController::class, 'trendingProducts'])->name('admin.dashboard.trending-products');
        Route::get('/dashboard/customer-growth', [AdminAnalyticsController::class, 'customerGrowth'])->name('admin.dashboard.customer-growth');
        Route::get('/dashboard/recent-orders', [AdminAnalyticsController::class, 'recentOrders'])->name('admin.dashboard.recent-orders');
        Route::get('/dashboard/inventory-alerts', [AdminAnalyticsController::class, 'inventoryAlerts'])->name('admin.dashboard.inventory-alerts');
        Route::get('/dashboard/sales-by-category', [AdminAnalyticsController::class, 'salesByCategory'])->name('admin.dashboard.sales-by-category');
        Route::get('/dashboard/top-customers', [AdminAnalyticsController::class, 'topCustomers'])->name('admin.dashboard.top-customers');
        Route::get('/dashboard/payment-analytics', [AdminAnalyticsController::class, 'paymentAnalytics'])->name('admin.dashboard.payment-analytics');
        Route::get('/dashboard/traffic-analytics', [AdminAnalyticsController::class, 'trafficAnalytics'])->name('admin.dashboard.traffic-analytics');

        // Catalogues (top-level catalog groupings)
        Route::get('/catalogues', [CatalogueAdminController::class, 'index'])->name('admin.catalogues.index');
        Route::get('/catalogues/create', [CatalogueAdminController::class, 'create'])->name('admin.catalogues.create');
        Route::post('/catalogues', [CatalogueAdminController::class, 'store'])->name('admin.catalogues.store');
        Route::get('/catalogues/{catalogue}/edit', [CatalogueAdminController::class, 'edit'])->name('admin.catalogues.edit');
        Route::put('/catalogues/{catalogue}', [CatalogueAdminController::class, 'update'])->name('admin.catalogues.update');
        Route::delete('/catalogues/{catalogue}', [CatalogueAdminController::class, 'destroy'])->name('admin.catalogues.destroy');

        // Categories (nested within a catalogue)
        Route::get('/categories', [CategoryAdminController::class, 'index'])->name('admin.categories.index');
        Route::get('/categories/create', [CategoryAdminController::class, 'create'])->name('admin.categories.create');
        Route::post('/categories', [CategoryAdminController::class, 'store'])->name('admin.categories.store');
        Route::get('/categories/{category}/edit', [CategoryAdminController::class, 'edit'])->name('admin.categories.edit');
        Route::put('/categories/{category}', [CategoryAdminController::class, 'update'])->name('admin.categories.update');
        Route::delete('/categories/{category}', [CategoryAdminController::class, 'destroy'])->name('admin.categories.destroy');

        // Products Management (aggregate: product + variant + inventory + images)
        Route::get('/products', [ProductAdminController::class, 'index'])->name('admin.products.index');
        Route::get('/products/create', [ProductAdminController::class, 'create'])->name('admin.products.create');
        Route::post('/products', [ProductAdminController::class, 'store'])->name('admin.products.store');
        Route::get('/products/{product}/edit', [ProductAdminController::class, 'edit'])->name('admin.products.edit');
        Route::put('/products/{product}', [ProductAdminController::class, 'update'])->name('admin.products.update');
        Route::delete('/products/{product}', [ProductAdminController::class, 'destroy'])->name('admin.products.destroy');

        // Orders Management
        Route::get('/orders', [AdminDashboardController::class, 'orders'])->name('admin.orders');
        Route::get('/orders/{order}', [AdminDashboardController::class, 'showOrder'])->name('admin.orders.show');
        Route::put('/orders/{order}', [AdminDashboardController::class, 'updateOrder'])->name('admin.orders.update');

    });
