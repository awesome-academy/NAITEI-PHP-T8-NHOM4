<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use App\Models\Product;

class CartItemSeeder extends Seeder
{
    public function run(): void
    {
        $productIds = Product::pluck('id')->toArray();

        $users = User::where('role_id', '!=', '1')
            ->with('cart')
            ->get();

        foreach ($users as $user) {
            if ($user->cart) {
                $count = rand(2, 5);

                $randomProductIds = collect($productIds)
                    ->shuffle()
                    ->take($count)
                    ->toArray();

                $items = [];
                foreach ($randomProductIds as $pid) {
                    $items[] = [
                        'product_id' => $pid,
                        'quantity'   => fake()->numberBetween(1, 5),
                    ];
                }

                $user->cart->cartItems()->createMany($items);
            }
        }
    }
}
