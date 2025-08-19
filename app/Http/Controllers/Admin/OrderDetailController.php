<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\OrderDetail;
use App\Models\Order;
use App\Models\Product;

class OrderDetailController extends Controller
{
    public function store($productId, Order $order, $quantity)
    {
        $product = Product::find($productId);

        $orderDetail = OrderDetail::create([
            'order_id' => $order->id,
            'product_id' => $productId,
            'quantity' => $quantity,
        ]);
        
        $product->decrement('stock_quantity', $quantity);
        
        return $orderDetail;
    }

    public function update($newQuantity, Order $order, OrderDetail $orderDetail)
    {
        $product = $orderDetail->product;
        $oldQuantity = $orderDetail->quantity;
        $quantityDiff = $newQuantity - $oldQuantity;

        $orderDetail->update(['quantity' => $newQuantity]);

        // Update product stock
        if ($quantityDiff > 0) {
            $product->decrement('stock_quantity', $quantityDiff);
        } else {
            $product->increment('stock_quantity', abs($quantityDiff));
        }

        // Update order total
        $totalDiff = $product->price * $quantityDiff;
        if ($totalDiff > 0) {
            $order->increment('total_amount', $totalDiff);
        } else {
            $order->decrement('total_amount', abs($totalDiff));
        }

        return $orderDetail;
    }

    public function destroy(Order $order, OrderDetail $orderDetail, $skipTotalUpdate = false)
    {
        $product = $orderDetail->product;
        $quantity = $orderDetail->quantity;
        $subtotal = $product->price * $quantity;

        $product->increment('stock_quantity', $quantity);
        
        if (!$skipTotalUpdate) {
            $order->decrement('total_amount', $subtotal);
        }
        
        $orderDetail->delete();

        return true;
    }
}
