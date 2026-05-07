<?php

namespace Database\Seeders;

use App\Domains\Account\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // Create regular user
        User::updateOrCreate([
            'email' => 'user@example.com',
        ], [
            'name' => 'John Doe',
            'password' => bcrypt('password123'),
            'role' => 'user',
        ]);

        // Create admin user
        User::updateOrCreate([
            'email' => 'admin@gmail.com',
        ], [
            'name' => 'Admin User',
            'password' => bcrypt('password123'),
            'role' => 'admin',
        ]);

        // Seed products
        $this->call(ProductSeeder::class);
    }
}
