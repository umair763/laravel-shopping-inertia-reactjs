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
    if (!Schema::hasColumn('users', 'api_token_hash')) {
      Schema::table('users', function (Blueprint $table) {
        $table->string('api_token_hash', 64)->nullable()->unique()->after('role');
      });
    }
  }

  /**
   * Reverse the migrations.
   */
  public function down(): void
  {
    if (Schema::hasColumn('users', 'api_token_hash')) {
      Schema::table('users', function (Blueprint $table) {
        $sm = Schema::getConnection()->getDoctrineSchemaManager();
        // Drop unique index if exists (MySQL naming can vary)
        try {
          $table->dropUnique(['api_token_hash']);
        } catch (\Throwable $e) {
          // ignore if index doesn't exist
        }

        $table->dropColumn('api_token_hash');
      });
    }
  }
};
