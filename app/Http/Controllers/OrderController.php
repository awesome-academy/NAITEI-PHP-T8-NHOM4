<?php

namespace App\Http\Controllers;

use App\Models\Order;
use App\Http\Controllers\Admin\OrderDetailController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;

class OrderController extends Controller
{
    protected $orderDetailController;

    public function __construct(OrderDetailController $orderDetailController)
    {
        $this->orderDetailController = $orderDetailController;
    }

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
            ->with(['orderDetails'])
            ->firstOrFail();

        // Map order details to use stored product_name and product_price
        $order->order_details = $order->orderDetails->map(function ($detail) {
            return [
                'id'            => $detail->id,
                'product_id'    => $detail->product_id,
                'quantity'      => $detail->quantity,
                'product_name'  => $detail->product_name, // Use stored product name
                'product_price' => $detail->product_price, // Use stored product price
                'image'         => $detail->product?->images?->first()
                                    ? asset($detail->product?->images?->first()->image_path)
                                    : 'https://via.placeholder.com/150', // fallback if no image
            ];
        });

        return Inertia::render('User/OrderDetail', [
            'order' => $order,
        ]);
    }

    public function cancel(Request $request, $orderId)
    {
        $order = Order::where('id', $orderId)
            ->where('user_id', Auth::id())
            ->with('orderDetails')
            ->firstOrFail();

        // Chỉ cho phép cancel khi order ở trạng thái pending
        if ($order->status !== 'pending') {
            return back()->withErrors([
                'message' => 'You can only cancel orders with "Pending" status'
            ]);
        }

        // Cập nhật trạng thái order thành canceled
        $order->update(['status' => 'canceled']);

        // Trả lại stock cho từng sản phẩm trong order
        $this->orderDetailController->restoreStockForOrder($order);

        return back()->with('success', 'Order has been cancelled successfully. Product quantities have been restored.');
    }
}
