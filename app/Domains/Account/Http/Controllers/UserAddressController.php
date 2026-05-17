<?php

namespace App\Domains\Account\Http\Controllers;

use App\Domains\Account\Http\Requests\AddressRequest;
use App\Domains\Account\Models\UserAddress;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class UserAddressController extends Controller
{
  public function index(Request $request)
  {
    $addresses = UserAddress::where('user_id', $request->user()->id)
      ->orderByDesc('is_default')
      ->orderByDesc('created_at')
      ->get();

    return response()->json(['data' => $addresses, 'success' => true]);
  }

  public function store(AddressRequest $request)
  {
    $validated = $request->validated();

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

  public function update(AddressRequest $request, UserAddress $address)
  {
    if ($address->user_id !== $request->user()->id) {
      abort(403);
    }

    $validated = $request->validated();

    $userId = $request->user()->id;

    if (!empty($validated['is_default'])) {
      UserAddress::where('user_id', $userId)->where('id', '!=', $address->id)->update(['is_default' => false]);
    }

    $address->update($validated);

    return response()->json(['data' => $address, 'success' => true]);
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


