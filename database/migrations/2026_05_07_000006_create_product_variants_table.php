<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
  /**
   * Run the migrations.
   */
  public function up(): void
  {
    Schema::create('product_variants', function (Blueprint $table) {
      $table->uuid('id')->primary();
      $table->foreignUuid('product_id')->constrained('products')->cascadeOnDelete();
      $table->string('name')->nullable();
      $table->string('sku', 100)->unique();
      $table->decimal('price', 10, 2);
      $table->decimal('discount_price', 10, 2)->nullable();
      $table->integer('stock_quantity')->default(0);
      $table->decimal('weight', 10, 2)->nullable();
      $table->string('barcode', 255)->nullable();
      $table->json('attributes')->nullable();
      $table->string('status', 50)->default('active');
      $table->timestamps();
      $table->softDeletes();
    });
  }

  /**
   * Reverse the migrations.
   */
  public function down(): void
  {
    Schema::dropIfExists('product_variants');
  }
};
