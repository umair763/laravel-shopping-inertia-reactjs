<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Str;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;

class AuthController extends Controller
{
  /**
   * Display the user login page.
   */
  public function showUserLogin()
  {
    return Inertia::render('Auth/User/Login');
  }

  /**
   * Display the user registration page.
   */
  public function showUserRegister()
  {
    return Inertia::render('Auth/User/Register');
  }

  /**
   * Display the admin login page.
   */
  public function showAdminLogin()
  {
    return Inertia::render('Auth/Admin/Login');
  }

  /**
   * Display the admin creation page.
   */
  public function showAdminRegister()
  {
    return Inertia::render('Auth/Admin/Register', [
      'has_admins' => User::where('role', 'admin')->exists(),
    ]);
  }

  /**
   * Register a new user
   * POST /api/register
   */
  public function register(Request $request)
  {
    if ($this->isApiRequest($request)) {
      return $this->registerApi($request, 'user');
    }

    return $this->registerWithRole($request, 'user');
  }

  /**
   * Login user
   * POST /api/login
   */
  public function login(Request $request)
  {
    if ($this->isApiRequest($request)) {
      return $this->loginApi($request, 'user');
    }

    return $this->loginWithRole($request, 'user');
  }

  /**
   * Register an admin account.
   */
  public function adminRegister(Request $request)
  {
    return $this->createAdmin($request);
  }

  /**
   * Login admin.
   */
  public function adminLogin(Request $request)
  {
    if ($this->isApiRequest($request)) {
      return $this->loginApi($request, 'admin');
    }

    return $this->loginWithRole($request, 'admin');
  }

  /**
   * Logout user
   * POST /api/logout
   */
  public function logout(Request $request)
  {
    if ($this->isApiRequest($request)) {
      return $this->logoutApi($request);
    }

    Auth::logout();

    $request->session()->invalidate();
    $request->session()->regenerateToken();

    if ($request->expectsJson()) {
      return response()->json([
        'message' => 'Logged out successfully',
      ]);
    }

    return redirect()->route('home')->with('success', 'Logged out successfully');
  }

  /**
   * Get authenticated user
   * GET /api/user
   */
  public function user(Request $request)
  {
    if (!$request->user()) {
      return response()->json([
        'message' => 'Unauthenticated.',
      ], 401);
    }

    return response()->json([
      'data' => $request->user(),
      'success' => true,
    ]);
  }

  /**
   * Create a new admin (Admin only)
   * POST /api/admin/create
   */
  public function createAdmin(Request $request)
  {
    if ($this->isApiRequest($request)) {
      return $this->createAdminApi($request);
    }

    $hasAdmins = User::where('role', 'admin')->exists();

    if ($hasAdmins && (!$request->user() || !$request->user()->isAdmin())) {
      return $this->unauthorizedResponse($request, 'Unauthorized. Only admins can create admin accounts.');
    }

    return $this->registerWithRole($request, 'admin', true, !$hasAdmins);
  }

  private function registerWithRole(Request $request, string $role, bool $skipRoleGate = false, bool $authenticate = true)
  {
    if ($role === 'admin' && !$skipRoleGate) {
      $hasAdmins = User::where('role', 'admin')->exists();

      if ($hasAdmins && (!$request->user() || !$request->user()->isAdmin())) {
        return $this->unauthorizedResponse($request, 'Unauthorized. Only admins can create admin accounts.');
      }
    }

    $validated = $request->validate([
      'name' => 'required|string|max:255',
      'email' => 'required|string|email|max:255|unique:users',
      'password' => 'required|string|min:8|confirmed',
    ]);

    $user = User::create([
      'name' => $validated['name'],
      'email' => $validated['email'],
      'password' => Hash::make($validated['password']),
      'role' => $role,
    ]);

    if ($authenticate) {
      Auth::login($user);
      $request->session()->regenerate();
    }

    $message = $role === 'admin'
      ? 'Admin user created successfully'
      : 'User registered successfully';

    $redirectRoute = $role === 'admin' ? 'admin.dashboard' : 'user.home';

    return $this->successResponse($request, $message, $user, $redirectRoute, 201);
  }

