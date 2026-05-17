<?php

namespace Database\Seeders;

use App\Domains\Account\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use Carbon\Carbon;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    public function run(): void
    {
        DB::table('reviews')->delete();
        DB::table('cart_items')->delete();
        DB::table('carts')->delete();
        DB::table('payments')->delete();
        DB::table('order_items')->delete();
        DB::table('orders')->delete();
        DB::table('user_addresses')->delete();
        DB::table('inventory')->delete();
        DB::table('product_variants')->delete();
        DB::table('products')->delete();
        DB::table('categories')->delete();
        DB::table('catalogues')->delete();

        // ── Users ──────────────────────────────────────────────────────
        $admin = User::updateOrCreate(['email' => 'admin@gmail.com'], [
            'first_name' => 'Admin',
            'last_name' => 'AmazStore',
            'username' => 'admin',
            'password_hash' => Hash::make('password123'),
            'role' => 'admin',
            'status' => 'active',
            'is_email_verified' => true,
        ]);

        $customer = User::updateOrCreate(['email' => 'user@example.com'], [
            'first_name' => 'John',
            'last_name' => 'Doe',
            'username' => 'johndoe',
            'password_hash' => Hash::make('password123'),
            'role' => 'customer',
            'status' => 'active',
            'is_email_verified' => true,
        ]);

        // ── Catalogues ─────────────────────────────────────────────────
        $catElec = $this->uuid();
        $catCloth = $this->uuid();
        $catHome = $this->uuid();

        DB::table('catalogues')->insert([
            ['id' => $catElec, 'name' => 'Electronics', 'slug' => 'electronics', 'description' => 'Gadgets, devices, and accessories.', 'status' => 'active', 'sort_order' => 1, 'created_at' => now(), 'updated_at' => now()],
            ['id' => $catCloth, 'name' => 'Clothing', 'slug' => 'clothing', 'description' => 'Modern fashion for every style.', 'status' => 'active', 'sort_order' => 2, 'created_at' => now(), 'updated_at' => now()],
            ['id' => $catHome, 'name' => 'Home & Garden', 'slug' => 'home-garden', 'description' => 'Everything for your home.', 'status' => 'active', 'sort_order' => 3, 'created_at' => now(), 'updated_at' => now()],
        ]);

        // ── Categories ─────────────────────────────────────────────────
        $cSmartphones = $this->uuid();
        $cLaptops = $this->uuid();
        $cAccessories = $this->uuid();
        $cTShirts = $this->uuid();
        $cOuterwear = $this->uuid();
        $cKitchen = $this->uuid();
        $cDecor = $this->uuid();

        DB::table('categories')->insert([
            ['id' => $cSmartphones, 'catalogue_id' => $catElec, 'name' => 'Smartphones', 'slug' => 'smartphones', 'created_at' => now()],
            ['id' => $cLaptops, 'catalogue_id' => $catElec, 'name' => 'Laptops', 'slug' => 'laptops', 'created_at' => now()],
            ['id' => $cAccessories, 'catalogue_id' => $catElec, 'name' => 'Accessories', 'slug' => 'accessories', 'created_at' => now()],
            ['id' => $cTShirts, 'catalogue_id' => $catCloth, 'name' => 'T-Shirts', 'slug' => 't-shirts', 'created_at' => now()],
            ['id' => $cOuterwear, 'catalogue_id' => $catCloth, 'name' => 'Outerwear', 'slug' => 'outerwear', 'created_at' => now()],
            ['id' => $cKitchen, 'catalogue_id' => $catHome, 'name' => 'Kitchen', 'slug' => 'kitchen', 'created_at' => now()],
            ['id' => $cDecor, 'catalogue_id' => $catHome, 'name' => 'Home Décor', 'slug' => 'home-decor', 'created_at' => now()],
        ]);

        // ── Products ───────────────────────────────────────────────────
        $products = [
            ['id' => $this->uuid(), 'cat' => $catElec, 'cat_id' => $cSmartphones, 'name' => 'iPhone 15 Pro', 'slug' => 'iphone-15-pro', 'brand' => 'Apple', 'sku' => 'IPHONE-15PRO', 'price' => 999.00, 'stock' => 30, 'desc' => 'The most advanced iPhone ever with titanium design and A17 Pro chip.'],
            ['id' => $this->uuid(), 'cat' => $catElec, 'cat_id' => $cSmartphones, 'name' => 'Samsung Galaxy S24 Ultra', 'slug' => 'samsung-galaxy-s24-ultra', 'brand' => 'Samsung', 'sku' => 'SAMSUNG-S24U', 'price' => 1199.00, 'stock' => 25, 'desc' => 'Ultimate Android flagship with S Pen and 200MP camera.'],
            ['id' => $this->uuid(), 'cat' => $catElec, 'cat_id' => $cLaptops, 'name' => 'MacBook Pro 14"', 'slug' => 'macbook-pro-14', 'brand' => 'Apple', 'sku' => 'MBP-14-M3', 'price' => 1999.00, 'stock' => 15, 'desc' => 'Supercharged by M3 Pro chip. Built for pros who push limits.'],
            ['id' => $this->uuid(), 'cat' => $catElec, 'cat_id' => $cLaptops, 'name' => 'Dell XPS 15', 'slug' => 'dell-xps-15', 'brand' => 'Dell', 'sku' => 'DELL-XPS15-2024', 'price' => 1399.00, 'stock' => 20, 'desc' => 'Premium Windows laptop with OLED display and Intel Core i9.'],
            ['id' => $this->uuid(), 'cat' => $catElec, 'cat_id' => $cAccessories, 'name' => 'AirPods Pro 2nd Gen', 'slug' => 'airpods-pro-2', 'brand' => 'Apple', 'sku' => 'AIRPODS-PRO2', 'price' => 249.00, 'stock' => 60, 'desc' => 'Active Noise Cancellation, Adaptive Audio, and H2 chip.'],
            ['id' => $this->uuid(), 'cat' => $catElec, 'cat_id' => $cAccessories, 'name' => 'USB-C Hub 7-in-1', 'slug' => 'usb-c-hub-7in1', 'brand' => 'Anker', 'sku' => 'ANKER-HUB-7IN1', 'price' => 49.99, 'stock' => 80, 'desc' => 'Expand your laptop ports with HDMI 4K, SD card, and 3× USB-A.'],
            ['id' => $this->uuid(), 'cat' => $catCloth, 'cat_id' => $cTShirts, 'name' => 'Classic Cotton Tee', 'slug' => 'classic-cotton-tee', 'brand' => 'Basics Co.', 'sku' => 'COTTON-TEE-001', 'price' => 29.99, 'stock' => 150, 'desc' => '100% organic cotton, pre-washed, unisex fit.'],
            ['id' => $this->uuid(), 'cat' => $catCloth, 'cat_id' => $cTShirts, 'name' => 'Premium Polo Shirt', 'slug' => 'premium-polo-shirt', 'brand' => 'Polo Club', 'sku' => 'POLO-PREMIUM-001', 'price' => 59.99, 'stock' => 90, 'desc' => 'Piqué cotton polo with ribbed collar and two-button placket.'],
            ['id' => $this->uuid(), 'cat' => $catCloth, 'cat_id' => $cOuterwear, 'name' => 'Winter Parka Jacket', 'slug' => 'winter-parka-jacket', 'brand' => 'NorthWear', 'sku' => 'PARKA-WINTER-001', 'price' => 199.00, 'stock' => 40, 'desc' => 'Insulated 650-fill down jacket, water-resistant DWR finish.'],
            ['id' => $this->uuid(), 'cat' => $catCloth, 'cat_id' => $cOuterwear, 'name' => 'Waterproof Rain Coat', 'slug' => 'waterproof-rain-coat', 'brand' => 'NorthWear', 'sku' => 'RAINCOAT-001', 'price' => 149.00, 'stock' => 35, 'desc' => 'Fully seam-sealed shell with breathable Gore-Tex membrane.'],
            ['id' => $this->uuid(), 'cat' => $catHome, 'cat_id' => $cKitchen, 'name' => 'Espresso Machine Pro', 'slug' => 'espresso-machine-pro', 'brand' => 'Breville', 'sku' => 'BREV-ESPRESSO', 'price' => 399.00, 'stock' => 20, 'desc' => 'Café-quality espresso at home with 15-bar pressure.'],
            ['id' => $this->uuid(), 'cat' => $catHome, 'cat_id' => $cKitchen, 'name' => 'KitchenAid Stand Mixer', 'slug' => 'kitchenaid-stand-mixer', 'brand' => 'KitchenAid', 'sku' => 'KITAID-MIXER', 'price' => 449.00, 'stock' => 15, 'desc' => '5-quart bowl, 10-speed, 59 touchpoints for thorough mixing.'],
        ];

        $productIds = [];
        $variantIds = [];

        foreach ($products as $p) {
            $productIds[$p['slug']] = $p['id'];
            DB::table('products')->insert([
                'id' => $p['id'],
                'catalogue_id' => $p['cat'],
                'category_id' => $p['cat_id'],
                'name' => $p['name'],
                'slug' => $p['slug'],
                'brand' => $p['brand'],
                'sku' => $p['sku'],
                'short_description' => $p['desc'],
                'description' => $p['desc'],
                'status' => 'active',
                'is_featured' => false,
                'created_at' => now(),
                'updated_at' => now(),
            ]);

            $variantId = $this->uuid();
            $variantIds[$p['slug']] = $variantId;

            DB::table('product_variants')->insert([
                'id' => $variantId,
                'product_id' => $p['id'],
                'name' => 'Standard',
                'sku' => $p['sku'] . '-V1',
                'price' => $p['price'],
                'stock_quantity' => $p['stock'],
                'status' => 'active',
                'created_at' => now(),
                'updated_at' => now(),
            ]);

            DB::table('inventory')->insert([
                'id' => $this->uuid(),
                'variant_id' => $variantId,
                'available_quantity' => $p['stock'],
                'reserved_quantity' => 0,
                'low_stock_threshold' => 5,
                'updated_at' => now(),
            ]);
        }

        // ── Shipping Address ───────────────────────────────────────────
        $addressId = $this->uuid();
        DB::table('user_addresses')->insert([
            'id' => $addressId,
            'user_id' => $customer->id,
            'type' => 'shipping',
            'country' => 'United States',
            'state' => 'California',
            'city' => 'San Francisco',
            'postal_code' => '94105',
            'address_line_1' => '123 Market Street',
            'address_line_2' => 'Apt 4B',
            'is_default' => true,
            'created_at' => now(),
        ]);

        // ── Orders ─────────────────────────────────────────────────────
        $order1Id = $this->uuid();
        $order2Id = $this->uuid();
        $order3Id = $this->uuid();
        $order4Id = $this->uuid();

        DB::table('orders')->insert([
            [
                'id' => $order1Id,
                'user_id' => $customer->id,
                'order_number' => 'ORD-2025-001',
                'subtotal_amount' => 1248.00,
                'tax_amount' => 112.32,
                'shipping_amount' => 0.00,
                'discount_amount' => 0.00,
                'total_amount' => 1360.32,
                'payment_status' => 'paid',
                'order_status' => 'delivered',
                'shipping_address_id' => $addressId,
                'placed_at' => Carbon::now()->subMonths(3),
                'created_at' => Carbon::now()->subMonths(3),
                'updated_at' => Carbon::now()->subMonths(2)->subWeeks(3),
            ],
            [
                'id' => $order2Id,
                'user_id' => $customer->id,
                'order_number' => 'ORD-2025-002',
                'subtotal_amount' => 1999.00,
                'tax_amount' => 179.91,
                'shipping_amount' => 9.99,
                'discount_amount' => 0.00,
                'total_amount' => 2188.90,
                'payment_status' => 'paid',
                'order_status' => 'delivered',
                'shipping_address_id' => $addressId,
                'placed_at' => Carbon::now()->subMonths(2),
                'created_at' => Carbon::now()->subMonths(2),
                'updated_at' => Carbon::now()->subMonths(1)->subWeeks(2),
            ],
            [
                'id' => $order3Id,
                'user_id' => $customer->id,
                'order_number' => 'ORD-2025-003',
                'subtotal_amount' => 89.98,
                'tax_amount' => 8.10,
                'shipping_amount' => 4.99,
                'discount_amount' => 0.00,
                'total_amount' => 103.07,
                'payment_status' => 'paid',
                'order_status' => 'shipped',
                'shipping_address_id' => $addressId,
                'placed_at' => Carbon::now()->subWeeks(2),
                'created_at' => Carbon::now()->subWeeks(2),
                'updated_at' => Carbon::now()->subWeeks(1),
            ],
            [
                'id' => $order4Id,
                'user_id' => $customer->id,
                'order_number' => 'ORD-2025-004',
                'subtotal_amount' => 399.00,
                'tax_amount' => 35.91,
                'shipping_amount' => 0.00,
                'discount_amount' => 20.00,
                'total_amount' => 414.91,
                'payment_status' => 'pending',
                'order_status' => 'processing',
                'shipping_address_id' => $addressId,
                'placed_at' => Carbon::now()->subDays(2),
                'created_at' => Carbon::now()->subDays(2),
                'updated_at' => Carbon::now()->subDays(1),
            ],
        ]);

        // ── Order Items ────────────────────────────────────────────────
        DB::table('order_items')->insert([
            // Order 1: iPhone + AirPods
            ['id' => $this->uuid(), 'order_id' => $order1Id, 'product_id' => $productIds['iphone-15-pro'], 'variant_id' => $variantIds['iphone-15-pro'], 'quantity' => 1, 'unit_price' => 999.00, 'total_price' => 999.00],
            ['id' => $this->uuid(), 'order_id' => $order1Id, 'product_id' => $productIds['airpods-pro-2'], 'variant_id' => $variantIds['airpods-pro-2'], 'quantity' => 1, 'unit_price' => 249.00, 'total_price' => 249.00],
            // Order 2: MacBook
            ['id' => $this->uuid(), 'order_id' => $order2Id, 'product_id' => $productIds['macbook-pro-14'], 'variant_id' => $variantIds['macbook-pro-14'], 'quantity' => 1, 'unit_price' => 1999.00, 'total_price' => 1999.00],
            // Order 3: T-Shirts + Polo
            ['id' => $this->uuid(), 'order_id' => $order3Id, 'product_id' => $productIds['classic-cotton-tee'], 'variant_id' => $variantIds['classic-cotton-tee'], 'quantity' => 2, 'unit_price' => 29.99, 'total_price' => 59.98],
            ['id' => $this->uuid(), 'order_id' => $order3Id, 'product_id' => $productIds['premium-polo-shirt'], 'variant_id' => $variantIds['premium-polo-shirt'], 'quantity' => 1, 'unit_price' => 59.99, 'total_price' => 59.99],
            // Order 4: Espresso Machine
            ['id' => $this->uuid(), 'order_id' => $order4Id, 'product_id' => $productIds['espresso-machine-pro'], 'variant_id' => $variantIds['espresso-machine-pro'], 'quantity' => 1, 'unit_price' => 399.00, 'total_price' => 399.00],
        ]);

        // ── Payments ───────────────────────────────────────────────────
        DB::table('payments')->insert([
            ['id' => $this->uuid(), 'order_id' => $order1Id, 'payment_method' => 'credit_card', 'transaction_id' => 'TXN-' . strtoupper(Str::random(10)), 'amount' => 1360.32, 'payment_status' => 'paid', 'paid_at' => Carbon::now()->subMonths(3), 'created_at' => Carbon::now()->subMonths(3)],
            ['id' => $this->uuid(), 'order_id' => $order2Id, 'payment_method' => 'paypal', 'transaction_id' => 'TXN-' . strtoupper(Str::random(10)), 'amount' => 2188.90, 'payment_status' => 'paid', 'paid_at' => Carbon::now()->subMonths(2), 'created_at' => Carbon::now()->subMonths(2)],
            ['id' => $this->uuid(), 'order_id' => $order3Id, 'payment_method' => 'credit_card', 'transaction_id' => 'TXN-' . strtoupper(Str::random(10)), 'amount' => 103.07, 'payment_status' => 'paid', 'paid_at' => Carbon::now()->subWeeks(2), 'created_at' => Carbon::now()->subWeeks(2)],
        ]);

        // ── Reviews (for delivered orders only) ────────────────────────
        DB::table('reviews')->insert([
            ['id' => $this->uuid(), 'user_id' => $customer->id, 'product_id' => $productIds['iphone-15-pro'], 'rating' => 5, 'title' => 'Absolutely love it!', 'comment' => 'The titanium build feels premium and the camera is incredible. Best iPhone I\'ve owned.', 'created_at' => Carbon::now()->subMonths(2)->subWeeks(2)],
            ['id' => $this->uuid(), 'user_id' => $customer->id, 'product_id' => $productIds['airpods-pro-2'], 'rating' => 5, 'title' => 'Worth every penny', 'comment' => 'The noise cancellation is incredible for commuting. Battery life is outstanding too.', 'created_at' => Carbon::now()->subMonths(2)->subWeeks(1)],
            ['id' => $this->uuid(), 'user_id' => $customer->id, 'product_id' => $productIds['macbook-pro-14'], 'rating' => 4, 'title' => 'Powerful but pricey', 'comment' => 'The M3 Pro chip handles everything effortlessly. Build quality is exceptional. The price is the only downside.', 'created_at' => Carbon::now()->subMonths(1)->subWeeks(1)],
        ]);

        // ── Cart ───────────────────────────────────────────────────────
        $cartId = $this->uuid();
        DB::table('carts')->insert([
            'id' => $cartId,
            'user_id' => $customer->id,
            'status' => 'active',
            'total_items' => 3,
            'total_amount' => 1448.97,
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        DB::table('cart_items')->insert([
            ['id' => $this->uuid(), 'cart_id' => $cartId, 'product_id' => $productIds['dell-xps-15'], 'variant_id' => $variantIds['dell-xps-15'], 'quantity' => 1, 'unit_price' => 1399.00, 'created_at' => now()],
            ['id' => $this->uuid(), 'cart_id' => $cartId, 'product_id' => $productIds['usb-c-hub-7in1'], 'variant_id' => $variantIds['usb-c-hub-7in1'], 'quantity' => 2, 'unit_price' => 49.99, 'created_at' => now()],
        ]);

        $this->command->info('✓ AmazStore seeded: admin@gmail.com / user@example.com (password: password123)');
    }

    private function uuid(): string
    {
        return (string) Str::uuid();
    }
}
