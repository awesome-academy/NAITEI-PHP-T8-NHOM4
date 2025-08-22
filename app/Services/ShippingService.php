<?php

namespace App\Services;

use Illuminate\Support\Collection;

class ShippingService
{
    const DEFAULT_COUNTRY = "Vietnam";

    /**
     * Tính phí vận chuyển
     *
     * @param array|Collection $items Mỗi item phải có ['quantity', 'price']
     * @param string $country
     * @return float
     */
    public function calculate($items, string $country): float
    {
        $fee = 0;

        // Phí quốc tế
        if ($country !== self::DEFAULT_COUNTRY) {
            $fee += 15;
        }

        // Tổng số lượng sản phẩm
        $totalItems = collect($items)->sum('quantity');

        if ($totalItems <= 5) {
            $fee += 3;
        } elseif ($totalItems <= 10) {
            $fee += 5;
        } else {
            $fee += 7;
        }

        // Tổng tiền đơn hàng
        $totalAmount = collect($items)->sum(function ($item) {
            return $item['quantity'] * $item['price'];
        });

        // Phí đơn hàng nhỏ
        if ($totalAmount > 0 && $totalAmount < 100) {
            $fee += 5;
        }

        return $fee;
    }
}
