<?php

namespace Tests\Feature;

use App\Domains\Account\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Hash;
use Tests\TestCase;

class ApiAuthTest extends TestCase
{
  use RefreshDatabase;

  public function test_api_validation_errors_return_json_without_accept_header(): void
  {
    $response = $this->post('/api/account/register', []);

    $response->assertStatus(422);
    $response->assertHeader('Content-Type', 'application/json');
    $response->assertJsonValidationErrors(['name', 'email', 'password']);
  }

  public function test_api_user_registration_returns_bearer_token(): void
  {
    $response = $this->postJson('/api/account/register', [
      'name' => 'Api User',
      'email' => 'apiuser@example.com',
      'password' => 'password123',
      'password_confirmation' => 'password123',
    ]);

    $response->assertCreated();
    $response->assertJsonStructure([
      'message',
      'user',
      'token_type',
      'token',
    ]);

    $this->assertSame('Bearer', $response->json('token_type'));

    $this->withHeader('Authorization', 'Bearer ' . $response->json('token'))
      ->getJson('/api/account/profile')
      ->assertOk()
      ->assertJsonPath('data.email', 'apiuser@example.com');
  }

  public function test_api_admin_login_and_create_admin_with_token(): void
  {
    $admin = User::factory()->create([
      'first_name' => 'Api',
      'last_name' => 'Admin',
      'email' => 'apiadmin@example.com',
      'password_hash' => Hash::make('password123'),
      'role' => 'admin',
    ]);

    $loginResponse = $this->postJson('/api/account/admin/login', [
      'email' => $admin->email,
      'password' => 'password123',
    ]);

    $loginResponse->assertOk();
    $token = $loginResponse->json('token');

    $this->withHeader('Authorization', 'Bearer ' . $token)
      ->postJson('/api/account/admin/register', [
        'name' => 'Second Admin',
        'email' => 'secondadmin@example.com',
        'password' => 'password123',
        'password_confirmation' => 'password123',
      ])
      ->assertCreated()
      ->assertJsonPath('user.email', 'secondadmin@example.com');

    $this->assertDatabaseHas('users', [
      'email' => 'secondadmin@example.com',
      'role' => 'admin',
    ]);
  }

  public function test_api_admin_create_bootstraps_first_admin_without_token(): void
  {
    $response = $this->postJson('/api/account/admin/register', [
      'name' => 'Bootstrap Admin',
      'email' => 'bootstrap@example.com',
      'password' => 'password123',
      'password_confirmation' => 'password123',
    ]);

    $response->assertCreated();
    $this->assertDatabaseHas('users', [
      'email' => 'bootstrap@example.com',
      'role' => 'admin',
    ]);
  }
}