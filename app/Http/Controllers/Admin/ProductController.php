<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\Product;
use App\Models\Category;
use Inertia\Inertia;
use Illuminate\Http\Request;

class ProductController extends Controller
{
    public function createProduct()
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

    public function storeProduct(Request $request)
    {
        return redirect()->route('admin.products.index');
    }

    public function showProduct(Product $product)
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

   public function editProduct(Product $product)
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

    public function updateProduct(Request $request, Product $product)
    {
        return redirect()->route('admin.products.show', $product->id);
    }

    public function destroyProduct(Product $product)
    {
        return redirect()->route('admin.products.index');
    }
}
