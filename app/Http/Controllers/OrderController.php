<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use App\Models\Order;
use Illuminate\Support\Facades\Auth;

class OrderController extends Controller
{

    public function history(): Response
    {
        $orders = Order::where('user_id', Auth::id())
            ->latest()
            ->get();

        return Inertia::render('User/OrderHistory', [
            'orders' => $orders,
        ]);
    }

    public function show($orderId): Response
    {
        $order = Order::where('id', $orderId)
            ->where('user_id', Auth::id())
            ->with('products')
            ->firstOrFail();

        return Inertia::render('User/OrderDetail', [
            'order' => $order,
        ]);
    }
}
