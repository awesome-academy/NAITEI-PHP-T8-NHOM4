<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use App\Models\Category; // Make sure you have Category model for category_id

class ProductFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'name' => $this->faker->randomElement(['shirt', 'computer', 'earphone']) 
                . ' ' 
                . str_pad($this->faker->unique()->numberBetween(0, 999), 3, '0', STR_PAD_LEFT),
            'description' => $this->faker->paragraph(),
            'price' => $this->faker->randomFloat(2, 10, 1000),
            'stock_quantity' => $this->faker->numberBetween(0, 500),
            'category_id' => $this->faker->numberBetween(1, 2),
            'created_at' => now(),
            'updated_at' => now(),
        ];
    }
}
