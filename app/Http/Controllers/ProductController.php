<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Str;

class ProductController extends Controller
{
    public function index(Request $request)
    {
        // Fake data
        $fakeProducts = collect([
            [
                'id' => 1,
                'name' => 'Laptop A',
                'category' => 'Electronics',
                'brand' => 'BrandX',
                'price' => 999.99,
                'stock_quantity' => 5,
                'reviews_count' => 12,
                'created_at' => now()->subDays(1),
                'main_image' => 'https://imgs.search.brave.com/LCl2s8C4Wi7IRTLisio1QhZVzGE4wXeA0Y3N1XZtfBw/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9zLmFs/aWNkbi5jb20vQHNj/MDQva2YvSGJmZWNm/OWM0NmIyMDQ0NGI4/MDk0NTFhMDI5ZTlk/MDRmZy5qcGdfMzAw/eDMwMC5qcGc',
                'image_gallery' => [
                    'https://images.unsplash.com/photo-1587825140708-3b4f1d2cbd67?auto=format&fit=crop&w=600&q=80',
                    'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=600&q=80',
                    'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=600&q=80',
                ],
            ],
            [
                'id' => 2,
                'name' => 'Phone B',
                'category' => 'Electronics',
                'brand' => 'BrandY',
                'price' => 599.99,
                'stock_quantity' => 0,
                'reviews_count' => 30,
                'created_at' => now()->subDays(2),
                'main_image' => 'https://imgs.search.brave.com/K8TjopIWTB6RWk7dAlOJq8Zl3yExMuTciKgCDXYw8oI/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9zLmFs/aWNkbi5jb20vQHNj/MDQva2YvSDBjNWU0/ODcwM2U2ZDRkY2Y4/NjUzMjRkMGI5NGVj/ZGIwUC5wbmdfMzAw/eDMwMC5qcGc',
                'image_gallery' => [
                    'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=600&q=80',
                    'https://images.unsplash.com/photo-1549924231-f129b911e442?auto=format&fit=crop&w=600&q=80',
                ],
            ],
            [
                'id' => 3,
                'name' => 'Shirt C',
                'category' => 'Clothes',
                'brand' => 'BrandZ',
                'price' => 29.99,
                'stock_quantity' => 10,
                'reviews_count' => 8,
                'created_at' => now()->subDays(5),
                'main_image' => 'https://imgs.search.brave.com/iCofL3P5FpV4KXjZQFI_hgehG-ulVDK_X5V3yHN9zVg/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9jb250/ZW50LmFwcC1zb3Vy/Y2VzLmNvbS9zLzcx/NTAwNjIzODM4NTY5/Mjc4L3VwbG9hZHMv/RG93bmxvYWRlZC9E/QUxMRV8yMDI0LTA1/LTA5XzIyLjM2LjQw/Xy1fQV9taW5pbWFs/aXN0X2Rlc2lnbl9z/aG93aW5nX2FfcGxh/aW5fYmxhY2tfYm94/X3dpdGhfbm9fdGV4/dF9vcl9ncmFwaGlj/c19yZXByZXNlbnRp/bmdfYV9TYW1wbGVz/X1BhY2thZ2VfZm9y/X2FfZGlnaXRhbF9w/cmludGktNTMwODcw/NC53ZWJwP2Zvcm1h/dD13ZWJw',
                'image_gallery' => [
                    'https://images.unsplash.com/photo-1581089781785-7fdf33527a14?auto=format&fit=crop&w=600&q=80',
                    'https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?auto=format&fit=crop&w=600&q=80',
                    'https://images.unsplash.com/photo-1598032896400-9f7823e7c718?auto=format&fit=crop&w=600&q=80',
                ],
            ],
            [
                'id' => 4,
                'name' => 'Headphones D',
                'category' => 'Electronics',
                'brand' => 'BrandX',
                'price' => 149.99,
                'stock_quantity' => 7,
                'reviews_count' => 20,
                'created_at' => now()->subDays(3),
                'main_image' => 'https://imgs.search.brave.com/W0o1uoll6zWT0vs60KACzxsoN1TEdjLG3btb4OMAzUY/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9zLmFs/aWNkbi5jb20vQHNj/MDQva2YvSGQxNjc2/MDdiYzg1ZjQzYjU4/ZDliYWIxMmY2YzJl/NDNlVC5qcGdfMzAw/eDMwMC5qcGc',
                'image_gallery' => [
                    'https://images.unsplash.com/photo-1580894732444-2c42df0a1e58?auto=format&fit=crop&w=600&q=80',
                    'https://images.unsplash.com/photo-1596075780758-972c27b230c4?auto=format&fit=crop&w=600&q=80',
                ],
            ],
        ]);


        $filtered = $fakeProducts;

        // Filter by categories
        if ($request->has('categories') && !empty($request->categories)) {
            $categories = is_array($request->categories) ? $request->categories : [$request->categories];
            $filtered = $filtered->whereIn('category', $categories);
        }

        // Filter by price range
        if ($request->has('min_price') && $request->min_price !== null) {
            $filtered = $filtered->where('price', '>=', $request->min_price);
        }

        if ($request->has('max_price') && $request->max_price !== null) {
            $filtered = $filtered->where('price', '<=', $request->max_price);
        }

        // Filter by brands
        if ($request->has('brands') && !empty($request->brands)) {
            $brands = is_array($request->brands) ? $request->brands : [$request->brands];
            $filtered = $filtered->whereIn('brand', $brands);
        }

        // Filter by availability
        if ($request->has('availability') && !empty($request->availability)) {
            $availability = $request->availability;
            $filtered = $filtered->filter(function ($product) use ($availability) {
                if (in_array('in_stock', $availability) && $product['stock_quantity'] > 0) {
                    return true;
                }
                if (in_array('out_of_stock', $availability) && $product['stock_quantity'] <= 0) {
                    return true;
                }
                return false;
            });
        }

        // Sorting
        $sortBy = $request->get('sort_by', 'created_at');
        $sortOrder = $request->get('sort_order', 'desc');

        switch ($sortBy) {
            case 'name':
                $filtered = $filtered->sortBy('name', SORT_REGULAR, $sortOrder === 'desc');
                break;
            case 'price':
                $filtered = $filtered->sortBy('price', SORT_REGULAR, $sortOrder === 'desc');
                break;
            case 'price_asc':
                $filtered = $filtered->sortBy('price', SORT_REGULAR, false);
                break;
            case 'price_desc':
                $filtered = $filtered->sortBy('price', SORT_REGULAR, true);
                break;
            case 'popular':
                $filtered = $filtered->sortBy('reviews_count', SORT_REGULAR, true); // Always desc for popularity
                break;
            default:
                $filtered = $filtered->sortBy('created_at', SORT_REGULAR, $sortOrder === 'desc');
                break;
        }

        // Pagination simulation (12 items per page)
        $page = (int) $request->get('page', 1);
        $perPage = 12;
        $paginated = $filtered->values()->forPage($page, $perPage);

        // Simulate paginator structure for Inertia
        $products = [
            'data' => $paginated->values(),
            'current_page' => $page,
            'last_page' => ceil($filtered->count() / $perPage),
            'per_page' => $perPage,
            'total' => $filtered->count(),
        ];

        // Filter options
        $categories = $fakeProducts->pluck('category')->unique()->filter()->values();
        $brands = $fakeProducts->pluck('brand')->unique()->filter()->values();
        $priceRange = [
            'min' => $fakeProducts->min('price'),
            'max' => $fakeProducts->max('price'),
        ];

        return Inertia::render('User/Product_index', [
            'products' => $products,
            'categories' => $categories,
            'brands' => $brands,
            'priceRange' => $priceRange,
            'filters' => $request->only(['categories', 'brands', 'min_price', 'max_price', 'availability', 'sort_by']),
            'totalCount' => $fakeProducts->count(),
        ]);
    }

