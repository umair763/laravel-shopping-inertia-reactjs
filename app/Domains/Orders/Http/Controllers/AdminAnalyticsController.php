<?php

namespace App\Domains\Orders\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\DB;

/**
 * Admin analytics endpoints powering the dashboard widgets.
 *
 * All endpoints return JSON of the shape:
 *   { "data": ..., "success": true }
 * and rely on raw MySQL aggregation (no PHP-side loops over rows).
 *
 * Common query params:
 *   - startDate (YYYY-MM-DD)   Inclusive lower bound on orders.placed_at / created_at
 *   - endDate   (YYYY-MM-DD)   Inclusive upper bound
 *   - granularity (day|week|month|year)  For time-series endpoints (default: day)
 */
class AdminAnalyticsController extends Controller
{
  // -----------------------------------------------------------------------
  // 1. /admin/dashboard/overview — the 12 overview KPI cards.
  // -----------------------------------------------------------------------
  public function overview(Request $request)
  {
    [$start, $end] = $this->range($request);
    $monthStart = Carbon::now()->startOfMonth();
    $activeUsersThreshold = Carbon::now()->subDays(30);

    $orderAgg = DB::table('orders')
      ->selectRaw("
        COUNT(*)                                                                AS total_orders,
        COALESCE(SUM(CASE WHEN payment_status = 'paid'      THEN total_amount END), 0) AS total_revenue,
        COALESCE(SUM(CASE WHEN payment_status = 'refunded'  THEN total_amount END), 0) AS total_refunds,
        SUM(CASE WHEN order_status = 'pending'   THEN 1 ELSE 0 END)             AS pending_orders,
        SUM(CASE WHEN order_status = 'delivered' THEN 1 ELSE 0 END)             AS completed_orders,
        SUM(CASE WHEN order_status = 'cancelled' THEN 1 ELSE 0 END)             AS cancelled_orders
      ")
      ->first();

    $monthlyRevenue = (float) DB::table('orders')
      ->where('payment_status', 'paid')
      ->where('created_at', '>=', $monthStart)
      ->sum('total_amount');

    $totalCustomers = (int) DB::table('users')->where('role', 'customer')->count();
    $totalProducts = (int) DB::table('products')->whereNull('deleted_at')->count();
    $activeUsers = (int) DB::table('users')
      ->where('role', 'customer')
      ->where('last_login_at', '>=', $activeUsersThreshold)
      ->count();

    $paidOrders = (int) DB::table('orders')->where('payment_status', 'paid')->count();
    $aov = $paidOrders > 0 ? round(((float) $orderAgg->total_revenue) / $paidOrders, 2) : 0.0;
    $conversion = $totalCustomers > 0 ? round(($paidOrders / $totalCustomers) * 100, 2) : 0.0;

    return response()->json([
      'data' => [
        'total_revenue' => (float) $orderAgg->total_revenue,
        'total_orders' => (int) $orderAgg->total_orders,
        'total_customers' => $totalCustomers,
        'total_products' => $totalProducts,
        'pending_orders' => (int) $orderAgg->pending_orders,
        'completed_orders' => (int) $orderAgg->completed_orders,
        'cancelled_orders' => (int) $orderAgg->cancelled_orders,
        'total_refunds' => (float) $orderAgg->total_refunds,
        'monthly_revenue' => $monthlyRevenue,
        'average_order_value' => $aov,
        'conversion_rate' => $conversion,
        'active_users' => $activeUsers,
      ],
      'success' => true,
    ]);
  }

  // -----------------------------------------------------------------------
  // 2. /admin/dashboard/revenue — gross/net revenue summary for a range.
  // -----------------------------------------------------------------------
  public function revenue(Request $request)
  {
    [$start, $end] = $this->range($request);

    $row = DB::table('orders')
      ->whereBetween(DB::raw('COALESCE(placed_at, created_at)'), [$start, $end])
      ->selectRaw("
        COALESCE(SUM(CASE WHEN payment_status = 'paid'     THEN total_amount END), 0) AS gross_revenue,
        COALESCE(SUM(CASE WHEN payment_status = 'paid'     THEN tax_amount   END), 0) AS tax_collected,
        COALESCE(SUM(CASE WHEN payment_status = 'paid'     THEN shipping_amount END), 0) AS shipping_collected,
        COALESCE(SUM(CASE WHEN payment_status = 'paid'     THEN discount_amount END), 0) AS discounts_given,
        COALESCE(SUM(CASE WHEN payment_status = 'refunded' THEN total_amount END), 0) AS refunds
      ")
      ->first();

    $gross = (float) $row->gross_revenue;
    $refunds = (float) $row->refunds;

    return response()->json([
      'data' => [
        'range' => ['start' => $start->toDateString(), 'end' => $end->toDateString()],
        'gross_revenue' => $gross,
        'tax_collected' => (float) $row->tax_collected,
        'shipping_collected' => (float) $row->shipping_collected,
        'discounts_given' => (float) $row->discounts_given,
        'refunds' => $refunds,
        'net_revenue' => round($gross - $refunds, 2),
      ],
      'success' => true,
    ]);
  }

  // -----------------------------------------------------------------------
  // 3. /admin/dashboard/orders-chart — time-series orders + revenue.
  //    Response: { labels: [...], orders: [...], revenue: [...] }
  // -----------------------------------------------------------------------
  public function ordersChart(Request $request)
  {
    [$start, $end] = $this->range($request);
    $granularity = $request->query('granularity', 'day');
    $format = $this->mysqlDateFormat($granularity);

    $rows = DB::table('orders')
      ->selectRaw("DATE_FORMAT(COALESCE(placed_at, created_at), '{$format}') AS bucket,
                   COUNT(*) AS orders,
                   COALESCE(SUM(CASE WHEN payment_status = 'paid' THEN total_amount END), 0) AS revenue")
      ->whereBetween(DB::raw('COALESCE(placed_at, created_at)'), [$start, $end])
      ->groupBy('bucket')
      ->orderBy('bucket')
      ->get();

    return response()->json([
      'data' => [
        'labels' => $rows->pluck('bucket')->all(),
        'orders' => $rows->pluck('orders')->map(fn($v) => (int) $v)->all(),
        'revenue' => $rows->pluck('revenue')->map(fn($v) => (float) $v)->all(),
        'granularity' => $granularity,
      ],
      'success' => true,
    ]);
  }

  // -----------------------------------------------------------------------
  // 4. /admin/dashboard/trending-products
  //    Query: limit (5|10|20|n), sort (best_selling|most_reviewed|most_viewed|most_wishlisted), startDate, endDate
  // -----------------------------------------------------------------------
  public function trendingProducts(Request $request)
  {
    [$start, $end] = $this->range($request);
    $limit = max(1, min(100, (int) $request->query('limit', 10)));
    $sort = $request->query('sort', 'best_selling');

    // Most viewed / wishlisted require tracking tables that aren't built yet (Phase 4).
    // For now those sorts gracefully fall back to best_selling so the UI keeps working.
    $unsupported = in_array($sort, ['most_viewed', 'most_wishlisted'], true);
    $effectiveSort = $unsupported ? 'best_selling' : $sort;

    $query = DB::table('products')
      ->leftJoin('product_variants', 'product_variants.product_id', '=', 'products.id')
      ->leftJoin('product_images', function ($join) {
        $join->on('product_images.variant_id', '=', 'product_variants.id')
          ->where('product_images.is_primary', '=', true);
      })
      ->leftJoin('inventory', 'inventory.variant_id', '=', 'product_variants.id')
      ->leftJoin('categories', 'categories.id', '=', 'products.category_id')
      ->leftJoin('order_items', 'order_items.product_id', '=', 'products.id')
      ->leftJoin('orders', function ($join) use ($start, $end) {
        $join->on('orders.id', '=', 'order_items.order_id')
          ->whereBetween(DB::raw('COALESCE(orders.placed_at, orders.created_at)'), [$start, $end])
          ->where('orders.payment_status', '=', 'paid');
      })
      ->leftJoin('reviews', 'reviews.product_id', '=', 'products.id')
      ->whereNull('products.deleted_at');

    $rows = $query
      ->groupBy(
        'products.id', 'products.name', 'products.sku', 'products.status',
        'product_variants.id', 'product_variants.price', 'product_variants.discount_price',
        'product_images.image_url', 'inventory.available_quantity', 'product_variants.stock_quantity',
        'categories.name'
      )
      ->selectRaw('
        products.id,
        products.name,
        products.sku,
        products.status,
        categories.name AS category_name,
        product_images.image_url AS image_url,
        COALESCE(product_variants.discount_price, product_variants.price) AS price,
        COALESCE(inventory.available_quantity, product_variants.stock_quantity, 0) AS stock,
        COALESCE(SUM(order_items.quantity), 0) AS units_sold,
        COALESCE(SUM(order_items.total_price), 0) AS revenue,
        COUNT(DISTINCT reviews.id) AS review_count,
        COALESCE(AVG(reviews.rating), 0) AS avg_rating
      ')
      ->orderByRaw($this->trendingOrderBy($effectiveSort))
      ->limit($limit)
      ->get()
      ->map(function ($r) {
        return [
          'id' => $r->id,
          'name' => $r->name,
          'sku' => $r->sku,
          'status' => $r->status,
          'category' => $r->category_name,
          'image_url' => $r->image_url,
          'price' => (float) $r->price,
          'stock' => (int) $r->stock,
          'units_sold' => (int) $r->units_sold,
          'revenue' => (float) $r->revenue,
          'review_count' => (int) $r->review_count,
          'rating' => round((float) $r->avg_rating, 2),
          // trend_percentage compares against the previous period of equal length.
          'trend_percentage' => 0, // populated below
        ];
      });

    // Compute trend percentages vs the previous period (best_selling: units_sold).
    $rows = $this->attachTrendPercentages($rows, $start, $end, $effectiveSort);

    return response()->json([
      'data' => $rows,
      'meta' => [
        'limit' => $limit,
        'sort' => $sort,
        'effective_sort' => $effectiveSort,
        'unsupported_sort' => $unsupported,
        'range' => ['start' => $start->toDateString(), 'end' => $end->toDateString()],
      ],
      'success' => true,
    ]);
  }

  // -----------------------------------------------------------------------
  // 5. /admin/dashboard/customer-growth — new customers per bucket.
  // -----------------------------------------------------------------------
  public function customerGrowth(Request $request)
  {
    [$start, $end] = $this->range($request);
    $granularity = $request->query('granularity', 'day');
    $format = $this->mysqlDateFormat($granularity);

    $rows = DB::table('users')
      ->selectRaw("DATE_FORMAT(created_at, '{$format}') AS bucket, COUNT(*) AS new_customers")
      ->where('role', 'customer')
      ->whereBetween('created_at', [$start, $end])
      ->groupBy('bucket')
      ->orderBy('bucket')
      ->get();

    return response()->json([
      'data' => [
        'labels' => $rows->pluck('bucket')->all(),
        'new_customers' => $rows->pluck('new_customers')->map(fn($v) => (int) $v)->all(),
        'granularity' => $granularity,
      ],
      'success' => true,
    ]);
  }

  // -----------------------------------------------------------------------
  // 6. /admin/dashboard/recent-orders
  // -----------------------------------------------------------------------
  public function recentOrders(Request $request)
  {
    $limit = max(1, min(50, (int) $request->query('limit', 10)));

    $rows = DB::table('orders')
      ->leftJoin('users', 'users.id', '=', 'orders.user_id')
      ->orderByDesc('orders.created_at')
      ->limit($limit)
      ->selectRaw("
        orders.id,
        orders.order_number,
        orders.total_amount,
        orders.payment_status,
        orders.order_status,
        orders.created_at,
        orders.placed_at,
        users.first_name,
        users.last_name,
        users.email
      ")
      ->get()
      ->map(function ($r) {
        return [
          'id' => $r->id,
          'order_number' => $r->order_number,
          'total_amount' => (float) $r->total_amount,
          'payment_status' => $r->payment_status,
          'order_status' => $r->order_status,
          'created_at' => $r->created_at,
          'placed_at' => $r->placed_at,
          'customer' => [
            'name' => trim(($r->first_name ?? '') . ' ' . ($r->last_name ?? '')) ?: $r->email,
            'email' => $r->email,
          ],
        ];
      });

    return response()->json(['data' => $rows, 'success' => true]);
  }

  // -----------------------------------------------------------------------
  // 7. /admin/dashboard/inventory-alerts — at/below low_stock_threshold.
  // -----------------------------------------------------------------------
  public function inventoryAlerts(Request $request)
  {
    $limit = max(1, min(200, (int) $request->query('limit', 25)));

    $rows = DB::table('inventory')
      ->join('product_variants', 'product_variants.id', '=', 'inventory.variant_id')
      ->join('products', 'products.id', '=', 'product_variants.product_id')
      ->whereColumn('inventory.available_quantity', '<=', 'inventory.low_stock_threshold')
      ->whereNull('products.deleted_at')
      ->orderBy('inventory.available_quantity')
      ->limit($limit)
      ->selectRaw('
        products.id AS product_id,
        products.name AS product_name,
        products.sku AS product_sku,
        product_variants.id AS variant_id,
        product_variants.sku AS variant_sku,
        inventory.available_quantity,
        inventory.reserved_quantity,
        inventory.low_stock_threshold
      ')
      ->get()
      ->map(fn($r) => [
        'product_id' => $r->product_id,
        'product_name' => $r->product_name,
        'product_sku' => $r->product_sku,
        'variant_id' => $r->variant_id,
        'variant_sku' => $r->variant_sku,
        'available_quantity' => (int) $r->available_quantity,
        'reserved_quantity' => (int) $r->reserved_quantity,
        'low_stock_threshold' => (int) $r->low_stock_threshold,
        'severity' => $r->available_quantity <= 0 ? 'out' : ($r->available_quantity <= ($r->low_stock_threshold / 2) ? 'critical' : 'low'),
      ]);

    return response()->json(['data' => $rows, 'success' => true]);
  }

  // -----------------------------------------------------------------------
  // 8. /admin/dashboard/sales-by-category
  // -----------------------------------------------------------------------
  public function salesByCategory(Request $request)
  {
    [$start, $end] = $this->range($request);

    $rows = DB::table('order_items')
      ->join('orders', 'orders.id', '=', 'order_items.order_id')
      ->leftJoin('products', 'products.id', '=', 'order_items.product_id')
      ->leftJoin('categories', 'categories.id', '=', 'products.category_id')
      ->where('orders.payment_status', 'paid')
      ->whereBetween(DB::raw('COALESCE(orders.placed_at, orders.created_at)'), [$start, $end])
      ->groupBy('categories.id', 'categories.name')
      ->selectRaw('
        categories.id   AS category_id,
        COALESCE(categories.name, "Uncategorized") AS category_name,
        SUM(order_items.quantity)    AS units_sold,
        SUM(order_items.total_price) AS revenue
      ')
      ->orderByDesc('revenue')
      ->get()
      ->map(fn($r) => [
        'category_id' => $r->category_id,
        'category_name' => $r->category_name,
        'units_sold' => (int) $r->units_sold,
        'revenue' => (float) $r->revenue,
      ]);

    return response()->json(['data' => $rows, 'success' => true]);
  }

  // -----------------------------------------------------------------------
  // 9. /admin/dashboard/top-customers — by lifetime paid spend.
  // -----------------------------------------------------------------------
  public function topCustomers(Request $request)
  {
    [$start, $end] = $this->range($request);
    $limit = max(1, min(100, (int) $request->query('limit', 10)));

    $rows = DB::table('orders')
      ->join('users', 'users.id', '=', 'orders.user_id')
      ->where('orders.payment_status', 'paid')
      ->whereBetween(DB::raw('COALESCE(orders.placed_at, orders.created_at)'), [$start, $end])
      ->groupBy('users.id', 'users.first_name', 'users.last_name', 'users.email')
      ->selectRaw('
        users.id,
        users.first_name,
        users.last_name,
        users.email,
        COUNT(orders.id) AS order_count,
        SUM(orders.total_amount) AS total_spent,
        AVG(orders.total_amount) AS avg_order_value
      ')
      ->orderByDesc('total_spent')
      ->limit($limit)
      ->get()
      ->map(fn($r) => [
        'id' => $r->id,
        'name' => trim(($r->first_name ?? '') . ' ' . ($r->last_name ?? '')) ?: $r->email,
        'email' => $r->email,
        'order_count' => (int) $r->order_count,
        'total_spent' => (float) $r->total_spent,
        'average_order_value' => round((float) $r->avg_order_value, 2),
      ]);

    return response()->json(['data' => $rows, 'success' => true]);
  }

  // -----------------------------------------------------------------------
  // 10. /admin/dashboard/payment-analytics
  // -----------------------------------------------------------------------
  public function paymentAnalytics(Request $request)
  {
    [$start, $end] = $this->range($request);

    $byMethod = DB::table('payments')
      ->whereBetween('created_at', [$start, $end])
      ->groupBy('payment_method', 'payment_status')
      ->selectRaw('
        COALESCE(payment_method, "unknown") AS payment_method,
        payment_status,
        COUNT(*) AS attempts,
        COALESCE(SUM(amount), 0) AS amount
      ')
      ->get();

    $methods = [];
    foreach ($byMethod as $row) {
      $method = $row->payment_method;
      $methods[$method] ??= [
        'payment_method' => $method,
        'total_attempts' => 0,
        'succeeded' => 0,
        'failed' => 0,
        'pending' => 0,
        'refunded' => 0,
        'amount_processed' => 0.0,
      ];
      $methods[$method]['total_attempts'] += (int) $row->attempts;
      $methods[$method]['amount_processed'] += (float) $row->amount;
      $bucket = match ($row->payment_status) {
        'succeeded', 'paid', 'success' => 'succeeded',
        'failed', 'error' => 'failed',
        'refunded' => 'refunded',
        default => 'pending',
      };
      $methods[$method][$bucket] += (int) $row->attempts;
    }

    return response()->json([
      'data' => array_values($methods),
      'success' => true,
    ]);
  }

  // -----------------------------------------------------------------------
  // 11. /admin/dashboard/traffic-analytics — best signal we have today:
  //     daily active sessions from the `sessions` table + new user signups.
  // -----------------------------------------------------------------------
  public function trafficAnalytics(Request $request)
  {
    [$start, $end] = $this->range($request);
    $granularity = $request->query('granularity', 'day');
    $format = $this->mysqlDateFormat($granularity);

    $startTs = $start->timestamp;
    $endTs = $end->timestamp;

    $sessionRows = DB::table('sessions')
      ->whereBetween('last_activity', [$startTs, $endTs])
      ->selectRaw("
        DATE_FORMAT(FROM_UNIXTIME(last_activity), '{$format}') AS bucket,
        COUNT(*) AS sessions,
        COUNT(DISTINCT user_id) AS unique_users
      ")
      ->groupBy('bucket')
      ->orderBy('bucket')
      ->get();

    $signupRows = DB::table('users')
      ->whereBetween('created_at', [$start, $end])
      ->selectRaw("DATE_FORMAT(created_at, '{$format}') AS bucket, COUNT(*) AS signups")
      ->groupBy('bucket')
      ->orderBy('bucket')
      ->get()
      ->keyBy('bucket');

    $combined = $sessionRows->map(fn($r) => [
      'bucket' => $r->bucket,
      'sessions' => (int) $r->sessions,
      'unique_users' => (int) $r->unique_users,
      'signups' => (int) ($signupRows[$r->bucket]->signups ?? 0),
    ]);

    return response()->json([
      'data' => [
        'labels' => $combined->pluck('bucket')->all(),
        'sessions' => $combined->pluck('sessions')->all(),
        'unique_users' => $combined->pluck('unique_users')->all(),
        'signups' => $combined->pluck('signups')->all(),
        'granularity' => $granularity,
      ],
      'success' => true,
    ]);
  }

  // -----------------------------------------------------------------------
  // Helpers
  // -----------------------------------------------------------------------

  /**
   * Resolve startDate/endDate query params into Carbon instances.
   * Defaults: last 30 days, ending now.
   */
  private function range(Request $request): array
  {
    $end = $request->query('endDate')
      ? Carbon::parse($request->query('endDate'))->endOfDay()
      : Carbon::now()->endOfDay();

    $start = $request->query('startDate')
      ? Carbon::parse($request->query('startDate'))->startOfDay()
      : (clone $end)->subDays(29)->startOfDay();

    return [$start, $end];
  }

  private function mysqlDateFormat(string $granularity): string
  {
    return match ($granularity) {
      'year' => '%Y',
      'month' => '%Y-%m',
      'week' => '%x-W%v', // ISO week
      default => '%Y-%m-%d', // day
    };
  }

  private function trendingOrderBy(string $sort): string
  {
    return match ($sort) {
      'most_reviewed' => 'review_count DESC, units_sold DESC',
      default => 'units_sold DESC, revenue DESC',
    };
  }

  /**
   * Compare the trending metric against the same-length previous window
   * and attach a trend_percentage on each row.
   */
  private function attachTrendPercentages($rows, Carbon $start, Carbon $end, string $sort)
  {
    $lengthSeconds = $end->diffInSeconds($start);
    $prevEnd = (clone $start)->subSecond();
    $prevStart = (clone $prevEnd)->subSeconds($lengthSeconds);

    $productIds = $rows->pluck('id')->all();
    if (empty($productIds)) return $rows;

    if ($sort === 'most_reviewed') {
      $prev = DB::table('reviews')
        ->whereIn('product_id', $productIds)
        ->whereBetween('created_at', [$prevStart, $prevEnd])
        ->groupBy('product_id')
        ->selectRaw('product_id, COUNT(*) AS metric')
        ->pluck('metric', 'product_id');

      return $rows->map(function ($row) use ($prev) {
        $previous = (int) ($prev[$row['id']] ?? 0);
        $current = (int) $row['review_count'];
        $row['trend_percentage'] = $this->percentChange($previous, $current);
        return $row;
      });
    }

    $prev = DB::table('order_items')
      ->join('orders', 'orders.id', '=', 'order_items.order_id')
      ->where('orders.payment_status', 'paid')
      ->whereIn('order_items.product_id', $productIds)
      ->whereBetween(DB::raw('COALESCE(orders.placed_at, orders.created_at)'), [$prevStart, $prevEnd])
      ->groupBy('order_items.product_id')
      ->selectRaw('order_items.product_id, SUM(order_items.quantity) AS metric')
      ->pluck('metric', 'order_items.product_id');

    return $rows->map(function ($row) use ($prev) {
      $previous = (int) ($prev[$row['id']] ?? 0);
      $current = (int) $row['units_sold'];
      $row['trend_percentage'] = $this->percentChange($previous, $current);
      return $row;
    });
  }

  private function percentChange(int $previous, int $current): float
  {
    if ($previous === 0) {
      return $current > 0 ? 100.0 : 0.0;
    }
    return round((($current - $previous) / $previous) * 100, 2);
  }
}
