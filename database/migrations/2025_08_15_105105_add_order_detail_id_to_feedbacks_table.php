<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('feedbacks', function (Blueprint $table) {
            // Thêm trường order_detail_id
            $table->unsignedBigInteger('order_detail_id')->nullable()->after('product_id');
            $table->foreign('order_detail_id')->references('id')->on('order_details')->onDelete('cascade');
        });

        // Xóa các trường cũ và foreign keys
        Schema::table('feedbacks', function (Blueprint $table) {
            $table->dropForeign(['user_id']);
            $table->dropForeign(['product_id']);
            $table->dropColumn(['user_id', 'product_id']);
        });

        // Làm cho order_detail_id không nullable
        Schema::table('feedbacks', function (Blueprint $table) {
            $table->unsignedBigInteger('order_detail_id')->nullable(false)->change();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('feedbacks', function (Blueprint $table) {
            // Thêm lại các trường cũ
            $table->unsignedBigInteger('user_id')->after('id');
            $table->unsignedBigInteger('product_id')->after('user_id');
            $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade');
            $table->foreign('product_id')->references('id')->on('products')->onDelete('cascade');
        });

        Schema::table('feedbacks', function (Blueprint $table) {
            $table->dropForeign(['order_detail_id']);
            $table->dropColumn('order_detail_id');
        });
    }
};
