<?php

use App\Http\Controllers\Admin\ProductController;
use App\Http\Controllers\Admin\AdminController;
use App\Http\Controllers\ImageController;
use Illuminate\Support\Facades\Route;

// Admin Routes
Route::prefix('admin')->middleware(['auth'])->group(function () {
    Route::get('/dashboard', [AdminController::class, 'dashboard'])->name('admin.dashboard');
    
    // Users Management
    Route::get('/users', [AdminController::class, 'users'])->name('admin.users.index');
    
    // Products Management
    Route::get('/products', [AdminController::class, 'products'])->name('admin.products.index');

    // Categories Management
    Route::get('/categories', [AdminController::class, 'categories'])->name('admin.categories.index');
    
    // Orders Management
    Route::get('/orders', [AdminController::class, 'orders'])->name('admin.orders.index');
    
    // Feedback Management
    Route::get('/feedback', [AdminController::class, 'feedback'])->name('admin.feedback.index');
    
    // Analytics
    Route::get('/analytics', [AdminController::class, 'analytics'])->name('admin.analytics.index');
    
    // Settings
    Route::get('/settings', [AdminController::class, 'settings'])->name('admin.settings.index');
});
