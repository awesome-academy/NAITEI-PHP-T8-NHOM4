<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\StoreProductRequest;
use App\Http\Requests\Admin\UpdateProductRequest;
use App\Services\ProductService;
use Illuminate\Http\Request;
use App\Models\Product;
use App\Models\User;
use Inertia\Inertia;

class ProductController extends Controller
{
    protected $productService;

    public function __construct(ProductService $productService)
    {
        $this->productService = $productService;
    }
    
    // Product CRUD Methods
    public function index(Request $request)
    {
        $user = User::with('role')->find(auth()->id());
        
        // Get filters from request
        $filters = [
            'search' => $request->search,
            'category' => $request->category,
            'sort' => $request->get('sort', 'created_at'),
            'direction' => $request->get('direction', 'desc'),
        ];
        
        $perPage = $request->get('per_page', 10);
        $perPage = in_array($perPage, [5, 10, 25, 50, 100]) ? $perPage : 10;
        
        $products = $this->productService->getAllProducts($filters, $perPage);
        $categories = $this->productService->getAllCategories();

        return Inertia::render('Admin/Products/Index', [
            'auth' => [
                'user' => [
                    'id' => $user->id,
                    'username' => $user->username,
                    'email' => $user->email,
                    'role' => $user->role ? $user->role->name : 'User'
                ]
            ],
            'products' => [
                'data' => collect($products->items())->map(function ($product) {
                    return [
                        'id' => $product->id,
                        'name' => $product->name,
                        'price' => '$' . number_format($product->price, 2),
                        'category' => $product->category ? $product->category->name : 'Uncategorized',
                        'stock_quantity' => $product->stock_quantity ?? 0,
                        'image' => $product->images()->where('image_type', 'product')->first()
                            ? asset(rawurldecode($product->images()->where('image_type', 'product')->first()->image_path))
                            : null,
                        'created_at' => $product->created_at->format('Y-m-d')
                    ];
                }),
                'current_page' => $products->currentPage(),
                'last_page' => $products->lastPage(),
                'per_page' => $products->perPage(),
                'total' => $products->total(),
                'from' => $products->firstItem(),
                'to' => $products->lastItem(),
                'next_page_url' => $products->nextPageUrl(),
                'prev_page_url' => $products->previousPageUrl(),
                'path' => $products->path(),
            ],
            'filters' => $filters,
            'categories' => $categories,
            'flash' => [
                'success' => session('success'),
                'error' => session('error'),
            ]
        ]);
    }

    public function create()
    {
        $user = User::with('role')->find(auth()->id());
        $categories = $this->productService->getAllCategories();

        return Inertia::render('Admin/Products/Create', [
            'auth' => [
                'user' => [
                    'id' => $user->id,
                    'username' => $user->username,
                    'email' => $user->email,
                    'role' => $user->role ? $user->role->name : 'User'
                ]
            ],
            'categories' => $categories
        ]);
    }

    public function store(StoreProductRequest $request)
    {
        $productData = $request->only(['name', 'description', 'price', 'category_id', 'stock_quantity']);
        $images = $request->hasFile('images') ? $request->file('images') : null;
        
        $product = $this->productService->createProduct($productData, $images);

        return redirect()->route('admin.products.index')
            ->with('success', 'Product created successfully.');
    }

    public function show(Product $product)
    {
        $user = User::with('role')->find(auth()->id());
        $product = $this->productService->getProductById($product->id, ['category', 'images']);

        return Inertia::render('Admin/Products/Show', [
            'auth' => [
                'user' => [
                    'id' => $user->id,
                    'username' => $user->username,
                    'email' => $user->email,
                    'role' => $user->role ? $user->role->name : 'User'
                ]
            ],
            'product' => [
                'id' => $product->id,
                'name' => $product->name,
                'description' => $product->description,
                'price' => $product->price,
                'stock_quantity' => $product->stock_quantity,
                'category_id' => $product->category_id,
                'category' => $product->category,
                'images' => $product->images,
                'created_at' => $product->created_at,
                'updated_at' => $product->updated_at,
            ]
        ]);
    }

    public function edit(Product $product)
    {
        $user = User::with('role')->find(auth()->id());
        $categories = $this->productService->getAllCategories();
        $product = $this->productService->getProductById($product->id, ['category', 'images']);

        return Inertia::render('Admin/Products/Edit', [
            'auth' => [
                'user' => [
                    'id' => $user->id,
                    'username' => $user->username,
                    'email' => $user->email,
                    'role' => $user->role ? $user->role->name : 'User'
                ]
            ],
            'product' => [
                'id' => $product->id,
                'name' => $product->name,
                'description' => $product->description,
                'price' => $product->price,
                'stock_quantity' => $product->stock_quantity,
                'category_id' => $product->category_id,
                'category' => $product->category,
                'images' => $product->images,
                'created_at' => $product->created_at,
                'updated_at' => $product->updated_at,
            ],
            'categories' => $categories
        ]);
    }

    public function update(UpdateProductRequest $request, Product $product)
    {
        $productData = $request->only(['name', 'description', 'price', 'category_id', 'stock_quantity']);
        $images = $request->hasFile('images') ? $request->file('images') : null;
        
        $this->productService->updateProduct($product, $productData, $images);

        return redirect()->route('admin.products.show', $product->id)
            ->with('success', 'Product updated successfully.');
    }

    public function destroy(Product $product)
    {
        $result = $this->productService->deleteProduct($product);

        if ($result['success']) {
            return redirect()->route('admin.products.index')
                ->with('success', $result['message']);
        } else {
            return redirect()->route('admin.products.index')
                ->with('error', $result['message']);
        }
    }

    public function destroyProductImage($productId, $imageId)
    {
        return $this->productService->destroyProductImage($imageId);
    }
}
