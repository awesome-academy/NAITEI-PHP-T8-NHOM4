<?php

namespace App\Http\Controllers\User;

use Inertia\Inertia;
use App\Models\Product;
use App\Http\Controllers\Controller;

class HomeController extends Controller
{
    public function index()
    {
        $data = collect(Product::with(['category', 'images'])->orderBy('created_at', 'desc')->limit(9)->get());
        $newArrivals = $data->map(function ($product) {
            return [
                'id' => $product->id,
                'name' => $product->name,
                'category' => $product->category->name ?? null,
                'price' => (float) $product->price,
                'main_image' => optional($product->images->first())->image_path
                    ? asset($product->images->first()->image_path)
                    : null,
            ];
        });

        $topSellingData = Product::with(['category', 'images'])
            ->withCount('orderDetails')
            ->orderByDesc('order_details_count')
            ->limit(5)
            ->get();

        $topSellingProducts = $topSellingData->map(function ($product) {
            return [
                'id' => $product->id,
                'name' => $product->name,
                'category' => $product->category->name ?? null,
                'main_image' => optional($product->images->first())->image_path
                    ? asset($product->images->first()->image_path)
                    : null,
                'slug' => $product->slug ?? null,
            ];
        });

        $banners = [
            [
                'id' => 1,
                'title' => "THE GOOD STUFF",
                'subtitle' => "get all",
                'description' => "Only the finest for your home. Our carefully curated collection brings together the most beautiful furniture and decor pieces.",
                'main_image' => "https://flatlogic-ecommerce.herokuapp.com/_next/static/media/first_hero.75de4ecf.jpg",
            ],
            [
                'id' => 2,
                'title' => "COMFORT REDEFINED",
                'subtitle' => "exclusive",
                'description' => "Discover plush sofas, elegant lighting, and modern aesthetics tailored for your lifestyle.",
                'main_image' => "https://flatlogic-ecommerce.herokuapp.com/_next/static/media/second_hero.38c4aaa1.jpg",
            ],
            [
                'id' => 3,
                'title' => "ELEVATE YOUR SPACE",
                'subtitle' => "handpicked",
                'description' => "Handcrafted decor that tells a story. Find the perfect accent to complete your room.",
                'main_image' => "https://flatlogic-ecommerce.herokuapp.com/_next/static/media/bg.787edb6a.png",
            ],
        ];


        return Inertia::render('User/Home', [
            'newArrivals' => $newArrivals,
            'topSellingProducts' => $topSellingProducts,
            'banners' => $banners,
        ]);
    }
}