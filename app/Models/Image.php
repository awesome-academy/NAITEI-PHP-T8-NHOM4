<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Casts\Attribute;

/**
 * @OA\Schema(
 *     schema="Image",
 *     type="object",
 *     title="Image Model",
 *     @OA\Property(property="id", type="integer", example=1),
 *     @OA\Property(property="image_path", type="string", example="/storage/images/products/1.jpg"),
 *     @OA\Property(property="url", type="string", example="http://localhost:8000/storage/images/products/1.jpg")
 * )
 */
class Image extends Model
{
    use HasFactory;

    protected $fillable = [
        'image_type',
        'path_id',
        'image_path',
        'alt_text',
    ];

    protected $appends = ['url'];

    protected function url(): Attribute
    {
        return Attribute::make(
            get: fn() => asset($this->image_path),
        );
    }

    // Relationships
    public function product(): BelongsTo
    {
        return $this->belongsTo(Product::class, 'path_id');
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class, 'path_id');
    }

    public function feedback(): BelongsTo
    {
        return $this->belongsTo(Feedback::class, 'path_id');
    }
}
