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
    Schema::create('user_addresses', function (Blueprint $table) {
      $table->uuid('id')->primary();
      $table->foreignUuid('user_id')->constrained('users')->cascadeOnDelete();
      $table->string('type', 50)->nullable();
      $table->string('country', 100)->nullable();
      $table->string('state', 100)->nullable();
      $table->string('city', 100)->nullable();
      $table->string('postal_code', 50)->nullable();
      $table->text('address_line_1')->nullable();
      $table->text('address_line_2')->nullable();
      $table->boolean('is_default')->default(false);
      $table->timestamp('created_at')->useCurrent();
    });

    Schema::create('orders', function (Blueprint $table) {
      $table->uuid('id')->primary();
      $table->foreignUuid('user_id')->constrained('users')->cascadeOnDelete();
      $table->string('order_number', 100)->unique();
      $table->decimal('subtotal_amount', 10, 2)->nullable();
      $table->decimal('tax_amount', 10, 2)->nullable();
      $table->decimal('shipping_amount', 10, 2)->nullable();
      $table->decimal('discount_amount', 10, 2)->nullable();
      $table->decimal('total_amount', 10, 2)->nullable();
      $table->string('payment_status', 50)->nullable();
      $table->string('order_status', 50)->nullable();
      $table->foreignUuid('shipping_address_id')->nullable()->constrained('user_addresses')->nullOnDelete();
      $table->timestamp('placed_at')->nullable();
      $table->timestamps();
    });
  }

  /**
   * Reverse the migrations.
   */
  public function down(): void
  {
    Schema::dropIfExists('orders');
    Schema::dropIfExists('user_addresses');
  }
};
