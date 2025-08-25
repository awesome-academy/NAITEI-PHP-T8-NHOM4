<?php

namespace Database\Seeders;

use App\Models\Order;
use App\Models\OrderDetail;
use App\Models\User;
use Illuminate\Database\Seeder;

class OrderSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $users = User::whereHas('role', function ($query) {
            $query->where('name', 'User');  // Sửa từ 'user' thành 'User' để khớp với RoleSeeder
        })->get();

        foreach ($users as $user) {
            Order::factory()->count(rand(1, 5))->create([
                'user_id' => $user->id,
            ])->each(function ($order) {
                $orderDetails = OrderDetail::factory()->count(rand(1, 4))->create([
                    'order_id' => $order->id,
                ]);

                $totalAmount = $orderDetails->reduce(function ($carry, $detail) {
                    return $carry + ($detail->product->price * $detail->quantity);
                }, 0);
                $order->update(['total_amount' => $totalAmount]);
            });
        }
    }
}
