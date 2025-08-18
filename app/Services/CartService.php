<?php

namespace App\Services;

use Illuminate\Support\Facades\Auth;
use App\Models\Cart;
use App\Models\CartItem;

class CartService
{
    /**
     * Get cart items for the current user.
     *
     * @param  int  $limit  Limit number of items in the array (0 = no limit)
     * @return array
     */
    public function getCartItems(int $limit = 0): array
    {
        $userId = Auth::id();
        if (!$userId) {
            return [
                'count' => 0,
                'items' => [],
            ];
        }

        $cart = Cart::with('cartItems.product.images')
            ->where('user_id', $userId)
            ->first();

        if (!$cart) {
            return [
                'count' => 0,
                'items' => [],
            ];
        }

        $allItems = $cart->cartItems;
        $totalCount = $allItems->count();

        if ($limit > 0) {
            $allItems = $allItems->take($limit);
        }

        $mappedItems = $allItems->map(function ($item) {
            return [
                'id'         => $item->id,
                'product_id' => $item->product_id,
                'quantity'   => $item->quantity,
                'name'       => $item->product->name ?? null,
                'price'      => $item->product->price ?? null,
                'image'      => $item->product->images->first()->image_path ?? null,
            ];
        })->toArray();

        return [
            'count' => $totalCount,
            'items' => $mappedItems,
        ];
    }

    /**
     * Add item to cart
     */
    public function addToCart(int $productId, int $quantity = 1): CartItem
    {
        $userId = Auth::id();
        if (!$userId) {
            throw new \Exception('User not authenticated');
        }

        $cart = Cart::firstOrCreate(
            ['user_id' => $userId],
            ['created_at' => now(), 'updated_at' => now()]
        );

        $cartItem = CartItem::where('cart_id', $cart->id)
            ->where('product_id', $productId)
            ->first();

        if ($cartItem) {
            $cartItem->quantity += $quantity;
            $cartItem->touch();
            $cartItem->save();
        } else {
            $cartItem = CartItem::create([
                'cart_id'    => $cart->id,
                'product_id' => $productId,
                'quantity'   => $quantity,
            ]);
        }

        return $cartItem;
    }

    /**
     * Update item quantity in cart
     */
    public function updateCartItem(int $itemId, int $quantity): ?CartItem
    {
        $userId = Auth::id();
        if (!$userId) {
            throw new \Exception('User not authenticated');
        }

        $cart = Cart::where('user_id', $userId)->first();
        if (!$cart) {
            return null;
        }

        $cartItem = CartItem::where('cart_id', $cart->id)
            ->where('id', $itemId)
            ->first();

        if (!$cartItem) {
            return null;
        }

        if ($quantity <= 0) {
            $cartItem->delete();
            return null;
        }

        $cartItem->quantity = $quantity;
        $cartItem->touch();
        $cartItem->save();

        return $cartItem;
    }

    /**
     * Delete item from cart
     */
    public function removeCartItem(int $itemId): bool
    {
        $userId = Auth::id();
        if (!$userId) {
            throw new \Exception('User not authenticated');
        }

        $cart = Cart::where('user_id', $userId)->first();
        if (!$cart) {
            return false;
        }

        $cartItem = CartItem::where('cart_id', $cart->id)
            ->where('id', $itemId)
            ->first();

        if (!$cartItem) {
            return false;
        }

        return (bool) $cartItem->delete();
    }
}
