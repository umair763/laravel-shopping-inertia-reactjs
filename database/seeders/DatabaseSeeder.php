<?php

namespace Database\Seeders;

use App\Domains\Account\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // Create regular customer user
        User::updateOrCreate([
            'email' => 'user@example.com',
        ], [
            'first_name' => 'John',
            'last_name' => 'Doe',
            'password_hash' => Hash::make('password123'),
            'role' => 'customer',
        ]);

        // Create admin user
        User::updateOrCreate([
            'email' => 'admin@gmail.com',
        ], [
            'first_name' => 'Admin',
            'last_name' => 'User',
            'password_hash' => Hash::make('password123'),
            'role' => 'admin',
        ]);

        // Seed products (commented out as requested "only one user and one admin")
        // $this->call(ProductSeeder::class);
    }
}
