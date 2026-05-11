<?php

namespace App\Domains\Account\Http\Controllers;

use App\Domains\Account\Models\UserAddress;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class UserAddressController extends Controller
{
  public function index(Request $request)
  {
    $addresses = UserAddress::where('user_id', $request->user()->id)
      ->orderByDesc('is_default')
      ->get();

    return response()->json(['data' => $addresses, 'success' => true]);
  }

  public function store(Request $request)
  {
    $validated = $request->validate([
      'type' => 'nullable|string|max:50',
      'country' => 'required|string|max:100',
      'state' => 'nullable|string|max:100',
      'city' => 'required|string|max:100',
      'postal_code' => 'nullable|string|max:30',
      'address_line_1' => 'required|string|max:255',
      'address_line_2' => 'nullable|string|max:255',
      'is_default' => 'nullable|boolean',
    ]);

    $userId = $request->user()->id;

    if (!empty($validated['is_default'])) {
      UserAddress::where('user_id', $userId)->update(['is_default' => false]);
    }

    $address = UserAddress::create(array_merge($validated, [
      'user_id' => $userId,
      'type' => $validated['type'] ?? 'shipping',
      'is_default' => (bool) ($validated['is_default'] ?? false),
    ]));

    return response()->json(['data' => $address, 'success' => true], 201);
  }

  public function destroy(Request $request, UserAddress $address)
  {
    if ($address->user_id !== $request->user()->id) {
      abort(403);
    }

    $address->delete();

    return response()->json(['success' => true]);
  }
}
