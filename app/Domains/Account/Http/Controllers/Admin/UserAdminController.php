<?php

namespace App\Domains\Account\Http\Controllers\Admin;

use App\Domains\Account\Actions\Admin\ListUsers;
use App\Domains\Account\Actions\RegisterUser;
use App\Domains\Account\Http\Requests\Admin\CreateUserRequest;
use App\Domains\Account\Models\User;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;

class UserAdminController extends Controller
{
  /**
   * Inertia page — renders the admin users management page
   */
  public function indexPage(Request $request)
  {
    $users = app(ListUsers::class)->handle($request->get('role'));

    return Inertia::render('Admin/Users', [
      'users' => $users->map(fn (User $user) => [
        'id' => $user->id,
        'first_name' => $user->first_name,
        'last_name' => $user->last_name,
        'email' => $user->email,
        'role' => $user->role,
        'status' => $user->status ?? 'active',
        'created_at' => $user->created_at,
        'last_login_at' => $user->last_login_at ?? null,
      ]),
    ]);
  }

  /**
   * API: List all users as JSON
   */
  public function index(Request $request)
  {
    $users = app(ListUsers::class)->handle($request->get('role'));

    return response()->json([
      'data' => $users,
      'success' => true,
    ]);
  }

  /**
   * API: Create a new user
   */
  public function store(CreateUserRequest $request)
  {
    $validated = $request->validated();

    $user = app(RegisterUser::class)->handle([
      'name' => $validated['name'],
      'email' => $validated['email'],
      'password' => $validated['password'],
      'role' => $validated['role'],
    ]);

    return response()->json([
      'data' => $user,
      'success' => true,
    ], 201);
  }

  /**
   * API: Delete a user (cannot delete yourself)
   */
  public function destroy(Request $request, User $user)
  {
    if ($request->user()->id === $user->id) {
      return response()->json([
        'message' => 'You cannot delete your own account.',
        'success' => false,
      ], 403);
    }

    $user->delete();

    return response()->json([
      'message' => 'User removed successfully.',
      'success' => true,
    ]);
  }
}
