<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use Inertia\Inertia; // ← make sure to import this
use App\Services\CartService;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        // Bind Repository Interface to Implementation
        $this->app->bind(
            \App\Repositories\Interfaces\ProductRepositoryInterface::class,
            \App\Repositories\ProductRepository::class
        );
        
        // Register Services
        $this->app->singleton(\App\Services\ProductService::class);
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        // Share Laravel's current locale with all Inertia pages
        Inertia::share([
            'locale' => function () {
                return app()->getLocale();
            },
        ]);

        Inertia::share('cart', function () {
            return app(CartService::class)->getCartItems(2);
        });
    }
}
