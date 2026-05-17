<?php

namespace Database\Seeders;

use App\Domains\Catalog\Models\Product;
use App\Domains\Catalog\Models\ProductVariant;
use App\Domains\Catalog\Models\ProductImage;
use App\Domains\Catalog\Models\Inventory;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class ProductSeeder extends Seeder
{
  /**
   * Run the database seeders.
   */
  public function run(): void
  {
    // Clear existing data
    DB::table('product_images')->delete();
    DB::table('inventory')->delete();
    DB::table('product_variants')->delete();
    DB::table('products')->delete();
    $products = [
      [
        'name' => 'Wireless Headphones Pro',
        'description' => 'Premium wireless headphones with active noise cancellation, 30-hour battery life, and premium sound quality.',
        'price' => 199.99,
        'quantity' => 50,
        'sku' => 'WH-PRO-001',
        'image_url' => 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop',
      ],
      [
        'name' => 'Mechanical Keyboard RGB',
        'description' => 'RGB mechanical keyboard with cherry MX switches, programmable keys, and aluminum frame.',
        'price' => 149.99,
        'quantity' => 75,
        'sku' => 'KB-RGB-001',
        'image_url' => 'https://images.unsplash.com/photo-1587829191301-4b63ff1c87d5?w=400&h=400&fit=crop',
      ],
      [
        'name' => '4K Webcam',
        'description' => '4K resolution webcam with auto-focus, built-in microphone, and USB-C connection.',
        'price' => 89.99,
        'quantity' => 40,
        'sku' => 'WC-4K-001',
        'image_url' => 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=400&h=400&fit=crop',
      ],
      [
        'name' => 'Smart Watch Ultra',
        'description' => 'Advanced smartwatch with health tracking, GPS, heart rate monitor, and 7-day battery.',
        'price' => 299.99,
        'quantity' => 35,
        'sku' => 'SW-ULTRA-001',
        'image_url' => 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=400&fit=crop',
      ],
      [
        'name' => 'Classic Cotton T-Shirt',
        'description' => '100% organic cotton t-shirt, comfortable fit, available in multiple colors.',
        'price' => 24.99,
        'quantity' => 200,
        'sku' => 'TS-COTTON-001',
        'image_url' => 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=400&fit=crop',
      ],
      [
        'name' => 'Designer Jeans',
        'description' => 'Premium denim jeans with modern fit, durable fabric, and stylish design.',
        'price' => 79.99,
        'quantity' => 100,
        'sku' => 'JN-DSGNR-001',
        'image_url' => 'https://images.unsplash.com/photo-1542272604-787c62d465d1?w=400&h=400&fit=crop',
      ],
      [
        'name' => 'Leather Jacket',
        'description' => 'Genuine leather jacket with zippered pockets and adjustable waist.',
        'price' => 249.99,
        'quantity' => 25,
        'sku' => 'JK-LTH-001',
        'image_url' => 'https://images.unsplash.com/photo-1551028719-00167b16ebc5?w=400&h=400&fit=crop',
      ],
      [
        'name' => 'Running Shoes Pro',
        'description' => 'Lightweight running shoes with advanced cushioning and breathable material.',
        'price' => 119.99,
        'quantity' => 80,
        'sku' => 'SH-RUN-001',
        'image_url' => 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=400&fit=crop',
      ],
      [
        'name' => 'Yoga Mat Premium',
        'description' => 'Non-slip yoga mat made from eco-friendly material with carrying strap.',
        'price' => 49.99,
        'quantity' => 60,
        'sku' => 'YM-PREM-001',
        'image_url' => 'https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=400&h=400&fit=crop',
      ],
      [
        'name' => 'Dumbbells Set 20kg',
        'description' => 'Complete dumbbell set with adjustable weights from 2kg to 10kg.',
        'price' => 149.99,
        'quantity' => 30,
        'sku' => 'DB-20KG-001',
        'image_url' => 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=400&h=400&fit=crop',
      ],
      [
        'name' => 'The Clean Code Book',
        'description' => 'A Handbook of Agile Software Craftsmanship - Essential reading for programmers.',
        'price' => 39.99,
        'quantity' => 45,
        'sku' => 'BK-CLEAN-001',
        'image_url' => 'https://images.unsplash.com/photo-150784272343-583f20270319?w=400&h=400&fit=crop',
      ],
      [
        'name' => 'Design Patterns Book',
        'description' => 'Elements of Reusable Object-Oriented Software - The classic design patterns book.',
        'price' => 49.99,
        'quantity' => 35,
        'sku' => 'BK-DPAT-001',
        'image_url' => 'https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?w=400&h=400&fit=crop',
      ],
      [
        'name' => 'Ceramic Coffee Mug Set',
        'description' => 'Set of 4 premium ceramic coffee mugs with matching saucers.',
        'price' => 34.99,
        'quantity' => 90,
        'sku' => 'MG-CER-001',
        'image_url' => 'https://images.unsplash.com/photo-1508615039623-a25605d2378d?w=400&h=400&fit=crop',
      ],
      [
        'name' => 'Desk Lamp LED',
        'description' => 'Modern LED desk lamp with adjustable brightness and color temperature.',
        'price' => 59.99,
        'quantity' => 55,
        'sku' => 'LP-LED-001',
        'image_url' => 'https://images.unsplash.com/photo-1565636192335-14c8d7cb6a69?w=400&h=400&fit=crop',
      ],
      [
        'name' => 'Wall Clock Modern',
        'description' => 'Contemporary wall clock with silent movement and minimalist design.',
        'price' => 44.99,
        'quantity' => 70,
        'sku' => 'CK-MOD-001',
        'image_url' => 'https://images.unsplash.com/photo-1524678606370-a47ad25cb82a?w=400&h=400&fit=crop',
      ],
    ];

    foreach ($products as $productData) {
      // Create the product
      $product = Product::create([
        'name' => $productData['name'],
        'slug' => Str::slug($productData['name']),
        'description' => $productData['description'],
        'short_description' => substr($productData['description'], 0, 100),
        'sku' => $productData['sku'],
        'status' => 'active', // Set to 'active' so it shows up
        'is_featured' => false,
      ]);

      // Create a product variant with price and stock
      $variant = ProductVariant::create([
        'product_id' => $product->id,
        'name' => 'Standard',
        'sku' => $productData['sku'] . '-V1',
        'price' => $productData['price'],
        'stock_quantity' => $productData['quantity'],
        'status' => 'active',
      ]);

      // Create inventory record for the variant
      Inventory::create([
        'variant_id' => $variant->id,
        'available_quantity' => $productData['quantity'],
        'reserved_quantity' => 0,
        'low_stock_threshold' => 5,
      ]);

      // Create product image
      ProductImage::create([
        'variant_id' => $variant->id,
        'image_url' => $productData['image_url'],
        'is_primary' => true,
        'sort_order' => 0,
      ]);
    }
  }
}
