<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Model;

/**
 * @OA\Schema(
 *     schema="Product",
 *     type="object",
 *     title="Product Model",
 *     description="Represents a product in the system",
 *     @OA\Property(property="id", type="integer", example=1),
 *     @OA\Property(property="name", type="string", example="Awesome T-Shirt"),
 *     @OA\Property(property="description", type="string", nullable=true, example="A very comfortable and stylish t-shirt."),
 *     @OA\Property(property="price", type="number", format="float", example=19.99),
 *     @OA\Property(property="stock_quantity", type="integer", example=100),
 *     @OA\Property(property="category_id", type="integer", example=3),
 *     @OA\Property(property="created_at", type="string", format="date-time"),
 *     @OA\Property(property="updated_at", type="string", format="date-time"),
 *     @OA\Property(property="category", type="object", ref="#/components/schemas/Category"),
 *     @OA\Property(property="images", type="array", @OA\Items(ref="#/components/schemas/Image"))
 * )
 */
class Product extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'description',
        'price',
        'stock_quantity',
        'category_id',
    ];

    protected $casts = [
        'price' => 'decimal:2',
    ];

    // Relationships
    public function category(): BelongsTo
    {
        return $this->belongsTo(Category::class);
    }

    public function cartItems(): HasMany
    {
        return $this->hasMany(CartItem::class);
    }

    public function orderDetails(): HasMany
    {
        return $this->hasMany(OrderDetail::class);
    }

    public function orders()
    {
        return $this->hasManyThrough(
            Order::class,
            OrderDetail::class,
            'product_id',
            'id',
            'id',
            'order_id'
        );
    }

    public function feedbacks()
    {
        return $this->hasManyThrough(
            Feedback::class,
            OrderDetail::class,
            'product_id',
            'order_detail_id',
            'id',
            'id'
        );
    }

    public function images(): HasMany
    {
        return $this->hasMany(Image::class, 'path_id')->where('image_type', 'product');
    }
}
