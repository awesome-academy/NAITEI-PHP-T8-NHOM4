<?php

namespace Database\Seeders;

use App\Models\Order;
use App\Models\OrderDetail;
use App\Models\Product;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Database\Seeder;

class TestOrderSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    const TAX_RATE = 0.1;

    public function run(): void
    {
        // Lấy users và products có sẵn
        $users = User::all();
        $products = Product::all();

        if ($users->isEmpty() || $products->isEmpty()) {
            $this->command->warn('No users or products found. Please seed users and products first.');
            return;
        }

        // Tạo orders cho hôm nay 
        $today = Carbon::today();
        $this->createOrdersForDate($today, $users, $products, 5, 'Today');

        // Tạo orders cho hôm qua  
        $yesterday = Carbon::yesterday();
        $this->createOrdersForDate($yesterday, $users, $products, 8, 'Yesterday');

        // Tạo orders cho 2 ngày trước để test thêm
        $twoDaysAgo = Carbon::today()->subDays(2);
        $this->createOrdersForDate($twoDaysAgo, $users, $products, 3, '2 days ago');
    }

    /**
     * Tạo orders cho một ngày cụ thể
     */
    private function createOrdersForDate(Carbon $date, $users, $products, int $orderCount, string $label): void
    {
        $this->command->info("Creating {$orderCount} orders for {$label} ({$date->format('Y-m-d')})...");

        for ($i = 0; $i < $orderCount; $i++) {
            $user = $users->random();
            
            // Random thời gian trong ngày
            $orderTime = $date->copy()->addHours(rand(8, 22))->addMinutes(rand(0, 59));
            
            // Tính toán giá trị order
            $subtotal = 0;
            $orderProducts = $products->random(rand(1, 4)); // 1-4 sản phẩm per order
            
            foreach ($orderProducts as $product) {
                $subtotal += $product->price * rand(1, 3); // 1-3 số lượng mỗi sản phẩm
            }
            
            $tax = $subtotal * self::TAX_RATE; // 10% thuế
            $shippingFee = rand(20000, 50000); // Phí ship từ 20k-50k
            $totalAmount = $subtotal + $tax + $shippingFee;
            
            // Tạo order
            $order = Order::create([
                'user_id' => $user->id,
                'first_name' => $user->first_name ?? 'Test',
                'last_name' => $user->last_name ?? 'User',
                'phone' => '0987654321',
                'email' => $user->email,
                'address' => '123 Test Street',
                'city' => 'Ho Chi Minh',
                'state' => 'Ho Chi Minh',
                'postal_code' => '70000',
                'country' => 'Vietnam',
                'total_amount' => $totalAmount,
                'tax' => $tax,
                'shipping_fee' => $shippingFee,
                'status' => $this->getRandomStatus(),
                'payment_method' => $this->getRandomPaymentMethod(),
                'created_at' => $orderTime,
                'updated_at' => $orderTime,
            ]);

            // Tạo order details
            foreach ($orderProducts as $product) {
                $quantity = rand(1, 3);
                OrderDetail::create([
                    'order_id' => $order->id,
                    'product_id' => $product->id,
                    'product_name' => $product->name,
                    'product_price' => $product->price,
                    'quantity' => $quantity,
                    'created_at' => $orderTime,
                    'updated_at' => $orderTime,
                ]);
            }
        }
        
        $this->command->info("✓ Created {$orderCount} orders for {$label}");
    }

    /**
     * Lấy status ngẫu nhiên
     */
    private function getRandomStatus(): string
    {
        $statuses = ['pending', 'processing', 'completed', 'canceled'];
        $weights = [20, 30, 40, 10]; // 40% completed, 30% processing, 20% pending, 10% canceled
        
        return $this->weightedRandom($statuses, $weights);
    }

    /**
     * Lấy payment method ngẫu nhiên
     */
    private function getRandomPaymentMethod(): string
    {
        $methods = ['cash', 'card'];
        return $methods[array_rand($methods)];
    }

    /**
     * Random có trọng số
     */
    private function weightedRandom(array $values, array $weights): string
    {
        $totalWeight = array_sum($weights);
        $random = rand(1, $totalWeight);
        
        $currentWeight = 0;
        foreach ($values as $index => $value) {
            $currentWeight += $weights[$index];
            if ($random <= $currentWeight) {
                return $value;
            }
        }
        
        return $values[0];
    }
}
