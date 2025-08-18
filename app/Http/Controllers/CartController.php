<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use App\Services\CartService;

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
}
