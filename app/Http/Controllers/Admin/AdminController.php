<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\Role;
use App\Models\Product;
use App\Models\Category;
use App\Models\Order;
use App\Models\Feedback;
use Illuminate\Http\Request;
use Inertia\Inertia;

class AdminController extends Controller
{
    public function dashboard()
    {
        $user = User::with('role')->find(auth()->id());

        $stats = [
            'revenue' => '97.5K',
            'orders' => Order::count() . 'K',
            'users' => User::count() . 'K',
            'products' => Product::count() . 'K'
        ];

        return Inertia::render('Admin/Dashboard', [
            'auth' => [
                'user' => [
                    'id' => $user->id,
                    'username' => $user->username,
                    'email' => $user->email,
                    'role' => $user->role ? $user->role->name : 'User'
                ]
            ],
            'stats' => $stats
        ]);
    }

    public function users()
    {
        $user = User::with('role')->find(auth()->id());
        $users = User::with('role')->latest()->get();

        return Inertia::render('Admin/Users/Index', [
            'auth' => [
                'user' => [
                    'id' => $user->id,
                    'username' => $user->username,
                    'email' => $user->email,
                    'role' => $user->role ? $user->role->name : 'User'
                ]
            ],
            'users' => $users->map(function ($user) {
                return [
                    'id' => $user->id,
                    'username' => $user->username,
                    'email' => $user->email,
                    'role' => $user->role ? $user->role->name : 'User',
                    'status' => 'active', // Add your logic here
                    'created_at' => $user->created_at->format('Y-m-d')
                ];
            })
        ]);
    }

    public function products()
    {
        $user = User::with('role')->find(auth()->id());
        $products = Product::with('category')->latest()->get();

        return Inertia::render('Admin/Products/Index', [
            'auth' => [
                'user' => [
                    'id' => $user->id,
                    'username' => $user->username,
                    'email' => $user->email,
                    'role' => $user->role ? $user->role->name : 'User'
                ]
            ],
            'products' => $products->map(function ($product) {
                return [
                    'id' => $product->id,
                    'name' => $product->name,
                    'price' => '$' . number_format($product->price, 2),
                    'category' => $product->category ? $product->category->name : 'Uncategorized',
                    'stock' => $product->stock_quantity ?? 0,
                    'image' => $product->images()->where('image_type', 'product')->first()?->image_path,
                    'created_at' => $product->created_at->format('Y-m-d')
                ];
            })
        ]);
    }

    public function categories()
    {
        $user = User::with('role')->find(auth()->id());
        $categories = Category::latest()->get();

        return Inertia::render('Admin/Categories/Index', [
            'auth' => [
                'user' => [
                    'id' => $user->id,
                    'username' => $user->username,
                    'email' => $user->email,
                    'role' => $user->role ? $user->role->name : 'User'
                ]
            ],
            'categories' => $categories->map(function ($category) {
                return [
                    'id' => $category->id,
                    'name' => $category->name,
                    'slug' => $category->slug ?? str_replace(' ', '-', strtolower($category->name)),
                    'description' => $category->description ?? 'No description',
                    'status' => $category->status ?? 'active',
                    'created_at' => $category->created_at->format('Y-m-d')
                ];
            })
        ]);
    }

    public function orders()
    {
        return $this->dashboard();
    }

    public function feedback()
    {
        return $this->dashboard();
    }

    public function analytics()
    {
        return $this->dashboard();
    }

    public function settings()
    {
        return $this->dashboard();
    }
}
