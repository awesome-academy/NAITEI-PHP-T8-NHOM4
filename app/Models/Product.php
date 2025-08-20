<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Model;

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
