<?php

namespace App\Repositories;

use App\Models\Product;
use App\Repositories\Interfaces\ProductRepositoryInterface;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

class ProductRepository implements ProductRepositoryInterface
{
    public function getAllProducts(array $filters = [], int $perPage = 10): LengthAwarePaginator
    {
        $query = Product::with('category');

        // Apply search filter
        if (isset($filters['search']) && !empty($filters['search'])) {
            $query->where('name', 'like', '%' . $filters['search'] . '%');
        }

        // Apply category filter
        if (isset($filters['category']) && !empty($filters['category'])) {
            $categoryNames = explode(',', $filters['category']);
            $query->whereHas('category', function ($q) use ($categoryNames) {
                $q->whereIn('name', $categoryNames);
            });
        }

        // Apply sorting
        $sortField = $filters['sort'] ?? 'created_at';
        $sortDirection = $filters['direction'] ?? 'desc';
        
        $allowedSortFields = ['id', 'name', 'price', 'stock_quantity', 'created_at'];
        if (in_array($sortField, $allowedSortFields)) {
            $query->orderBy($sortField, $sortDirection);
        } else {
            $query->latest();
        }

        return $query->paginate($perPage);
    }

    public function getProductById(int $id, array $relationships = []): ?Product
    {
        $query = Product::where('id', $id);
        
        if (!empty($relationships)) {
            $query->with($relationships);
        }
        
        return $query->first();
    }

    public function createProduct(array $data): Product
    {
        return Product::create($data);
    }

    public function updateProduct(Product $product, array $data): bool
    {
        return $product->update($data);
    }

    public function deleteProduct(Product $product): bool
    {
        return $product->delete();
    }

    public function getProductsWithActiveOrders(Product $product)
    {
        return $product->orderDetails()
            ->whereHas('order', function ($query) {
                $query->whereIn('status', ['pending', 'processing']);
            })
            ->with('order')
            ->get();
    }
}
