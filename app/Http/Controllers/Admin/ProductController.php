<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Controllers\ImageController;
use App\Http\Requests\Admin\StoreProductRequest;
use App\Http\Requests\Admin\UpdateProductRequest;
use Illuminate\Http\Request;
use App\Models\Product;
use App\Models\Category;
use App\Models\User;
use Inertia\Inertia;

class ProductController extends Controller
{
    protected $imageController;

    public function __construct(ImageController $imageController)
    {
        $this->imageController = $imageController;
    }
    
    // Product CRUD Methods
    public function index(Request $request)
    {
        $user = User::with('role')->find(auth()->id());
        
        // Lấy tất cả categories để hiển thị trong filter dropdown
        $categories = Category::orderBy('name')->get();
        
        $query = Product::with('category');
        
        // Tìm kiếm theo tên 
        if ($request->has('search') && $request->search) {
            $query->where('name', 'like', '%' . $request->search . '%');
        }
        
        // Lọc theo categories (hỗ trợ multiple categories với OR logic)
        if ($request->has('category') && $request->category) {
            $categoryNames = explode(',', $request->category);
            $query->whereHas('category', function ($q) use ($categoryNames) {
                $q->whereIn('name', $categoryNames);
            });
        }

        // Xử lý sorting
        $sortField = $request->get('sort', 'created_at');
        $sortDirection = $request->get('direction', 'desc');
        
        // Validate sort fields
        $allowedSortFields = ['id', 'name', 'price', 'stock_quantity', 'created_at'];
        if (in_array($sortField, $allowedSortFields)) {
            $query->orderBy($sortField, $sortDirection);
        } else {
            $query->latest();
        }
        
        // Xử lý phân trang
        $perPage = $request->get('per_page', 10);
        $perPage = in_array($perPage, [5, 10, 25, 50, 100]) ? $perPage : 10;
        
        $products = $query->paginate($perPage)->appends($request->query());

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
            'filters' => [
                'search' => $request->search,
                'category' => $request->category,
                'sort' => $request->sort,
                'direction' => $request->direction,
            ],
            'categories' => $categories
        ]);
    }

    public function create()
    {
        $user = User::with('role')->find(auth()->id());
        $categories = Category::all();

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
        $product = Product::create($productData);

        // Handle multiple images upload using ImageController generic method
        if ($request->hasFile('images')) {
            $this->imageController->storeImages('product', $product->id, $request->file('images'), 'products', $product->name);
        }

        return redirect()->route('admin.products.index')
            ->with('success', 'Product created successfully.');
    }

    public function show(Product $product)
    {
        $user = User::with('role')->find(auth()->id());
        $product->load(['category', 'images']);

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
        $categories = Category::all();
        $product->load(['category', 'images']);

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
        $product->update($productData);

        // Handle new images upload using ImageController generic method
        if ($request->hasFile('images')) {
            $this->imageController->storeImages('product', $product->id, $request->file('images'), 'products', $product->name);
        }

        return redirect()->route('admin.products.show', $product->id)
            ->with('success', 'Product updated successfully.');
    }

    public function destroy(Product $product)
    {
        // Delete all product images using ImageController
        $this->imageController->destroyImages('product', $product->id);
        
        $product->delete();

        return redirect()->route('admin.products.index')
            ->with('success', 'Product deleted successfully.');
    }

    public function destroyProductImage($productId, $imageId)
    {
        return $this->imageController->destroyImage($imageId);
    }
}
