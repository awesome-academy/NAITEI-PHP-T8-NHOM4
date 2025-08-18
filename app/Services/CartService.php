<?php

namespace App\Services;

use Illuminate\Support\Facades\Auth;
use App\Models\Cart;

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
}
