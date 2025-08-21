<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('orders', function (Blueprint $table) {
            // Remove old unused columns
            $table->dropColumn(['recipient_name', 'recipient_phone', 'shipping_address']);

            // Add new detailed fields
            $table->string('first_name')->after('user_id');
            $table->string('last_name')->after('first_name');
            $table->string('email')->after('last_name');
            $table->string('phone')->after('email');

            // Shipping details
            $table->string('address')->after('phone');
            $table->string('city')->nullable()->after('address');
            $table->string('state')->nullable()->after('city');
            $table->string('postal_code')->nullable()->after('state');
            $table->string('country')->after('postal_code');
        });
    }

    public function down(): void
    {
        Schema::table('orders', function (Blueprint $table) {
            // Rollback: drop the new columns
            $table->dropColumn([
                'first_name', 'last_name', 'email', 'phone',
                'address', 'city',
                'state', 'postal_code', 'country',
            ]);

            // Restore the old ones
            $table->string('recipient_name')->nullable();
            $table->string('recipient_phone')->nullable();
            $table->text('shipping_address')->nullable();
        });
    }
};
