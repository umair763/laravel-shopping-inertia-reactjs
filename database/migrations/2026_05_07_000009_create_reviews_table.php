<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
  /**
   * Run the migrations.
   */
  public function up(): void
  {
    Schema::create('reviews', function (Blueprint $table) {
      $table->uuid('id')->primary();
      $table->foreignUuid('user_id')->constrained('users')->cascadeOnDelete();
      $table->foreignUuid('product_id')->constrained('products')->cascadeOnDelete();
      $table->unsignedTinyInteger('rating');
      $table->string('title')->nullable();
      $table->text('comment')->nullable();
      $table->timestamp('created_at')->useCurrent();
      $table->unique(['user_id', 'product_id']);
    });

    $driver = DB::getDriverName();
    if (in_array($driver, ['mysql', 'pgsql'], true)) {
      DB::statement('ALTER TABLE reviews ADD CONSTRAINT reviews_rating_check CHECK (rating BETWEEN 1 AND 5)');
    }
  }

  /**
   * Reverse the migrations.
   */
  public function down(): void
  {
    Schema::dropIfExists('reviews');
  }
};
