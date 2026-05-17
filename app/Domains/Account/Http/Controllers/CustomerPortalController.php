<?php

namespace App\Domains\Account\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Inertia\Inertia;

class CustomerPortalController extends Controller
{
    public function dashboard()
    {
        $user = Auth::user();

        $ordersCount = DB::table('orders')->where('user_id', $user->id)->count();
        $totalSpent = (float) DB::table('orders')
            ->where('user_id', $user->id)
            ->whereIn('order_status', ['delivered', 'completed'])
            ->sum('total_amount');

        $reviewsCount = DB::table('reviews')->where('user_id', $user->id)->count();

        $cartItemsCount = DB::table('cart_items')
            ->join('carts', 'cart_items.cart_id', '=', 'carts.id')
            ->where('carts.user_id', $user->id)
            ->sum('cart_items.quantity');

        $recentOrders = DB::table('orders')
            ->where('orders.user_id', $user->id)
            ->orderByDesc('orders.placed_at')
            ->take(5)
            ->get()
            ->map(function ($order) {
                $order->items_count = DB::table('order_items')
                    ->where('order_id', $order->id)
                    ->count();
                return $order;
            });

        return Inertia::render('Customer/Dashboard', [
            'stats' => [
                'orders_count' => $ordersCount,
                'total_spent' => $totalSpent,
                'reviews_count' => $reviewsCount,
                'cart_items_count' => (int) $cartItemsCount,
            ],
            'recent_orders' => $recentOrders,
        ]);
    }

    public function profile()
    {
        return Inertia::render('Customer/Profile');
    }

    public function reviews()
    {
        $user = Auth::user();

        $reviews = DB::table('reviews')
            ->join('products', 'reviews.product_id', '=', 'products.id')
            ->where('reviews.user_id', $user->id)
            ->select(
                'reviews.id',
                'reviews.rating',
                'reviews.title',
                'reviews.comment',
                'reviews.created_at',
                'products.id as product_id',
                'products.name as product_name',
                'products.slug as product_slug',
            )
            ->orderByDesc('reviews.created_at')
            ->get();

        $purchasedProductIds = DB::table('order_items')
            ->join('orders', 'order_items.order_id', '=', 'orders.id')
            ->where('orders.user_id', $user->id)
            ->whereIn('orders.order_status', ['delivered', 'completed'])
            ->pluck('order_items.product_id')
            ->unique()
            ->values();

        $reviewedProductIds = DB::table('reviews')
            ->where('user_id', $user->id)
            ->pluck('product_id');

        $pendingReviewProducts = DB::table('products')
            ->whereIn('id', $purchasedProductIds)
            ->whereNotIn('id', $reviewedProductIds)
            ->select('id', 'name', 'slug')
            ->get();

        return Inertia::render('Customer/Reviews', [
            'reviews' => $reviews,
            'pending_review_products' => $pendingReviewProducts,
        ]);
    }

    public function history()
    {
        $user = Auth::user();

        $orders = DB::table('orders')
            ->where('user_id', $user->id)
            ->orderByDesc('placed_at')
            ->paginate(10);

        $ordersWithItems = collect($orders->items())->map(function ($order) {
            $order->items = DB::table('order_items')
                ->join('products', 'order_items.product_id', '=', 'products.id')
                ->where('order_items.order_id', $order->id)
                ->select(
                    'order_items.*',
                    'products.name as product_name',
                    'products.slug as product_slug',
                )
                ->get();
            $order->payment = DB::table('payments')
                ->where('order_id', $order->id)
                ->first();
            return $order;
        });

        return Inertia::render('Customer/History', [
            'orders' => [
                'data' => $ordersWithItems,
                'current_page' => $orders->currentPage(),
                'last_page' => $orders->lastPage(),
                'total' => $orders->total(),
            ],
        ]);
    }

    public function settings()
    {
        return Inertia::render('Customer/Settings');
    }

    public function addresses()
    {
        return Inertia::render('Customer/Addresses');
    }

    public function changePassword(Request $request)
    {
        $user = $request->user();

        $validated = $request->validate([
            'current_password' => 'required|string',
            'password' => 'required|string|min:8|confirmed',
        ]);

        if (!Hash::check($validated['current_password'], $user->password_hash)) {
            return response()->json([
                'message' => 'Current password is incorrect.',
                'errors' => ['current_password' => ['The current password you entered is incorrect.']],
            ], 422);
        }

        $user->update(['password_hash' => Hash::make($validated['password'])]);

        return response()->json([
            'message' => 'Password updated successfully.',
            'success' => true,
        ]);
    }
}
