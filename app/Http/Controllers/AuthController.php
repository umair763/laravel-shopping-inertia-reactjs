<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;

class AuthController extends Controller
{
  /**
   * Register a new user
   * POST /api/register
   */
  public function register(Request $request)
  {
    // Validate input
    $validated = $request->validate([
      'name' => 'required|string|max:255',
      'email' => 'required|string|email|max:255|unique:users',
      'password' => 'required|string|min:8|confirmed',
    ]);

    // Create user
    $user = User::create([
      'name' => $validated['name'],
      'email' => $validated['email'],
      'password' => Hash::make($validated['password']),
      'role' => 'user', // Default role
    ]);

    // Return success response
    return response()->json([
      'message' => 'User registered successfully',
      'user' => $user,
    ], 201);
  }

  /**
   * Login user
   * POST /api/login
   */
  public function login(Request $request)
  {
    // Validate input
    $validated = $request->validate([
      'email' => 'required|string|email',
      'password' => 'required|string',
    ]);

    // Find user
    $user = User::where('email', $validated['email'])->first();

    // Check password
    if (!$user || !Hash::check($validated['password'], $user->password)) {
      throw ValidationException::withMessages([
        'email' => ['The provided credentials are incorrect.'],
      ]);
    }

    // Create session/token
    auth()->login($user);

    return response()->json([
      'message' => 'Logged in successfully',
      'user' => $user,
    ]);
  }

  /**
   * Logout user
   * POST /api/logout
   */
  public function logout(Request $request)
  {
    auth()->logout();

    return response()->json([
      'message' => 'Logged out successfully',
    ]);
  }

  /**
   * Get authenticated user
   * GET /api/user
   */
  public function user(Request $request)
  {
    return response()->json($request->user());
  }

  /**
   * Create a new admin (Admin only)
   * POST /api/admin/create
   */
  public function createAdmin(Request $request)
  {
    // Validate that current user is admin
    if (!auth()->check() || auth()->user()->role !== 'admin') {
      return response()->json([
        'message' => 'Unauthorized. Only admins can create admin accounts.',
      ], 403);
    }

    // Validate input
    $validated = $request->validate([
      'name' => 'required|string|max:255',
      'email' => 'required|string|email|max:255|unique:users',
      'password' => 'required|string|min:8|confirmed',
    ]);

    // Create admin user
    $admin = User::create([
      'name' => $validated['name'],
      'email' => $validated['email'],
      'password' => Hash::make($validated['password']),
      'role' => 'admin',  // ← Admin role
    ]);

    return response()->json([
      'message' => 'Admin user created successfully',
      'user' => $admin,
    ], 201);
  }
}
