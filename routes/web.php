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
        return Inertia::render('Dashboard');
    })->middleware(['auth', 'verified'])->name('dashboard');

    // Profile routes (also auth-only)
    Route::middleware('auth')->group(function () {
        Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
        Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
        Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
    });

    // user route example
    // Route::get('/user/{user}', [UserController::class, 'show'])
    //     ->middleware(['auth', 'can:view,user'])
    //     ->name('user.show');

    Route::middleware(['auth', 'verified'])->group(function () {
        // Shopping Cart
        Route::get('/cart/preview', [CartController::class, 'preview'])->name('cart.preview');

        Route::get('/cart', [CartController::class, 'index'])->name('cart.index');
        Route::post('/cart/save', [CartController::class, 'save'])->name('cart.save');
        Route::post('/cart/add', [CartController::class, 'add'])->name('cart.add');
        Route::patch('/cart/{id}', [CartController::class, 'update'])->name('cart.update');
        Route::delete('/cart/{id}', [CartController::class, 'destroy'])->name('cart.destroy');
    });
});