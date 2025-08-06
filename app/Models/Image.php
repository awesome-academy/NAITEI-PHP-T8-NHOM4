<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Model;

class Image extends Model
{
    use HasFactory;

    protected $fillable = [
        'image_type',
        'path_id',
        'image_path',
        'alt_text',
    ];

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
