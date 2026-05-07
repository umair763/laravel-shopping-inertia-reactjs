<?php

namespace Tests\Feature;

use App\Domains\Account\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Hash;
use Tests\TestCase;

class AuthFlowTest extends TestCase
{
  use RefreshDatabase;

  public function test_user_registration_logs_in_as_user(): void
  {
    $response = $this->post('/register', [
      'name' => 'Jane Customer',
      'email' => 'jane@example.com',
      'password' => 'password123',
      'password_confirmation' => 'password123',
    ]);

    $response->assertRedirect(route('user.home'));

    $this->assertDatabaseHas('users', [
      'email' => 'jane@example.com',
      'role' => 'customer',
    ]);

    $this->assertAuthenticated();
    $this->assertTrue(auth()->user()?->role === 'customer');
  }

  public function test_admin_can_login_and_create_another_admin(): void
  {
    $admin = User::factory()->create([
      'first_name' => 'Admin',
      'last_name' => 'One',
      'email' => 'admin1@example.com',
      'password_hash' => Hash::make('password123'),
      'role' => 'admin',
    ]);

    $this->post('/admin/login', [
      'email' => $admin->email,
      'password' => 'password123',
    ])->assertRedirect(route('admin.dashboard'));

    $this->actingAs($admin);

    $response = $this->post('/admin/register', [
      'name' => 'Admin Two',
      'email' => 'admin2@example.com',
      'password' => 'password123',
      'password_confirmation' => 'password123',
    ]);

    $response->assertRedirect(route('admin.dashboard'));

    $this->assertDatabaseHas('users', [
      'email' => 'admin2@example.com',
      'role' => 'admin',
    ]);

    $this->assertAuthenticated();
    $this->assertTrue(auth()->user()?->email === 'admin1@example.com');
  }

  public function test_non_admin_cannot_create_admin_when_admins_exist(): void
  {
    User::factory()->create([
      'first_name' => 'Admin',
      'last_name' => 'One',
      'email' => 'admin1@example.com',
      'password_hash' => Hash::make('password123'),
      'role' => 'admin',
    ]);

    $user = User::factory()->create([
      'first_name' => 'Customer',
      'last_name' => 'One',
      'email' => 'customer@example.com',
      'password_hash' => Hash::make('password123'),
      'role' => 'customer',
    ]);

    $this->post('/login', [
      'email' => $user->email,
      'password' => 'password123',
    ])->assertRedirect(route('user.home'));

    $response = $this->post('/admin/register', [
      'name' => 'Should Fail',
      'email' => 'fail@example.com',
      'password' => 'password123',
      'password_confirmation' => 'password123',
    ]);

    $response->assertSessionHasErrors('email');
    $this->assertDatabaseMissing('users', [
      'email' => 'fail@example.com',
    ]);
  }
}