<?php

namespace App\Repositories\Interfaces;

use App\Models\Product;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

interface ProductRepositoryInterface
{
    public function getAllProducts(array $filters = [], int $perPage = 10): LengthAwarePaginator;
    
    public function getProductById(int $id, array $relationships = []): ?Product;
    
    public function createProduct(array $data): Product;
    
    public function updateProduct(Product $product, array $data): bool;
    
    public function deleteProduct(Product $product): bool;
    
    public function getProductsWithActiveOrders(Product $product);
}
