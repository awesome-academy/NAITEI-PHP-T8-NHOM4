<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Model;

class Feedback extends Model
{
    use HasFactory;

    protected $table = 'feedbacks';

    protected $fillable = [
        'order_detail_id',
        'rating',
        'feedback',
    ];

    protected $casts = [
        'rating' => 'integer',
    ];

    // Relationships
    public function orderDetail(): BelongsTo
    {
        return $this->belongsTo(OrderDetail::class);
    }

    public function images(): HasMany
    {
        return $this->hasMany(Image::class, 'path_id')->where('image_type', 'feedback');
    }
}
