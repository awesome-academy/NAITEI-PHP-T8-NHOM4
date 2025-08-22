<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('cart_items', function (Blueprint $table) {
            // Drop the old foreign key constraint first
            $table->dropForeign(['product_id']);

            // Make product_id nullable
            $table->unsignedBigInteger('product_id')->nullable()->change();

            // Re-add foreign key with nullOnDelete
            $table->foreign('product_id')
                ->references('id')->on('products')
                ->nullOnDelete();
        });
    }

    public function down(): void
    {
        Schema::table('cart_items', function (Blueprint $table) {
            // Drop the foreign key with nullOnDelete
            $table->dropForeign(['product_id']);

            // Revert product_id to NOT NULL
            $table->unsignedBigInteger('product_id')->nullable(false)->change();

            // Re-add foreign key with cascade delete (original state)
            $table->foreign('product_id')
                ->references('id')->on('products')
                ->cascadeOnDelete();
        });
    }
};