  private function registerApi(Request $request, string $role)
  {
    $validated = $request->validate([
      'name' => 'required|string|max:255',
      'email' => 'required|string|email|max:255|unique:users',
      'password' => 'required|string|min:8|confirmed',
    ]);

    $user = User::create([
      'name' => $validated['name'],
      'email' => $validated['email'],
      'password' => Hash::make($validated['password']),
      'role' => $role,
    ]);

    $token = $this->issueApiToken($user);

    return response()->json([
      'message' => $role === 'admin' ? 'Admin user created successfully' : 'User registered successfully',
      'user' => $user,
      'token_type' => 'Bearer',
      'token' => $token,
    ], 201);
  }

  private function loginWithRole(Request $request, string $role)
  {
    $validated = $request->validate([
      'email' => 'required|string|email',
      'password' => 'required|string',
    ]);

    $user = User::where('email', $validated['email'])->first();

    if (!$user || !Hash::check($validated['password'], $user->password) || $user->role !== $role) {
      throw ValidationException::withMessages([
        'email' => [
          $role === 'admin'
          ? 'This admin account is not valid for the admin portal.'
          : 'The provided credentials are incorrect.',
        ],
      ]);
    }

    Auth::login($user);
    $request->session()->regenerate();

    $redirectRoute = $role === 'admin' ? 'admin.dashboard' : 'user.home';

    return $this->successResponse($request, 'Logged in successfully', $user, $redirectRoute);
  }

  private function loginApi(Request $request, string $role)
  {
    $validated = $request->validate([
      'email' => 'required|string|email',
      'password' => 'required|string',
    ]);

    $user = User::where('email', $validated['email'])->first();

    if (!$user || !Hash::check($validated['password'], $user->password) || $user->role !== $role) {
      return response()->json([
        'message' => $role === 'admin'
          ? 'This admin account is not valid for the admin portal.'
          : 'The provided credentials are incorrect.',
      ], 422);
    }

    $token = $this->issueApiToken($user);

    return response()->json([
      'message' => 'Logged in successfully',
      'user' => $user,
      'token_type' => 'Bearer',
      'token' => $token,
    ]);
  }

  private function createAdminApi(Request $request)
  {
    $hasAdmins = User::where('role', 'admin')->exists();
    $currentUser = $this->resolveApiUser($request);

    if ($hasAdmins && (!$currentUser || !$currentUser->isAdmin())) {
      return response()->json([
        'message' => 'Unauthorized. Only admins can create admin accounts.',
      ], 403);
    }

    $validated = $request->validate([
      'name' => 'required|string|max:255',
      'email' => 'required|string|email|max:255|unique:users',
      'password' => 'required|string|min:8|confirmed',
    ]);

    $user = User::create([
      'name' => $validated['name'],
      'email' => $validated['email'],
      'password' => Hash::make($validated['password']),
      'role' => 'admin',
    ]);

    $token = $this->issueApiToken($user);

    return response()->json([
      'message' => 'Admin user created successfully',
      'user' => $user,
      'token_type' => 'Bearer',
      'token' => $token,
    ], 201);
  }

  private function logoutApi(Request $request)
  {
    $user = $this->resolveApiUser($request);

    if (!$user) {
      return response()->json([
        'message' => 'Unauthenticated.',
      ], 401);
    }

    $user->forceFill(['api_token_hash' => null])->save();

    return response()->json([
      'message' => 'Logged out successfully',
    ]);
  }

  private function issueApiToken(User $user): string
  {
    $plainToken = Str::random(64);

    $user->forceFill([
      'api_token_hash' => hash('sha256', $plainToken),
    ])->save();

    return $plainToken;
  }

  private function resolveApiUser(Request $request): ?User
  {
    $token = $request->bearerToken();

    if (!$token) {
      return null;
    }

    return User::where('api_token_hash', hash('sha256', $token))->first();
  }

  private function isApiRequest(Request $request): bool
  {
    return $request->is('api/*');
  }

  private function successResponse(Request $request, string $message, User $user, string $redirectRoute, int $status = 200)
  {
    if ($request->expectsJson()) {
      return response()->json([
        'message' => $message,
        'user' => $user,
      ], $status);
    }

    return redirect()->route($redirectRoute)->with('success', $message);
  }

  private function unauthorizedResponse(Request $request, string $message)
  {
    if ($request->expectsJson()) {
      return response()->json([
        'message' => $message,
      ], 403);
    }

    return back()->withErrors([
      'email' => $message,
    ]);
  }
}
