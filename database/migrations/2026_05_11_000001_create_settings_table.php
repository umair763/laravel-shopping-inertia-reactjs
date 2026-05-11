<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
  public function up(): void
  {
    Schema::create('settings', function (Blueprint $table) {
      $table->uuid('id')->primary();
      $table->string('group', 50)->index();   // general | payment | shipping | email | security | notifications | tax
      $table->string('key', 150);
      $table->json('value')->nullable();      // any JSON-encodable value
      $table->boolean('is_encrypted')->default(false);
      $table->foreignUuid('updated_by')->nullable()->constrained('users')->nullOnDelete();
      $table->timestamps();

      $table->unique(['group', 'key']);
    });
  }

  public function down(): void
  {
    Schema::dropIfExists('settings');
  }
};
