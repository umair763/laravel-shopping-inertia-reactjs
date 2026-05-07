<?php

namespace Database\Seeders;

use App\Domains\Catalog\Models\Product;
use Illuminate\Database\Seeder;

class ProductSeeder extends Seeder
{
  /**
   * Run the database seeders.
   */
  public function run(): void
  {
    $products = [
      [
        'name' => 'Wireless Headphones Pro',
        'description' => 'Premium wireless headphones with active noise cancellation, 30-hour battery life, and premium sound quality.',
        'price' => 199.99,
        'quantity' => 50,
        'sku' => 'WH-PRO-001',
        'category' => 'electronics',
        'image_url' => 'https://via.placeholder.com/300?text=Wireless+Headphones',
        'is_active' => true,
      ],
      [
        'name' => 'Mechanical Keyboard RGB',
        'description' => 'RGB mechanical keyboard with cherry MX switches, programmable keys, and aluminum frame.',
        'price' => 149.99,
        'quantity' => 75,
        'sku' => 'KB-RGB-001',
        'category' => 'electronics',
        'image_url' => 'https://via.placeholder.com/300?text=Mechanical+Keyboard',
        'is_active' => true,
      ],
      [
        'name' => '4K Webcam',
        'description' => '4K resolution webcam with auto-focus, built-in microphone, and USB-C connection.',
        'price' => 89.99,
        'quantity' => 40,
        'sku' => 'WC-4K-001',
        'category' => 'electronics',
        'image_url' => 'https://via.placeholder.com/300?text=4K+Webcam',
        'is_active' => true,
      ],
      [
        'name' => 'Smart Watch Ultra',
        'description' => 'Advanced smartwatch with health tracking, GPS, heart rate monitor, and 7-day battery.',
        'price' => 299.99,
        'quantity' => 35,
        'sku' => 'SW-ULTRA-001',
        'category' => 'electronics',
        'image_url' => 'https://via.placeholder.com/300?text=Smart+Watch',
        'is_active' => true,
      ],
      [
        'name' => 'Classic Cotton T-Shirt',
        'description' => '100% organic cotton t-shirt, comfortable fit, available in multiple colors.',
        'price' => 24.99,
        'quantity' => 200,
        'sku' => 'TS-COTTON-001',
        'category' => 'fashion',
        'image_url' => 'https://via.placeholder.com/300?text=Cotton+T-Shirt',
        'is_active' => true,
      ],
      [
        'name' => 'Designer Jeans',
        'description' => 'Premium denim jeans with modern fit, durable fabric, and stylish design.',
        'price' => 79.99,
        'quantity' => 100,
        'sku' => 'JN-DSGNR-001',
        'category' => 'fashion',
        'image_url' => 'https://via.placeholder.com/300?text=Designer+Jeans',
        'is_active' => true,
      ],
      [
        'name' => 'Leather Jacket',
        'description' => 'Genuine leather jacket with zippered pockets and adjustable waist.',
        'price' => 249.99,
        'quantity' => 25,
        'sku' => 'JK-LTH-001',
        'category' => 'fashion',
        'image_url' => 'https://via.placeholder.com/300?text=Leather+Jacket',
        'is_active' => true,
      ],
      [
        'name' => 'Running Shoes Pro',
        'description' => 'Lightweight running shoes with advanced cushioning and breathable material.',
        'price' => 119.99,
        'quantity' => 80,
        'sku' => 'SH-RUN-001',
        'category' => 'sports',
        'image_url' => 'https://via.placeholder.com/300?text=Running+Shoes',
        'is_active' => true,
      ],
      [
        'name' => 'Yoga Mat Premium',
        'description' => 'Non-slip yoga mat made from eco-friendly material with carrying strap.',
        'price' => 49.99,
        'quantity' => 60,
        'sku' => 'YM-PREM-001',
        'category' => 'sports',
        'image_url' => 'https://via.placeholder.com/300?text=Yoga+Mat',
        'is_active' => true,
      ],
      [
        'name' => 'Dumbbells Set 20kg',
        'description' => 'Complete dumbbell set with adjustable weights from 2kg to 10kg.',
        'price' => 149.99,
        'quantity' => 30,
        'sku' => 'DB-20KG-001',
        'category' => 'sports',
        'image_url' => 'https://via.placeholder.com/300?text=Dumbbells+Set',
        'is_active' => true,
      ],
      [
        'name' => 'The Clean Code Book',
        'description' => 'A Handbook of Agile Software Craftsmanship - Essential reading for programmers.',
        'price' => 39.99,
        'quantity' => 45,
        'sku' => 'BK-CLEAN-001',
        'category' => 'books',
        'image_url' => 'https://via.placeholder.com/300?text=Clean+Code+Book',
        'is_active' => true,
      ],
      [
        'name' => 'Design Patterns Book',
        'description' => 'Elements of Reusable Object-Oriented Software - The classic design patterns book.',
        'price' => 49.99,
        'quantity' => 35,
        'sku' => 'BK-DPAT-001',
        'category' => 'books',
        'image_url' => 'https://via.placeholder.com/300?text=Design+Patterns',
        'is_active' => true,
      ],
      [
        'name' => 'Ceramic Coffee Mug Set',
        'description' => 'Set of 4 premium ceramic coffee mugs with matching saucers.',
        'price' => 34.99,
        'quantity' => 90,
        'sku' => 'MG-CER-001',
        'category' => 'home',
        'image_url' => 'https://via.placeholder.com/300?text=Coffee+Mugs',
        'is_active' => true,
      ],
      [
        'name' => 'Desk Lamp LED',
        'description' => 'Modern LED desk lamp with adjustable brightness and color temperature.',
        'price' => 59.99,
        'quantity' => 55,
        'sku' => 'LP-LED-001',
        'category' => 'home',
        'image_url' => 'https://via.placeholder.com/300?text=Desk+Lamp',
        'is_active' => true,
      ],
      [
        'name' => 'Wall Clock Modern',
        'description' => 'Contemporary wall clock with silent movement and minimalist design.',
        'price' => 44.99,
        'quantity' => 70,
        'sku' => 'CK-MOD-001',
        'category' => 'home',
        'image_url' => 'https://via.placeholder.com/300?text=Wall+Clock',
        'is_active' => true,
      ],
    ];

    foreach ($products as $product) {
      Product::create($product);
    }
  }
}
