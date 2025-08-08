<?php

namespace App\Http\Controllers\User;

use Inertia\Inertia;
use App\Models\Product;
use App\Http\Controllers\Controller;

class HomeController extends Controller
{
    public function index()
    {
        $newArrivals = [
            [
                'id' => 1,
                'name' => 'Adventure Lamp',
                'category' => 'Lighting',
                'price' => 89,
                'main_image' => 'https://imgs.search.brave.com/tusm0Q9LI2maiLW9zTNZiz1QluCFh6HIjD05SSewSmQ/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9zLmFs/aWNkbi5jb20vQHNj/MDQva2YvSDFjYmE2/NDE0YmEwYTQ3NDNh/ODc0NzQ0OTA2YmNl/MzBkRi5qcGdfMzAw/eDMwMC5qcGc'
            ],
            [
                'id' => 2,
                'name' => 'Succulent',
                'category' => 'Decoration',
                'price' => 14,
                'main_image' => 'https://imgs.search.brave.com/tusm0Q9LI2maiLW9zTNZiz1QluCFh6HIjD05SSewSmQ/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9zLmFs/aWNkbi5jb20vQHNj/MDQva2YvSDFjYmE2/NDE0YmEwYTQ3NDNh/ODc0NzQ0OTA2YmNl/MzBkRi5qcGdfMzAw/eDMwMC5qcGc'
            ],
            [
                'id' => 3,
                'name' => 'Cozy Sofa',
                'category' => 'Furniture',
                'price' => 599,
                'main_image' => 'https://imgs.search.brave.com/tusm0Q9LI2maiLW9zTNZiz1QluCFh6HIjD05SSewSmQ/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9zLmFs/aWNkbi5jb20vQHNj/MDQva2YvSDFjYmE2/NDE0YmEwYTQ3NDNh/ODc0NzQ0OTA2YmNl/MzBkRi5qcGdfMzAw/eDMwMC5qcGc'
            ],
            [
                'id' => 4,
                'name' => 'Awesome Candle',
                'category' => 'Lighting',
                'price' => 23,
                'main_image' => 'https://imgs.search.brave.com/tusm0Q9LI2maiLW9zTNZiz1QluCFh6HIjD05SSewSmQ/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9zLmFs/aWNkbi5jb20vQHNj/MDQva2YvSDFjYmE2/NDE0YmEwYTQ3NDNh/ODc0NzQ0OTA2YmNl/MzBkRi5qcGdfMzAw/eDMwMC5qcGc'
            ],
            [
                'id' => 5,
                'name' => 'Fancy Chair',
                'category' => 'Furniture',
                'price' => 245,
                'main_image' => 'https://imgs.search.brave.com/tusm0Q9LI2maiLW9zTNZiz1QluCFh6HIjD05SSewSmQ/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9zLmFs/aWNkbi5jb20vQHNj/MDQva2YvSDFjYmE2/NDE0YmEwYTQ3NDNh/ODc0NzQ0OTA2YmNl/MzBkRi5qcGdfMzAw/eDMwMC5qcGc'
            ],
            [
                'id' => 6,
                'name' => 'Chinese Teapot',
                'category' => 'Tableware',
                'price' => 56,
                'main_image' => 'https://imgs.search.brave.com/tusm0Q9LI2maiLW9zTNZiz1QluCFh6HIjD05SSewSmQ/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9zLmFs/aWNkbi5jb20vQHNj/MDQva2YvSDFjYmE2/NDE0YmEwYTQ3NDNh/ODc0NzQ0OTA2YmNl/MzBkRi5qcGdfMzAw/eDMwMC5qcGc'
            ],
            [
                'id' => 7,
                'name' => 'Soft Pillow',
                'category' => 'Bedding',
                'price' => 28,
                'main_image' => 'https://imgs.search.brave.com/tusm0Q9LI2maiLW9zTNZiz1QluCFh6HIjD05SSewSmQ/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9zLmFs/aWNkbi5jb20vQHNj/MDQva2YvSDFjYmE2/NDE0YmEwYTQ3NDNh/ODc0NzQ0OTA2YmNl/MzBkRi5qcGdfMzAw/eDMwMC5qcGc'
            ],
            [
                'id' => 8,
                'name' => 'Wooden Basket',
                'category' => 'Storage',
                'price' => 45,
                'main_image' => 'https://imgs.search.brave.com/tusm0Q9LI2maiLW9zTNZiz1QluCFh6HIjD05SSewSmQ/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9zLmFs/aWNkbi5jb20vQHNj/MDQva2YvSDFjYmE2/NDE0YmEwYTQ3NDNh/ODc0NzQ0OTA2YmNl/MzBkRi5qcGdfMzAw/eDMwMC5qcGc'
            ],
            [
                'id' => 9,
                'name' => 'Awesome Armchair',
                'category' => 'Furniture',
                'price' => 389,
                'main_image' => 'https://imgs.search.brave.com/tusm0Q9LI2maiLW9zTNZiz1QluCFh6HIjD05SSewSmQ/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9zLmFs/aWNkbi5jb20vQHNj/MDQva2YvSDFjYmE2/NDE0YmEwYTQ3NDNh/ODc0NzQ0OTA2YmNl/MzBkRi5qcGdfMzAw/eDMwMC5qcGc'
            ]
        ];

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

        $topSellingProducts = [
            [
                'id' => 1,
                'name' => 'Spring Chair',
                'category' => 'Chairs',
                'main_image' => 'https://imgs.search.brave.com/tusm0Q9LI2maiLW9zTNZiz1QluCFh6HIjD05SSewSmQ/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9zLmFs/aWNkbi5jb20vQHNj/MDQva2YvSDFjYmE2/NDE0YmEwYTQ3NDNh/ODc0NzQ0OTA2YmNl/MzBkRi5qcGdfMzAw/eDMwMC5qcGc',
                'slug' => 'spring-chair',
            ],
            [
                'id' => 2,
                'name' => 'Modern Chair',
                'category' => 'Chairs',
                'main_image' => 'https://imgs.search.brave.com/tusm0Q9LI2maiLW9zTNZiz1QluCFh6HIjD05SSewSmQ/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9zLmFs/aWNkbi5jb20vQHNj/MDQva2YvSDFjYmE2/NDE0YmEwYTQ3NDNh/ODc0NzQ0OTA2YmNl/MzBkRi5qcGdfMzAw/eDMwMC5qcGc',
                'slug' => 'modern-chair',
            ],
            [
                'id' => 3,
                'name' => 'Table Lamp',
                'category' => 'Lighting',
                'main_image' => 'https://imgs.search.brave.com/tusm0Q9LI2maiLW9zTNZiz1QluCFh6HIjD05SSewSmQ/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9zLmFs/aWNkbi5jb20vQHNj/MDQva2YvSDFjYmE2/NDE0YmEwYTQ3NDNh/ODc0NzQ0OTA2YmNl/MzBkRi5qcGdfMzAw/eDMwMC5qcGc',
                'slug' => 'table-lamp',
            ],
            [
                'id' => 4,
                'name' => 'Plants & Pots',
                'category' => 'Decor',
                'main_image' => 'https://imgs.search.brave.com/tusm0Q9LI2maiLW9zTNZiz1QluCFh6HIjD05SSewSmQ/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9zLmFs/aWNkbi5jb20vQHNj/MDQva2YvSDFjYmE2/NDE0YmEwYTQ3NDNh/ODc0NzQ0OTA2YmNl/MzBkRi5qcGdfMzAw/eDMwMC5qcGc',
                'slug' => 'plants-pots',
            ],
            [
                'id' => 5,
                'name' => 'Home Accessories',
                'category' => 'Featured',
                'main_image' => 'https://imgs.search.brave.com/tusm0Q9LI2maiLW9zTNZiz1QluCFh6HIjD05SSewSmQ/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9zLmFs/aWNkbi5jb20vQHNj/MDQva2YvSDFjYmE2/NDE0YmEwYTQ3NDNh/ODc0NzQ0OTA2YmNl/MzBkRi5qcGdfMzAw/eDMwMC5qcGc',
                'slug' => 'home-accessories',
            ],
        ];


        return Inertia::render('User/Home', [
            'newArrivals' => $newArrivals,
            'topSellingProducts' => $topSellingProducts,
            'banners' => $banners,
        ]);
    }
}