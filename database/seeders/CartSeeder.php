<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use App\Models\Cart;

class CartSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Fetch all users
        $users = User::all();

        foreach ($users as $user) {
            if (!Cart::where('user_id', $user->id)->exists()) {
                Cart::create([
                    'user_id' => $user->id,
                ]);
            }
        }
    }
}
