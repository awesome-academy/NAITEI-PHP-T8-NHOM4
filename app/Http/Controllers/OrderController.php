<?php

namespace App\Http\Controllers;

use App\Models\Order;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;

class OrderController extends Controller
{

    public function history(Request $request): Response
    {
        $sortBy = $request->get('sort', 'newest');

        $orderDirection = $sortBy === 'oldest' ? 'asc' : 'desc';

        $orders = Order::where('user_id', Auth::id())
            ->withCount('orderDetails')
            ->orderBy('created_at', $orderDirection)
            ->paginate(10);

        $orders->getCollection()->transform(function ($order) {
            $order->items_count = $order->order_details_count;
            return $order;
        });

        return Inertia::render('User/OrderHistory', [
            'orders' => $orders,
            'currentSort' => $sortBy,
        ]);
    }


    public function show($orderId): Response
    {
        $order = Order::where('id', $orderId)
            ->where('user_id', Auth::id())
            ->with(['orderDetails.product.images'])
            ->firstOrFail();

        return Inertia::render('User/OrderDetail', [
            'order' => $order,
        ]);
    }
}
