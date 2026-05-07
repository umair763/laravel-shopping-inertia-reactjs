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
    Schema::create('catalogues', function (Blueprint $table) {
      $table->uuid('id')->primary();
      $table->string('name');
      $table->string('slug')->unique();
      $table->text('description')->nullable();
      $table->text('icon')->nullable();
      $table->text('cover_image')->nullable();
      $table->boolean('is_featured')->default(false);
      $table->integer('sort_order')->default(0);
      $table->string('status', 50)->default('active');
      $table->timestamps();
      $table->softDeletes();
    });

    Schema::create('categories', function (Blueprint $table) {
      $table->uuid('id')->primary();
      $table->foreignUuid('catalogue_id')->nullable()->constrained('catalogues')->nullOnDelete();
      $table->foreignUuid('parent_category_id')->nullable()->constrained('categories')->nullOnDelete();
      $table->string('name');
      $table->string('slug')->unique();
      $table->text('description')->nullable();
      $table->text('image')->nullable();
      $table->timestamp('created_at')->useCurrent();
    });

    Schema::create('products', function (Blueprint $table) {
      $table->uuid('id')->primary();
      $table->foreignUuid('catalogue_id')->nullable()->constrained('catalogues')->nullOnDelete();
      $table->foreignUuid('category_id')->nullable()->constrained('categories')->nullOnDelete();
      $table->string('name');
      $table->string('slug')->unique();
      $table->text('short_description')->nullable();
      $table->text('description')->nullable();
      $table->string('brand')->nullable();
      $table->string('sku', 100)->unique();
      $table->string('status', 50)->default('draft');
      $table->boolean('is_featured')->default(false);
      $table->text('seo_title')->nullable();
      $table->text('seo_description')->nullable();
      $table->timestamps();
      $table->softDeletes();
    });
  }

  /**
   * Reverse the migrations.
   */
  public function down(): void
  {
    Schema::dropIfExists('products');
    Schema::dropIfExists('categories');
    Schema::dropIfExists('catalogues');
  }
};
