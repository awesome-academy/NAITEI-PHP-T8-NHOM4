<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use App\Services\CartService;
use App\Http\Requests\AddToCartRequest;
use App\Http\Requests\CartUpdateRequest;

class CartController extends Controller
{
    protected $cartService;

    public function __construct(CartService $cartService)
    {
        $this->cartService = $cartService;
    }

    public function index()
    {
        return Inertia::render('User/ShoppingCart', [
            'cartItems' => $this->cartService->getCartItems()['items'],
        ]);
    }

    public function add(AddToCartRequest $request)
    {
        $this->cartService->addToCart(
            $request->input('product_id'),
            $request->input('quantity')
        );

        return redirect()->back()->with('success', 'Item added to cart!');
    }

    public function update(CartUpdateRequest $request, int $itemId)
    {
        $validated = $request->validated();
        $this->cartService->updateCartItem($itemId, $validated['quantity']);

        return redirect()->back()->with('success', 'Cart updated!');
    }

    public function destroy(int $itemId)
    {
        $this->cartService->removeCartItem($itemId);

        return redirect()->back()->with('success', 'Item removed from cart!');
    }
}
