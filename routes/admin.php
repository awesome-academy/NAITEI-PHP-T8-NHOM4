<?php

use App\Http\Controllers\Admin\ProductController;
use App\Http\Controllers\Admin\AdminController;
use App\Http\Controllers\ImageController;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Admin\CategoryController;

// Admin Routes
Route::prefix('admin')->middleware(['auth'])->group(function () {
    Route::get('/dashboard', [AdminController::class, 'dashboard'])->name('admin.dashboard');

    // Users Management
    Route::get('/users', [AdminController::class, 'users'])->name('admin.users.index');

    // Products Management
    Route::get('/products', [AdminController::class, 'products'])->name('admin.products.index');
    Route::get('/products/create', [ProductController::class, 'createProduct'])->name('admin.products.create');
    Route::post('/products', [ProductController::class, 'storeProduct'])->name('admin.products.store');
    Route::get('/products/{product}', [ProductController::class, 'showProduct'])->name('admin.products.show');
    Route::get('/products/{product}/edit', [ProductController::class, 'editProduct'])->name('admin.products.edit');
    Route::put('/products/{product}', [ProductController::class, 'updateProduct'])->name('admin.products.update');
    Route::delete('/products/{product}', [ProductController::class, 'destroyProduct'])->name('admin.products.destroy');
    Route::delete('/products/{product}/images/{image}', [ProductController::class, 'destroyProductImage'])->name('admin.products.images.destroy');

    // Categories Management
    Route::get('/categories', [AdminController::class, 'categories'])->name('admin.categories.index');

    Route::get('/categories/create', [CategoryController::class, 'create'])->name('admin.categories.create'); // form
    Route::post('/categories', [CategoryController::class, 'store'])->name('admin.categories.store');        // lưu

    // Orders Management
    Route::get('/orders', [AdminController::class, 'orders'])->name('admin.orders.index');

    // Feedback Management
    Route::get('/feedback', [AdminController::class, 'feedback'])->name('admin.feedback.index');

    // Analytics
    Route::get('/analytics', [AdminController::class, 'analytics'])->name('admin.analytics.index');

    // Settings
    Route::get('/settings', [AdminController::class, 'settings'])->name('admin.settings.index');
});
