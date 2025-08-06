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
        Schema::table('users', function (Blueprint $table) {
            // Thêm trường mới
            $table->string('username')->unique();
            $table->string('fname')->nullable();
            $table->string('lname')->nullable();
            $table->string('google_id')->nullable();
            $table->unsignedBigInteger('role_id')->default(2);
            // Xóa trường name
            $table->dropColumn('name');
            // Thêm khóa ngoại đến bảng roles
            $table->foreign('role_id')->references('id')->on('roles')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            // Xóa khóa ngoại trước
            $table->dropForeign(['role_id']);
            // Thêm lại trường name
            $table->string('name');
            // Xóa các trường mới
            $table->dropColumn(['username', 'fname', 'lname', 'google_id', 'role_id']);
        });
    }
};
