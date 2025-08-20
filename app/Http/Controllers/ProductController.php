<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Str;
use App\Models\Product;

class ProductController extends Controller
{
    public function index(Request $request)
    {
        $data = collect(Product::with(['category', 'images'])->get());
        $products = $data->map(function ($product) {
            return [
                'id' => $product->id,
                'name' => $product->name,
                'category' => $product->category->name ?? null,
                'price' => (float) $product->price,
                'stock_quantity' => $product->stock_quantity,
                'reviews_count' => $product->reviews_count ?? 0,
                'created_at' => $product->created_at,
                'main_image' => optional($product->images->first())->image_path
                    ? asset($product->images->first()->image_path)
                    : null,
            ];
        });

        $filtered = $products;

        // Search term
        if ($request->has('search') && $request->search !== null) {
            $term = strtolower($request->search);
            $filtered = $filtered->filter(function ($product) use ($term) {
                return str_contains(strtolower($product['name']), $term);
            });
        }

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
                if (in_array('in_stock', $availability) && $product['stock_quantity'] > 0) return true;
                if (in_array('out_of_stock', $availability) && $product['stock_quantity'] <= 0) return true;
                return false;
            });
        }

        // Sorting
        $sortBy = $request->get('sort_by', 'created_at');
        switch ($sortBy) {
            case 'name':
                $filtered = $filtered->sortBy('name', SORT_REGULAR, false);
                break;
            case 'price_asc':
                $filtered = $filtered->sortBy('price', SORT_REGULAR, false);
                break;
            case 'price_desc':
                $filtered = $filtered->sortBy('price', SORT_REGULAR, true);
                break;
            case 'popular':
                $filtered = $filtered->sortBy('reviews_count', SORT_REGULAR, true);
                break;
            default:
                $filtered = $filtered->sortBy('created_at', SORT_REGULAR, false);
                break;
        }

        // Pagination simulation
        $page = (int) $request->get('page', 1);
        $perPage = 12;
        $paginated = $filtered->values()->forPage($page, $perPage);

        // Paginator structure
        $productsPaginated = [
            'data' => $paginated->values(),
            'current_page' => $page,
            'last_page' => ceil($filtered->count() / $perPage),
            'per_page' => $perPage,
            'total' => $filtered->count(),
            'links' => collect(range(1, ceil($filtered->count() / $perPage)))->map(function ($p) use ($page) {
                return [
                    'url' => $p === $page ? null : url()->current() . '?' . http_build_query(array_merge(request()->except('page'), ['page' => $p])),
                    'label' => (string)$p,
                    'active' => $p === $page,
                ];
            })->prepend([
                'url' => $page > 1 ? url()->current() . '?' . http_build_query(array_merge(request()->except('page'), ['page' => $page - 1])) : null,
                'label' => '&laquo; Previous',
                'active' => false,
            ])->push([
                'url' => $page < ceil($filtered->count() / $perPage) ? url()->current() . '?' . http_build_query(array_merge(request()->except('page'), ['page' => $page + 1])) : null,
                'label' => 'Next &raquo;',
                'active' => false,
            ])->values(),
        ];

        $categories = $products->pluck('category')->unique()->filter()->values();
        $priceRange = [
            'min' => $filtered->min('price'),
            'max' => $filtered->max('price'),
        ];

        return Inertia::render('User/Product_index', [
            'products' => $productsPaginated,
            'categories' => $categories,
            'priceRange' => $priceRange,
            'filters' => $request->only(['categories', 'min_price', 'max_price', 'availability', 'sort_by', 'search']),
            'totalCount' => $filtered->count(),
        ]);
    }


    public function show($id)
    {
        $product = Product::with([
            'category',
            'images',
            'feedbacks.orderDetail.order.user' // go deeper to reach the user
        ])->find($id);

        if (!$product) {
            abort(404);
        }

        $productData = [
            'id' => $product->id,
            'name' => $product->name,
            'category' => $product->category->name ?? null,
            'price' => (float) $product->price,
            'stock_quantity' => $product->stock_quantity,
            'reviews_count' => $product->feedbacks->count(),
            'created_at' => $product->created_at,
            'image_gallery' => $product->images && $product->images->count() > 0
                ? $product->images->map(fn($image) => asset($image->image_path))->values()->all()
                : [],
            'feedback' => $product->feedbacks->count() > 0
                ? $product->feedbacks->map(function ($feedback) {
                    return [
                        'username' => $feedback->orderDetail->order->user->name ?? 'Anonymous',
                        'rating'   => $feedback->rating,
                        'comment'  => $feedback->feedback, // <-- use column name "feedback"
                        'date'     => $feedback->created_at->toDateString(),
                    ];
                })->values()->all()
                : [],
        ];

        $relatedProducts = Product::with(['category', 'images'])
            ->whereHas('category', fn($q) => $q->where('name', $product->category->name ?? ''))
            ->where('id', '!=', $product->id)
            ->take(4)
            ->get()
            ->map(function ($related) {
                return [
                    'id' => $related->id,
                    'name' => $related->name,
                    'category' => $related->category->name ?? null,
                    'price' => (float) $related->price,
                    'stock_quantity' => $related->stock_quantity,
                    'main_image' => $related->images->count() > 0
                        ? asset($related->images->first()->image_path)
                        : null,
                ];
            })
            ->values();

        return Inertia::render('User/Product_details', [
            'product' => $productData,
            'relatedProducts' => $relatedProducts,
        ]);
    }
}
