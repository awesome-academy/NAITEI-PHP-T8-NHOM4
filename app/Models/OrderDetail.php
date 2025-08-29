<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Model;

/**
 * @OA\Schema(
 *     schema="OrderDetail",
 *     type="object",
 *     title="Order Detail Model",
 *     description="Represents a single item within an order",
 *     @OA\Property(property="id", type="integer", example=1),
 *     @OA\Property(property="order_id", type="integer", example=1),
 *     @OA\Property(property="product_id", type="integer", example=10),
 *     @OA\Property(property="quantity", type="integer", example=2),
 *     @OA\Property(property="product_price", type="number", format="float", example=49.99, description="Price of the product at the time of order"),
 *     @OA\Property(property="product_name", type="string", example="Awesome T-Shirt", description="Name of the product at the time of order"),
 *     @OA\Property(property="product", type="object", ref="#/components/schemas/Product")
 * )
 */
class OrderDetail extends Model
{
    use HasFactory;

    protected $fillable = [
        'order_id',
        'product_id',
        'quantity',
        'product_price',
        'product_name',
    ];

    // Relationships
    public function order(): BelongsTo
    {
        return $this->belongsTo(Order::class);
    }

    public function product(): BelongsTo
    {
        return $this->belongsTo(Product::class);
    }

    public function feedbacks(): HasMany
    {
        return $this->hasMany(Feedback::class);
    }
}
