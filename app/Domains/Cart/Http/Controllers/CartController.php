<?php

namespace App\Domains\Cart\Http\Controllers;

use App\Domains\Cart\Actions\AddToCart;
use App\Domains\Cart\Actions\GetOrCreateActiveCart;
use App\Domains\Cart\Actions\RecalculateCartTotals;
use App\Domains\Cart\Actions\RemoveFromCart;
use App\Domains\Cart\Actions\UpdateCartItem;
use App\Domains\Cart\Http\Requests\AddCartItemRequest;
use App\Domains\Cart\Http\Requests\CheckoutCartRequest;
use App\Domains\Cart\Http\Requests\UpdateCartItemRequest;
use App\Domains\Cart\Models\CartItem;
use App\Domains\Orders\Actions\CreateOrderFromCart;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;

class CartController extends Controller
{
  public function page(Request $request)
  {
    $cart = app(GetOrCreateActiveCart::class)->handle($request->user());
    $cart->load('items.product', 'items.variant.images', 'items.variant.inventory');
    $cart = app(RecalculateCartTotals::class)->handle($cart);

    $addresses = \App\Domains\Account\Models\UserAddress::where('user_id', $request->user()->id)
      ->orderByDesc('is_default')
      ->get();

    return Inertia::render('Customer/Cart', [
      'cart' => $cart,
      'addresses' => $addresses,
    ]);
  }

  public function show(Request $request)
  {
    $cart = app(GetOrCreateActiveCart::class)->handle($request->user());
    $cart->load('items.product', 'items.variant.images', 'items.variant.inventory');
    $cart = app(RecalculateCartTotals::class)->handle($cart);

    return response()->json([
      'data' => $cart,
      'success' => true,
    ]);
  }

  public function addItem(AddCartItemRequest $request)
  {
    $validated = $request->validated();
    $cart = app(GetOrCreateActiveCart::class)->handle($request->user());

    app(AddToCart::class)->handle([
      'cart_id' => $cart->id,
      'variant_id' => $validated['variant_id'],
      'quantity' => $validated['quantity'],
    ]);

    $cart->load('items.product', 'items.variant.images', 'items.variant.inventory');
    $cart = app(RecalculateCartTotals::class)->handle($cart);

    return response()->json([
      'data' => $cart,
      'success' => true,
    ], 201);
  }

  public function updateItem(UpdateCartItemRequest $request, CartItem $cartItem)
  {
    if ($cartItem->cart?->user_id !== $request->user()->id) {
      abort(403);
    }

    $validated = $request->validated();
    app(UpdateCartItem::class)->handle($cartItem, $validated['quantity']);

    $cart = $cartItem->cart()->firstOrFail();
    $cart->load('items.product', 'items.variant.images', 'items.variant.inventory');
    $cart = app(RecalculateCartTotals::class)->handle($cart);

    return response()->json([
      'data' => $cart,
      'success' => true,
    ]);
  }

  public function removeItem(Request $request, CartItem $cartItem)
  {
    if ($cartItem->cart?->user_id !== $request->user()->id) {
      abort(403);
    }

    $cart = $cartItem->cart()->firstOrFail();
    app(RemoveFromCart::class)->handle($cartItem);

    $cart->load('items.product', 'items.variant.images', 'items.variant.inventory');
    $cart = app(RecalculateCartTotals::class)->handle($cart);

    return response()->json([
      'data' => $cart,
      'success' => true,
    ]);
  }

  public function checkout(CheckoutCartRequest $request)
  {
    $validated = $request->validated();
    $cart = app(GetOrCreateActiveCart::class)->handle($request->user());

    $result = app(CreateOrderFromCart::class)->handle($request->user(), $cart, $validated['shipping_address_id']);

    return response()->json([
      'data' => $result,
      'success' => true,
    ], 201);
  }
}

