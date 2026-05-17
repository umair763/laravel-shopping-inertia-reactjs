<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        $columns = Schema::getColumnListing('users');

        if (!in_array('first_name', $columns)) {
            Schema::table('users', function (Blueprint $table) {
                $table->string('first_name', 100)->nullable()->after('id');
            });
            // Seed first_name from existing name column
            DB::statement("UPDATE users SET first_name = SUBSTR(name, 1, INSTR(name || ' ', ' ') - 1) WHERE name IS NOT NULL");
        }

        if (!in_array('last_name', $columns)) {
            Schema::table('users', function (Blueprint $table) {
                $table->string('last_name', 100)->nullable()->after('first_name');
            });
            DB::statement("UPDATE users SET last_name = TRIM(SUBSTR(name, INSTR(name, ' '))) WHERE name IS NOT NULL AND INSTR(name, ' ') > 0");
        }

        if (!in_array('username', $columns)) {
            Schema::table('users', function (Blueprint $table) {
                $table->string('username', 100)->nullable()->unique()->after('last_name');
            });
        }

        if (!in_array('phone', $columns)) {
            Schema::table('users', function (Blueprint $table) {
                $table->string('phone', 30)->nullable()->after('email');
            });
        }

        if (!in_array('password_hash', $columns)) {
            Schema::table('users', function (Blueprint $table) {
                $table->text('password_hash')->nullable()->after('phone');
            });
            // Copy existing hashed passwords into password_hash
            DB::statement("UPDATE users SET password_hash = password WHERE password IS NOT NULL");
        }

        if (!in_array('profile_image', $columns)) {
            Schema::table('users', function (Blueprint $table) {
                $table->text('profile_image')->nullable()->after('password_hash');
            });
        }

        if (!in_array('status', $columns)) {
            Schema::table('users', function (Blueprint $table) {
                $table->string('status', 50)->default('active')->after('role');
            });
        }

        if (!in_array('is_email_verified', $columns)) {
            Schema::table('users', function (Blueprint $table) {
                $table->boolean('is_email_verified')->default(false)->after('status');
            });
            DB::statement("UPDATE users SET is_email_verified = CASE WHEN email_verified_at IS NOT NULL THEN 1 ELSE 0 END");
        }

        if (!in_array('is_phone_verified', $columns)) {
            Schema::table('users', function (Blueprint $table) {
                $table->boolean('is_phone_verified')->default(false)->after('is_email_verified');
            });
        }

        if (!in_array('last_login_at', $columns)) {
            Schema::table('users', function (Blueprint $table) {
                $table->timestamp('last_login_at')->nullable()->after('is_phone_verified');
            });
        }

        if (!in_array('deleted_at', $columns)) {
            Schema::table('users', function (Blueprint $table) {
                $table->softDeletes();
            });
        }
    }

    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn([
                'first_name', 'last_name', 'username', 'phone',
                'password_hash', 'profile_image', 'status',
                'is_email_verified', 'is_phone_verified', 'last_login_at', 'deleted_at',
            ]);
        });
    }
};
