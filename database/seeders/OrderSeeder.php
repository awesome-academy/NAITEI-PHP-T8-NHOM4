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
        $this->command->info('Seeding orders...');

        // Lấy tất cả user có vai trò 'user'
        $users = User::whereHas('role', function ($query) {
            $query->where('name', 'User');  // Sửa từ 'user' thành 'User' để khớp với RoleSeeder
        })->get();

        if ($users->isEmpty()) {
            $this->command->warn('No users with "user" role found. Skipping OrderSeeder.');
            return;
        }

        // Tạo từ 1 đến 5 đơn hàng cho mỗi user
        foreach ($users as $user) {
            Order::factory()->count(rand(1, 5))->create([
                'user_id' => $user->id,
                'first_name' => $user->fname,
                'last_name' => $user->lname,
                'email' => $user->email,
            ])->each(function ($order) {
                // Tạo từ 1 đến 4 chi tiết đơn hàng
                $orderDetails = OrderDetail::factory()->count(rand(1, 4))->create([
                    'order_id' => $order->id,
                ]);

                // Tính tổng tiền từ các chi tiết đã tạo
                $totalAmount = $orderDetails->sum(function ($detail) {
                    return $detail->product_price * $detail->quantity;
                });

                // Cập nhật lại tổng tiền cho đơn hàng
                $order->update(['total_amount' => $totalAmount]);
            });
        }
        $this->command->info('Orders seeded successfully.');
    }
}
