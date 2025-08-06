<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\LanguageController;
use App\Http\Middleware\Localization;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "web" middleware group. Make something great!
|
*/

Route::get('lang/{lang}', [LanguageController::class, 'changeLang'])->name('lang.change');

Route::middleware(Localization::class)->group(function () 
{
    Route::get('/', function () 
    {
        return view('welcome');
    });

    Route::get('/dashboard', function () 
    {
        return view('temp');
    });
});
