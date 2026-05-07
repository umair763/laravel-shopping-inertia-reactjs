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
    Schema::create('payments', function (Blueprint $table) {
      $table->uuid('id')->primary();
      $table->foreignUuid('order_id')->constrained('orders')->cascadeOnDelete();
      $table->string('payment_method', 50)->nullable();
      $table->string('transaction_id', 255)->nullable();
      $table->decimal('amount', 10, 2)->nullable();
      $table->string('payment_status', 50)->nullable();
      $table->timestamp('paid_at')->nullable();
      $table->timestamp('created_at')->useCurrent();
    });
  }

  /**
   * Reverse the migrations.
   */
  public function down(): void
  {
    Schema::dropIfExists('payments');
  }
};