    public function show($id)
    {
        // fake data with reviews added
        $fakeProducts = collect([
            [
                'id' => 1,
                'name' => 'Laptop A',
                'category' => 'Electronics',
                'brand' => 'BrandX',
                'price' => 999.99,
                'stock_quantity' => 5,
                'reviews_count' => 12,
                'created_at' => now()->subDays(1),
                'main_image' => 'https://imgs.search.brave.com/LCl2s8C4Wi7IRTLisio1QhZVzGE4wXeA0Y3N1XZtfBw/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9zLmFs/aWNkbi5jb20vQHNj/MDQva2YvSGJmZWNm/OWM0NmIyMDQ0NGI4/MDk0NTFhMDI5ZTlk/MDRmZy5qcGdfMzAw/eDMwMC5qcGc',
                'image_gallery' => [
                    'https://images.unsplash.com/photo-1587825140708-3b4f1d2cbd67?auto=format&fit=crop&w=600&q=80',
                    'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=600&q=80',
                    'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=600&q=80',
                ],
                'reviews' => [
                    [
                        'username' => 'Alice',
                        'rating' => 5,
                        'comment' => 'Fantastic laptop for the price!',
                        'date' => now()->subDays(1)->toDateString(),
                    ],
                    [
                        'username' => 'Bob',
                        'rating' => 4,
                        'comment' => 'Solid performance, but battery life could be better.',
                        'date' => now()->subDays(3)->toDateString(),
                    ],
                ],
            ],
            [
                'id' => 2,
                'name' => 'Phone B',
                'category' => 'Electronics',
                'brand' => 'BrandY',
                'price' => 599.99,
                'stock_quantity' => 0,
                'reviews_count' => 30,
                'created_at' => now()->subDays(2),
                'main_image' => 'https://imgs.search.brave.com/K8TjopIWTB6RWk7dAlOJq8Zl3yExMuTciKgCDXYw8oI/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9zLmFs/aWNkbi5jb20vQHNj/MDQva2YvSDBjNWU0/ODcwM2U2ZDRkY2Y4/NjUzMjRkMGI5NGVj/ZGIwUC5wbmdfMzAw/eDMwMC5qcGc',
                'image_gallery' => [
                    'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=600&q=80',
                    'https://images.unsplash.com/photo-1549924231-f129b911e442?auto=format&fit=crop&w=600&q=80',
                ],
                'reviews' => [
                    [
                        'username' => 'Charlie',
                        'rating' => 3,
                        'comment' => 'Average phone, expected more for the price.',
                        'date' => now()->subDays(4)->toDateString(),
                    ],
                    [
                        'username' => 'Dana',
                        'rating' => 5,
                        'comment' => 'Amazing camera and display!',
                        'date' => now()->subDays(2)->toDateString(),
                    ],
                ],
            ],
            [
                'id' => 3,
                'name' => 'Shirt C',
                'category' => 'Apparel',
                'brand' => 'BrandZ',
                'price' => 29.99,
                'stock_quantity' => 10,
                'reviews_count' => 8,
                'created_at' => now()->subDays(5),
                'main_image' => 'https://imgs.search.brave.com/iCofL3P5FpV4KXjZQFI_hgehG-ulVDK_X5V3yHN9zVg/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9jb250/ZW50LmFwcC1zb3Vy/Y2VzLmNvbS9zLzcx/NTAwNjIzODM4NTY5/Mjc4L3VwbG9hZHMv/RG93bmxvYWRlZC9E/QUxMRV8yMDI0LTA1/LTA5XzIyLjM2LjQw/Xy1fQV9taW5pbWFs/aXN0X2Rlc2lnbl9z/aG93aW5nX2FfcGxh/aW5fYmxhY2tfYm94/X3dpdGhfbm9fdGV4/dF9vcl9ncmFwaGlj/c19yZXByZXNlbnRp/bmdfYV9TYW1wbGVz/X1BhY2thZ2VfZm9y/X2FfZGlnaXRhbF9w/cmludGktNTMwODcw/NC53ZWJwP2Zvcm1h/dD13ZWJw',
                'image_gallery' => [
                    'https://images.unsplash.com/photo-1581089781785-7fdf33527a14?auto=format&fit=crop&w=600&q=80',
                    'https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?auto=format&fit=crop&w=600&q=80',
                    'https://images.unsplash.com/photo-1598032896400-9f7823e7c718?auto=format&fit=crop&w=600&q=80',
                ],
                'reviews' => [
                    [
                        'username' => 'Eve',
                        'rating' => 4,
                        'comment' => 'Nice fit and soft material.',
                        'date' => now()->subDays(6)->toDateString(),
                    ],
                ],
            ],
            [
                'id' => 4,
                'name' => 'Headphones D',
                'category' => 'Electronics',
                'brand' => 'BrandX',
                'price' => 149.99,
                'stock_quantity' => 7,
                'reviews_count' => 20,
                'created_at' => now()->subDays(3),
                'main_image' => 'https://imgs.search.brave.com/W0o1uoll6zWT0vs60KACzxsoN1TEdjLG3btb4OMAzUY/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9zLmFs/aWNkbi5jb20vQHNj/MDQva2YvSGQxNjc2/MDdiYzg1ZjQzYjU4/ZDliYWIxMmY2YzJl/NDNlVC5qcGdfMzAw/eDMwMC5qcGc',
                'image_gallery' => [
                    'https://images.unsplash.com/photo-1580894732444-2c42df0a1e58?auto=format&fit=crop&w=600&q=80',
                    'https://images.unsplash.com/photo-1596075780758-972c27b230c4?auto=format&fit=crop&w=600&q=80',
                ],
                'reviews' => [
                    [
                        'username' => 'Frank',
                        'rating' => 5,
                        'comment' => 'Best headphones I have used so far!',
                        'date' => now()->subDays(1)->toDateString(),
                    ],
                    [
                        'username' => 'Grace',
                        'rating' => 4,
                        'comment' => 'Great sound, but a bit bulky.',
                        'date' => now()->subDays(2)->toDateString(),
                    ],
                ],
            ],
        ]);

        $product = $fakeProducts->firstWhere('id', $id);
        if (is_null($product)) {
            abort(404);
        }

        $relatedProducts = $fakeProducts
            ->where('category', $product['category'])
            ->where('id', '!=', $product['id'])
            ->take(4)
            ->values();

        return Inertia::render('User/Product_details', [
            'product' => $product,
            'relatedProducts' => $relatedProducts,
        ]);
    }

}
