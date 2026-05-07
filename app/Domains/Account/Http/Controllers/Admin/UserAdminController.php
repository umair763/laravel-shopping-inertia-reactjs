<?php

namespace App\Domains\Account\Http\Controllers\Admin;

use App\Domains\Account\Actions\Admin\ListUsers;
use App\Domains\Account\Actions\RegisterUser;
use App\Domains\Account\Http\Requests\Admin\CreateUserRequest;
use App\Domains\Account\Models\User;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class UserAdminController extends Controller
{
  public function index(Request $request)
  {
    $users = app(ListUsers::class)->handle($request->get('role'));

    return response()->json([
      'data' => $users,
      'success' => true,
    ]);
  }

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
}

