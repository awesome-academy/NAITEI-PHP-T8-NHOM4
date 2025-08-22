<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use App\Services\CartService;
use App\Services\ShippingService;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use App\Http\Requests\CheckoutRequest;
use App\Models\Order;
use App\Models\OrderDetail;
use App\Models\CartItem;
use App\Exceptions\QuantityException;
use Illuminate\Http\Request;

class BillingController extends Controller
{
    protected $cartService;
    protected $shippingService;
    const TAX_RATE = 0.1; // 10% tax rate

    public function __construct(CartService $cartService, ShippingService $shippingService)
    {
        $this->cartService = $cartService;
        $this->shippingService = $shippingService;
    }

    public function index()
    {
        $cartData = $this->cartService->getCartItems();
        if (!$cartData || empty($cartData['items'])) {
            return back()->withErrors([
                'cart' => 'Your cart is empty or not available. Please add items first.'
            ]);
        }

        // Transform for frontend (include price * quantity)
        $orderItems = collect($cartData['items'])->map(function ($item) {
            return [
                'id'         => $item['id'],
                'product_id' => $item['product_id'],
                'name'       => $item['name'],
                'price'      => $item['price'],
                'quantity'   => $item['quantity'],
                'image'      => $item['image'],
                'total'      => $item['price'] * $item['quantity'],
            ];
        });

        $latestOrder = Order::where('user_id', Auth::id())
            ->latest()
            ->first();

        $prefill = [
            'first_name'  => $latestOrder->first_name ?? '',
            'last_name'   => $latestOrder->last_name ?? '',
            'email'       => $latestOrder->email ?? '',
            'phone'       => $latestOrder->phone ?? '',
            'address'     => $latestOrder->address ?? '',
            'city'        => $latestOrder->city ?? '',
            'state'       => $latestOrder->state ?? '',
            'postal_code' => $latestOrder->postal_code ?? '',
            'country'     => $latestOrder->country ?? ShippingService::DEFAULT_COUNTRY,
        ];

        $shipping = $this->shippingService->calculate($orderItems->toArray(), $prefill['country']);

        return Inertia::render('User/Checkout', [
            'orderItems' => $orderItems,
            'tax'        => $orderItems->sum('total') * self::TAX_RATE,
            'shipping'   => $shipping,
            'prefill'    => $prefill,
        ]);
    }

    public function store(CheckoutRequest $request)
    {
        $user = Auth::user();
        $cartItems = CartItem::with('product')
            ->where('cart_id', $user->cart->id)
            ->get();

        if ($cartItems->isEmpty()) {
            return back()->withErrors([
                'cart' => 'Your cart is empty. Please add items before checking out.'
            ]);
        }

        $validated = $request->validated();

        DB::beginTransaction();
        try {
            $subtotal = $cartItems->sum(fn($item) => $item->product->price * $item->quantity);
            $tax      = $subtotal * self::TAX_RATE;

            // Build items for shipping calculation
            $shippingItems = $cartItems->map(function ($item) {
                return [
                    'price'    => $item->product->price,
                    'quantity' => $item->quantity,
                ];
            });

            $shipping   = $this->shippingService->calculate($shippingItems, $validated['country']);
            $grandTotal = $subtotal + $tax + $shipping;

            $order = Order::create([
                'user_id'        => $user->id,
                'first_name'     => $validated['first_name'],
                'last_name'      => $validated['last_name'],
                'email'          => $validated['email'],
                'phone'          => $validated['phone'],
                'address'        => $validated['address'],
                'city'           => $validated['city'] ?: '',
                'state'          => $validated['state'] ?: '',
                'postal_code'    => $validated['postal_code'] ?: '',
                'country'        => $validated['country'],
                'total_amount'   => $grandTotal,
                'status'         => 'pending',
                'payment_method' => $validated['payment_method'],
                'tax'            => $tax,
                'shipping_fee'   => $shipping,
            ]);

            foreach ($cartItems as $item) {
                $product = $item->product;

                if ($item->quantity > $product->stock_quantity) {
                    throw new QuantityException(
                        "Sorry, only {$product->stock_quantity} of {$product->name} left in stock."
                    );
                }

                $product->decrement('stock_quantity', $item->quantity);

                OrderDetail::create([
                    'order_id'      => $order->id,
                    'product_id'    => $product->id,
                    'quantity'      => $item->quantity,
                    'product_name'  => $product->name,
                    'product_price' => $product->price,
                ]);
            }

            // Clear the cart
            CartItem::where('cart_id', $user->cart->id)->delete();

            DB::commit();

            return redirect()->route('home')->with('success', 'Your order has been placed successfully!');
        } catch (QuantityException $e) {
            DB::rollBack();
            return back()->withErrors([
                'checkout' => $e->getMessage()
            ]);
        } catch (\Exception $e) {
            DB::rollBack();
            return back()->withErrors([
                'checkout' => 'Checkout failed due to a system error. Please try again later.'
            ]);
        }
    }

    public function calculateShipping(Request $request)
    {
        $items = $request->input('items', []);
        $country = $request->input('country', 'Vietnam');

        $shipping = $this->shippingService->calculate($items, $country);

        return response()->json([
            'shipping' => $shipping,
        ]);
    }
}
