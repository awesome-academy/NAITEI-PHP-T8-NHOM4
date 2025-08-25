<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\LanguageController;
use App\Http\Middleware\Localization;
use App\Http\Controllers\User\HomeController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\Auth\GoogleController;
use App\Http\Controllers\CartController;
use App\Http\Controllers\BillingController;
use App\Http\Controllers\OrderController;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

Route::middleware(Localization::class)->group(function () {
    Route::get('/auth/google/redirect', [GoogleController::class, 'redirect'])->name('auth.google.redirect');
    Route::get('/auth/google/callback', [GoogleController::class, 'callback'])->name('auth.google.callback');
    Route::get('/', [HomeController::class, 'index'])->name('home');

    Route::get('lang/{lang}', [LanguageController::class, 'changeLang'])->name('lang.change');

    Route::get('/products', [ProductController::class, 'index'])->name('products.index');
    Route::get('/products/{product}', [ProductController::class, 'show'])->name('products.show');

    require __DIR__ . '/auth.php';
    require __DIR__ . '/admin.php';

    // Dashboard (requires login)
    Route::get('/dashboard', function () {
        // SỬA ĐỔI: Kiểm tra vai trò và chuyển hướng nếu là Admin
        if (auth()->user()->role === 'Admin') {
            return redirect()->route('admin.dashboard');
        }
        return Inertia::render('Dashboard');
    })->middleware(['auth', 'verified'])->name('dashboard');

    // Profile routes (also auth-only)
    Route::middleware('auth')->group(function () {
        Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
        Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
        Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

        Route::get('/my-orders', [OrderController::class, 'history'])->name('orders.history');
        Route::get('/my-orders/{order}', [OrderController::class, 'show'])->name('orders.show');
        Route::post('/my-orders/{order}/cancel', [OrderController::class, 'cancel'])->name('orders.cancel');

        // Feedback routes
        Route::get('/feedbacks', [\App\Http\Controllers\FeedbackController::class, 'index'])->name('feedbacks.index');
        Route::post('/feedbacks', [\App\Http\Controllers\FeedbackController::class, 'store'])->name('feedbacks.store');
        Route::put('/feedbacks/{feedback}', [\App\Http\Controllers\FeedbackController::class, 'update'])->name('feedbacks.update');
        Route::delete('/feedbacks/{feedback}', [\App\Http\Controllers\FeedbackController::class, 'destroy'])->name('feedbacks.destroy');
        Route::delete('/feedbacks/images/destroy', [\App\Http\Controllers\FeedbackController::class, 'destroyImage'])->name('feedbacks.images.destroy');
    });

    Route::middleware(['auth', 'verified'])->group(function () {
        // Shopping Cart
        Route::get('/cart/preview', [CartController::class, 'preview'])->name('cart.preview');

        Route::get('/cart', [CartController::class, 'index'])->name('cart.index');
        Route::post('/cart/save', [CartController::class, 'save'])->name('cart.save');
        Route::post('/cart/add', [CartController::class, 'add'])->name('cart.add');
        Route::patch('/cart/{id}', [CartController::class, 'update'])->name('cart.update');
        Route::delete('/cart/{id}', [CartController::class, 'destroy'])->name('cart.destroy');

        Route::get('/checkout', [BillingController::class, 'index'])->name('checkout.index');
        Route::post('/checkout', [BillingController::class, 'store'])->name('checkout.store');
    });
});
