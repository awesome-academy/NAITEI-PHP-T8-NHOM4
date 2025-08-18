<?php

use App\Http\Controllers\Admin\ProductController;
use App\Http\Controllers\Admin\AdminController;
use App\Http\Controllers\Admin\OrderController;
use App\Http\Controllers\ImageController;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Admin\CategoryController;

// Admin Routes
Route::prefix('admin')->middleware(['auth', 'can:is-admin'])->group(function () {
    Route::get('/dashboard', [AdminController::class, 'dashboard'])->name('admin.dashboard');

    // Users Management
    Route::get('/users', [AdminController::class, 'users'])->name('admin.users.index');

    // Products Management
    Route::get('/products', [ProductController::class, 'index'])->name('admin.products.index');
    Route::get('/products/create', [ProductController::class, 'create'])->name('admin.products.create');
    Route::post('/products', [ProductController::class, 'store'])->name('admin.products.store');
    Route::get('/products/{product}', [ProductController::class, 'show'])->name('admin.products.show');
    Route::get('/products/{product}/edit', [ProductController::class, 'edit'])->name('admin.products.edit');
    Route::put('/products/{product}', [ProductController::class, 'update'])->name('admin.products.update');
    Route::post('/products/{product}', [ProductController::class, 'update']);
    Route::delete('/products/{product}', [ProductController::class, 'destroy'])->name('admin.products.destroy');
    Route::delete('/products/{product}/images/{image}', [ProductController::class, 'destroyProductImage'])->name('admin.products.images.destroy');


    // Categories Management (Manual Routes)

    Route::get('/categories', [CategoryController::class, 'index'])->name('admin.categories.index');

    Route::get('/categories/create', [CategoryController::class, 'create'])->name('admin.categories.create');

    Route::post('/categories', [CategoryController::class, 'store'])->name('admin.categories.store');

    Route::get('/categories/{category}', [CategoryController::class, 'show'])->name('admin.categories.show');

    Route::get('/categories/{category}/edit', [CategoryController::class, 'edit'])->name('admin.categories.edit');

    Route::put('/categories/{category}', [CategoryController::class, 'update'])->name('admin.categories.update');

    Route::delete('/categories/{category}', [CategoryController::class, 'destroy'])->name('admin.categories.destroy');



    // Orders Management
    Route::get('/orders', [OrderController::class, 'index'])->name('admin.orders.index');
    Route::get('/orders/create', [OrderController::class, 'create'])->name('admin.orders.create');
    Route::post('/orders', [OrderController::class, 'store'])->name('admin.orders.store');
    Route::get('/orders/{order}', [OrderController::class, 'show'])->name('admin.orders.show');
    Route::get('/orders/{order}/edit', [OrderController::class, 'edit'])->name('admin.orders.edit');
    Route::put('/orders/{order}', [OrderController::class, 'update'])->name('admin.orders.update');
    Route::delete('/orders/{order}', [OrderController::class, 'destroy'])->name('admin.orders.destroy');
    
    // Feedback Management
    Route::get('/feedback', [AdminController::class, 'feedback'])->name('admin.feedback.index');

    // Analytics
    Route::get('/analytics', [AdminController::class, 'analytics'])->name('admin.analytics.index');

    // Settings
    Route::get('/settings', [AdminController::class, 'settings'])->name('admin.settings.index');
});
