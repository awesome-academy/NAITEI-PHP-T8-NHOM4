<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\BillingController;
use App\Http\Controllers\Api\ProductApiController;
use App\Http\Controllers\Api\UserApiController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});

Route::post('/shipping/calculate', [BillingController::class, 'calculateShipping'])->name('shipping.calculate');

// Product API Routes
Route::prefix('products')->group(function () {
    // Public routes
    Route::get('/', [ProductApiController::class, 'index'])->name('api.products.index');
    Route::get('/featured', [ProductApiController::class, 'featured'])->name('api.products.featured');
    Route::get('/search', [ProductApiController::class, 'search'])->name('api.products.search');
    Route::get('/category/{categoryId}', [ProductApiController::class, 'getByCategory'])->name('api.products.by-category');
    Route::get('/{id}', [ProductApiController::class, 'show'])->name('api.products.show');
    // Protected routes (require authentication)
    Route::middleware('auth:sanctum')->group(function () {
        Route::post('/', [ProductApiController::class, 'store'])->name('api.products.store');
        Route::put('/{id}', [ProductApiController::class, 'update'])->name('api.products.update');
        Route::delete('/{id}', [ProductApiController::class, 'destroy'])->name('api.products.destroy');
    });
});

Route::prefix('admin')->middleware('auth:sanctum')->group(function () {
    Route::get('/users', [UserApiController::class, 'index'])->name('api.admin.users.index');
    Route::post('/users', [UserApiController::class, 'store'])->name('api.admin.users.store');
    Route::get('/users/{user}', [UserApiController::class, 'show'])->name('api.admin.users.show');
    Route::put('/users/{user}', [UserApiController::class, 'update'])->name('api.admin.users.update');
    Route::delete('/users/{user}', [UserApiController::class, 'destroy'])->name('api.admin.users.destroy');

    // extra route for deleting images
    Route::delete('/users/{userId}/images/{imageId}', [UserApiController::class, 'destroyUserImage'])
        ->name('api.admin.users.destroyImage');
});